#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
"""Build and publish companion modules from the exact Release Please tags."""
import argparse
from graphlib import CycleError, TopologicalSorter
import hashlib
from heapq import heapify, heappop, heappush
import json
import os
from pathlib import Path
import subprocess
import sys

from release_artifacts import companion_modules, declared_dependencies, installed_artifacts, prepared_artifact


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


def publish(repository, paths, wippy):
    modules = companion_modules(repository, paths)
    packages = json.loads((repository / 'release-please-config.json').read_text())['packages']
    head = git(repository, 'rev-parse', 'HEAD')
    if modules and git(repository, 'status', '--porcelain', '--untracked-files=all'):
        raise ValueError('Release must have a clean checkout before building')
    # Validate the entire cohort before starting a build or publication.
    for module in modules:
        tag = packages[module['path']]['component'] + '-v' + module['version']
        if git(repository, 'rev-parse', tag + '^{commit}') != head:
            raise ValueError('Publish from the exact release tag: ' + tag)
    for module in publication_order(repository, modules, wippy):
        name, version = module['name'], module['version']
        print('Preparing ' + name + '@' + version, flush=True)
        if 'build' in module['targets']:
            subprocess.run(['make', '-C', str(repository / module['path']), 'build'], check=True)
        args = [wippy, 'publish', '--config', str(repository / module['path']), '--version', version,
                '--module-type', module['type']]
        filename = module['module'] + '-' + version + '.wapp'
        with prepared_artifact(repository, module, wippy) as artifact:
            expected = digest(artifact)
            try:
                with installed_artifacts([module], wippy) as vendor:
                    published = vendor / module['organization'] / filename
                    if not published.is_file() or digest(published) != expected:
                        raise ValueError('Published artifact differs from the prepared release: ' + name + '@' + version)
                    print('Already published with matching digest: ' + name + '@' + version, flush=True)
                    continue
            except subprocess.CalledProcessError as error:
                missing = 'failed to download module: ' + name + '@' + version + ': module not found'
                if missing not in (error.stdout or '') + (error.stderr or ''):
                    raise
            subprocess.run([*args, '--wapp', str(artifact), '--create', '--module-visibility', module['visibility']],
                           cwd=repository, check=True)
            with installed_artifacts([module], wippy) as vendor:
                if digest(vendor / module['organization'] / filename) != expected:
                    raise ValueError('Published artifact digest differs: ' + name + '@' + version)
        print('Verified ' + name + '@' + version, flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repository', type=Path, required=True)
    parser.add_argument('--wippy', default='wippy')
    args = parser.parse_args()
    try:
        publish(args.repository.resolve(), json.loads(os.environ['RELEASE_PATHS_JSON']), args.wippy)
    except subprocess.CalledProcessError as error:
        print(error.stdout or '', file=sys.stderr)
        print(error.stderr or '', file=sys.stderr)
        raise
