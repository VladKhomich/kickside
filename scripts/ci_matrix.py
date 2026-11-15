#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
"""Select native gates for a PR and its transitive in-repository consumers."""
import argparse
import json
import os
from pathlib import Path
import re
import subprocess

import yaml


def git_paths(repository, *arguments):
    output = subprocess.check_output(['git', *arguments], cwd=repository)
    return output.decode().rstrip('\0').split('\0') if output else []


def owner(path, modules):
    return next((module for module in modules if path.startswith(module + '/')), None)


def dependency_graph(repository, modules):
    identities = {}
    for module in modules:
        manifest = yaml.safe_load((repository / module / 'wippy.yaml').read_text())
        identities[manifest['organization'] + '/' + manifest['module']] = module
    consumers = {module: set() for module in modules}
    for path in git_paths(repository, 'ls-files', '-z'):
        source = repository / path
        module = owner(path, modules)
        dependencies = set()
        if source.suffix in ('.yaml', '.yml'):
            text = source.read_text()
            if 'ns.dependency' in text:
                for document in yaml.safe_load_all(text):
                    if isinstance(document, dict):
                        for entry in document.get('entries', []):
                            if entry.get('kind') == 'ns.dependency':
                                dependency = identities.get(entry['component'])
                                if dependency:
                                    dependencies.add(dependency)
        # Frontend aliases and relative imports also consume sibling source.
        if module and source.suffix in ('.json', '.ts', '.tsx', '.js', '.mjs', '.vue'):
            for reference in re.findall(r'''["'](\.{1,2}/[^"'\n]+)["']''', source.read_text()):
                target = (source.parent / reference).resolve()
                if target.is_relative_to(repository):
                    dependency = owner(target.relative_to(repository).as_posix() + '/', modules)
                    if dependency:
                        dependencies.add(dependency)
        for dependency in dependencies:
            # A declaration outside a module belongs to shared infrastructure.
            consumers[dependency].add(module)
    return consumers


def select_matrix(repository, event_name, event):
    repository = repository.resolve()
    matrix = json.loads((repository / '.github/module-matrix.json').read_text())
    if event_name != 'pull_request' or event['pull_request']['head']['ref'].startswith('release-please--'):
        return matrix
    pull_request = event['pull_request']
    changed = git_paths(repository, 'diff', '--name-only', '-z', '--no-renames',
                        pull_request['base']['sha'] + '...' + pull_request['head']['sha'], '--')
    modules = sorted({row['module'] for row in matrix['include']})
    selected = {owner(path, modules) for path in changed}
    if None in selected:
        return matrix
    consumers = dependency_graph(repository, modules)
    pending = list(selected)
    while pending:
        for consumer in consumers[pending.pop()]:
            if consumer is None:
                return matrix
            if consumer not in selected:
                selected.add(consumer)
                pending.append(consumer)
    return {'include': [row for row in matrix['include'] if row['module'] in selected]}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repository', type=Path, default=Path.cwd())
    arguments = parser.parse_args()
    event = json.loads(Path(os.environ['GITHUB_EVENT_PATH']).read_text())
    matrix = select_matrix(arguments.repository, os.environ['GITHUB_EVENT_NAME'], event)
    modules = sorted({row['module'] for row in matrix['include']})
    with open(os.environ['GITHUB_OUTPUT'], 'a') as output:
        output.write('matrix=' + json.dumps(matrix, separators=(',', ':')) + '\n')
        output.write('modules=' + json.dumps(modules, separators=(',', ':')) + '\n')
    print(f'Select {len(modules)} modules / {len(matrix["include"])} module-engine jobs')
    print('\n'.join(modules))


if __name__ == '__main__':
    main()
