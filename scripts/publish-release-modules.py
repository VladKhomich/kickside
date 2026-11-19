#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
"""Publish the exact native archives verified against a Release Please PR."""
import argparse
from graphlib import CycleError, TopologicalSorter
import hashlib
from heapq import heapify, heappop, heappush
import json
import re
import shutil
from pathlib import Path
import subprocess
import sys
import tempfile

from release_artifacts import companion_modules, declared_dependencies, installed_artifacts


def git(repository, *args):
    return subprocess.check_output(['git', *args], cwd=repository, text=True).strip()


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def publication_order(repository, modules, wippy):
    if len(modules) < 2:
        return modules
    # Keep the previous source/build and path ordering for independent modules.
    modules = sorted(modules, key=lambda item: ('build' in item['targets'], item['path']))
    positions = {module['name']: index for index, module in enumerate(modules)}
    build_dependencies = {}
    graph = TopologicalSorter()
    for module in modules:
        dependencies = declared_dependencies(wippy, source=repository / module['path'], module=module)
        if 'build' in module['targets']:
            inputs = subprocess.check_output(
                ['make', '-s', '--no-print-directory', 'release-build-inputs', 'MOD=' + module['module']],
                cwd=repository, text=True)
            for path in inputs.splitlines():
                if path not in build_dependencies:
                    build_dependencies[path] = declared_dependencies(wippy, source=repository / path)
                dependencies.update(build_dependencies[path])
        graph.add(module['name'], *(dependencies & positions.keys()))
    try:
        graph.prepare()
    except CycleError as error:
        raise ValueError('Companion publication dependency cycle: ' + ' -> '.join(error.args[1])) from error

    ready = [positions[name] for name in graph.get_ready()]
    heapify(ready)
    ordered = []
    while ready:
        module = modules[heappop(ready)]
        ordered.append(module)
        graph.done(module['name'])
        for name in graph.get_ready():
            heappush(ready, positions[name])
    return ordered


def verified_release(repository, evidence):
    release = json.loads((evidence / 'release.json').read_text())
    base, candidate, tree = (release[field] for field in ('base', 'head', 'source_tree'))
    if release['repository'] != 'kickside' or not all(
            re.fullmatch('[0-9a-f]{40}', value) for value in (base, candidate, tree)):
        raise ValueError('Expected a Kickside release proof with exact commit and tree IDs')
    if git(repository, 'status', '--porcelain', '--untracked-files=all'):
        raise ValueError('Release must have a clean checkout')
    head = git(repository, 'rev-parse', 'HEAD')
    if git(repository, 'show', '-s', '--format=%P', head) != base:
        raise ValueError('Tagged release parent differs from the verified Release Please base')
    if git(repository, 'rev-parse', 'HEAD^{tree}') != tree:
        raise ValueError('Tagged release tree differs from the verified Release Please head')

    before = json.loads(git(repository, 'show', base + ':.release-please-manifest.json'))
    versions = json.loads((repository / '.release-please-manifest.json').read_text())
    paths = sorted(path for path, version in versions.items() if before.get(path) != version)
    if before.keys() - versions.keys() or release['changed_public_paths'] != paths:
        raise ValueError('Tagged release manifest changes differ from verification')
    modules = companion_modules(repository, paths)
    if 'app' in paths:
        app = json.loads((repository / '.github/modules.json').read_text())['modules']['app']
        modules.append(dict(app, path='app', version=versions['app'],
                            name=app['organization'] + '/' + app['module']))
    packages = json.loads((repository / 'release-please-config.json').read_text())['packages']
    proofs = json.loads((evidence / 'artifacts.json').read_text())
    engines = [json.loads((evidence / engine / 'artifacts.json').read_text())
               for engine in ('sqlite', 'postgres')]
    names = {module['name'] for module in modules}
    if set(proofs) != names or any(set(rows) != names for rows in engines):
        raise ValueError('Expected both smoke engines to report every changed package')
    for module in modules:
        path, name, version = (module[field] for field in ('path', 'name', 'version'))
        if module['visibility'] != 'public':
            raise ValueError('Expected a public release package: ' + path)
        tag = packages[path]['component'] + '-v' + version
        if git(repository, 'rev-parse', '--verify', 'refs/tags/' + tag + '^{commit}') != head:
            raise ValueError('Publish from the exact release tag: ' + tag)
        proof = proofs[name]
        filename = name.replace('/', '_') + '-' + version + '.wapp'
        if (proof['path'], proof['version'], proof['artifact']) != (path, version, filename) or not re.fullmatch(
                '[0-9a-f]{64}', proof['sha256']):
            raise ValueError('Invalid verified archive identity: ' + name)
        for rows in engines:
            row = rows[name]
            allowed = ('exercised',) if path == 'app' else ('exercised', 'packed-only')
            if row['state'] not in allowed or any(row[key] != value for key, value in proof.items()):
                raise ValueError('Smoke evidence differs from the verified archive: ' + name)
    return modules, proofs


