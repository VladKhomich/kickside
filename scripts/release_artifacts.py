#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
"""Native, exact-version artifact installs shared by release publication gates."""
from contextlib import contextmanager
from fnmatch import fnmatchcase
import json
import os
import re
from pathlib import Path
import shutil
import subprocess
import tempfile


def approved_manifest(repository, commit):
    """Read publication ownership from the immutable release commit."""
    key = 'Hub-Artifact-Manifest-SHA256'
    message = subprocess.check_output(
        ['git', 'show', '-s', '--format=%B', commit], cwd=repository, text=True)
    mentions = re.findall(r'^' + key + r'\b.*$', message, re.IGNORECASE | re.MULTILINE)
    if not mentions:
        return None
    trailers = subprocess.check_output(['git', 'interpret-trailers', '--parse'],
                                      input=message, cwd=repository, text=True)
    values = re.findall(r'^' + key + r': ([0-9a-f]{64})$', trailers, re.MULTILINE | re.IGNORECASE)
    if len(mentions) != 1 or len(values) != 1:
        raise ValueError('Expected one valid ' + key + ' trailer on the release commit')
    return values[0].lower()


def matches_path(path, pattern):
    """Match module-relative path segments, with ** spanning zero or more."""
    if not pattern:
        return not path
    if pattern[0] == '**':
        return any(matches_path(path[i:], pattern[1:]) for i in range(len(path) + 1))
    return bool(path and fnmatchcase(path[0], pattern[0]) and matches_path(path[1:], pattern[1:]))


def registry_entry(wippy, config, lock, *args):
    return json.loads(subprocess.check_output(
        [wippy, '--config', str(config), 'registry', *args, '--lock-file', str(lock), '--json'],
        cwd=lock.parent, text=True))


def filtered_module(source, stage, embeds, wippy, config, lock):
    # Native pack filters registry entries, but fs.directory embeds every file
    # below its directory. Apply the manifest's path patterns to those inputs.
    manifest = source / 'wippy.yaml'
    if not embeds or not manifest.is_file():
        return source
    import yaml
    configuration = yaml.safe_load(manifest.read_text()) or {}
    patterns = [Path(pattern).parts for pattern in configuration.get('exclude') or [] if ':' not in pattern]
    if not patterns:
        return source
    directories = set()
    excluded = set()
    for entry in registry_entry(wippy, config, lock, 'list', '--kind', 'fs.directory'):
        entry_id = entry['id']
        if not {'*', '**', entry_id, entry_id.split(':')[-1]}.intersection(embeds):
            continue
        data = registry_entry(wippy, config, lock, 'show', entry_id)['data']
        directory = Path(os.path.normpath(data['directory']))
        if directory.is_absolute() or '..' in directory.parts or data.get('base') == 'project':
            continue
        directories.add(directory)
        exclude_root = any(matches_path(parent.parts, pattern) for parent in (directory, *directory.parents)
                           for pattern in patterns)
        for parent, folders, files in os.walk(source / directory):
            relative = Path(parent).relative_to(source)
            for name in [*folders, *files]:
                path = relative / name
                if exclude_root or any(matches_path(path.parts, pattern) for pattern in patterns):
                    excluded.add(path)
                    if name in folders:
                        folders.remove(name)

    if not excluded:
        return source
    # Mirror the affected top-level trees so registry source and nested assets
    # retain their directory structure. Other inputs can be used in place.
    affected = {path.parts[0] for path in excluded}

    def ignore(parent, names):
        relative = Path(parent).relative_to(source)
        return [name for name in names if relative / name in excluded]

    if Path('.') in directories:
        shutil.copytree(source, stage, symlinks=True, ignore=ignore)
    else:
        stage.mkdir()
        for item in source.iterdir():
            target = stage / item.name
            if item.name in affected:
                shutil.copytree(item, target, symlinks=True, ignore=ignore)
            else:
                target.symlink_to(item, target_is_directory=item.is_dir())
    # Overlapping embeds may both select a directory and exclude its contents.
    for directory in directories:
        if not (stage / directory).exists() and (source / directory).is_dir():
            (stage / directory).mkdir(parents=True)
    return stage