def publish_archive(repository, module, wippy, artifact, expected):
    name, version = module['name'], module['version']
    filename = module['module'] + '-' + version + '.wapp'
    try:
        with installed_artifacts([module], wippy) as vendor:
            published = vendor / module['organization'] / filename
            if not published.is_file() or digest(published) != expected:
                raise ValueError('Published artifact differs from the verified release: ' + name + '@' + version)
            print('Already published with matching digest: ' + name + '@' + version, flush=True)
            return
    except subprocess.CalledProcessError as error:
        missing = 'failed to download module: ' + name + '@' + version + ': module not found'
        if missing not in (error.stdout or '') + (error.stderr or ''):
            raise
    args = [wippy, 'publish', '--config', str(repository / module['path']), '--version', version,
            '--module-type', module['type'], '--wapp', str(artifact),
            '--create', '--module-visibility', module['visibility']]
    subprocess.run(args, cwd=repository, check=True)
    with installed_artifacts([module], wippy) as vendor:
        if digest(vendor / module['organization'] / filename) != expected:
            raise ValueError('Published artifact digest differs: ' + name + '@' + version)
    print('Verified ' + name + '@' + version, flush=True)


def publish(repository, evidence, wippy, *, verify_only=False):
    modules, proofs = verified_release(repository, evidence)
    companion = [module for module in modules if module['path'] != 'app']
    app = [module for module in modules if module['path'] == 'app']
    ordered = publication_order(repository, companion, wippy) + app
    # Stage the full cohort before the first Hub operation. Wippy publishes the
    # same verified bytes even if the caller edits its evidence during the run.
    with tempfile.TemporaryDirectory(prefix='kickside-publish-verified-') as directory:
        staged = {}
        for module in ordered:
            name = module['name']
            proof = proofs[name]
            artifact = Path(directory) / proof['artifact']
            shutil.copyfile(evidence / proof['artifact'], artifact)
            if digest(artifact) != proof['sha256']:
                raise ValueError('Archive bytes differ from the verified release: ' + name)
            staged[name] = artifact
            print(f'Checked {name}@{module["version"]} sha256:{proof["sha256"]}', flush=True)
        if verify_only:
            return
        for module in ordered:
            name = module['name']
            publish_archive(repository, module, wippy, staged[name], proofs[name]['sha256'])


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repository', type=Path, required=True)
    parser.add_argument('--evidence', type=Path, required=True)
    parser.add_argument('--wippy', default='wippy')
    parser.add_argument('--verify-only', action='store_true')
    args = parser.parse_args()
    try:
        publish(args.repository.resolve(), args.evidence.resolve(), args.wippy, verify_only=args.verify_only)
    except subprocess.CalledProcessError as error:
        print(error.stdout or '', file=sys.stderr)
        print(error.stderr or '', file=sys.stderr)
        raise