@contextmanager
def prepared_artifact(repository, module, wippy):
    # Let the native CLI select and pack only this owner. Publish these exact
    # bytes; a separate `publish --dry-run` produces a different envelope.
    with tempfile.TemporaryDirectory(prefix='kickside-release-pack-') as directory:
        root = Path(directory)
        lock = root / 'wippy.lock'
        lock.write_text(json.dumps({'directories': {'src': 'empty', 'modules': '.wippy'},
                                   'modules': [{'name': module['name'], 'version': module['version']}]}))
        config = root / '.wippy.yaml'
        source = (repository / module['path']).resolve()

        def use_source(path):
            config.write_text(json.dumps({'version': '1.0', 'workspace': {'replacements': {
                module['name']: str(path)}}}))

        use_source(source)
        staged = filtered_module(source, root / 'module', module['embed'], wippy, config, lock)
        if staged != source:
            use_source(staged)
        output = root / 'module.wapp'
        args = [wippy, 'pack', '--lock-file', str(lock), '--config', str(config),
                '--module', module['name']]
        for entry in module['embed']:
            args += ['--embed', entry]
        subprocess.run([*args, str(output)], cwd=repository, check=True)
        yield output


def companion_modules(repository, paths):
    if not isinstance(paths, list) or not paths or any(not isinstance(path, str) for path in paths):
        raise ValueError('Release Please must supply the released paths')
    catalog = json.loads((repository / '.github/modules.json').read_text())['modules']
    versions = json.loads((repository / '.release-please-manifest.json').read_text())
    modules = []
    for path in sorted(set(paths) - {'app'}):
        module = catalog[path]
        modules.append({**module, 'path': path, 'name': module['organization'] + '/' + module['module'],
                        'version': versions[path]})
    return modules


def declared_dependencies(wippy, *, source, module=None):
    """Inspect a tagged source tree through Wippy without resolving Hub versions."""
    with tempfile.TemporaryDirectory(prefix='kickside-release-deps-') as directory:
        root = Path(directory)
        lock = root / 'wippy.lock'
        config = root / '.wippy.yaml'
        modules, replacements = [], {}
        if module is not None:
            name = module['name']
            modules.append({'name': name, 'version': module['version']})
            replacements[name] = str(source)
            source = root / 'empty'
            source.mkdir()
        lock.write_text(json.dumps({'directories': {'src': str(source), 'modules': str(root / '.wippy')},
                                    'modules': modules}))
        config.write_text(json.dumps({'version': '1.0', 'workspace': {'replacements': replacements}}))
        entries = registry_entry(wippy, config, lock, 'list', '--kind', 'ns.dependency')
        return {registry_entry(wippy, config, lock, 'show', entry['id'])['data']['component']
                for entry in entries}


@contextmanager
def installed_artifacts(modules, wippy):
    # A lock install fetches only the named versions and verifies their digests.
    # It does not resolve checkout replacements or execute module code.
    with tempfile.TemporaryDirectory(prefix='kickside-release-artifacts-') as directory:
        root = Path(directory)
        (root / 'empty').mkdir()
        lock = root / 'wippy.lock'
        vendor = root / 'modules/vendor'
        lock.write_text(json.dumps({'directories': {'src': str(root / 'empty'), 'modules': str(root / 'modules')},
                                    'modules': [{'name': item['name'], 'version': item['version']} for item in modules]}))
        config = root / '.wippy.yaml'
        config.write_text(json.dumps({'version': '1.0', 'registry': {
            'dependency_lock_path': str(lock), 'dependency_vendor_dir': str(vendor)},
            'workspace': {'include_host_dependencies': False}}))
        subprocess.run([wippy, '--config', str(config), 'install'], cwd=root, check=True,
                       capture_output=True, text=True)
        yield vendor
