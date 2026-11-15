# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
"""PR matrices follow source ownership and transitive dependencies."""
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

import yaml

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from ci_matrix import select_matrix


class MatrixTests(unittest.TestCase):
    def setUp(self):
        self.scratch = tempfile.TemporaryDirectory()
        self.addCleanup(self.scratch.cleanup)
        self.root = Path(self.scratch.name)
        self.git('init', '-q')
        self.git('config', 'user.name', 'Test')
        self.git('config', 'user.email', 'test@example.invalid')
        self.paths = ['core/base', 'platform/middle', 'platform/leaf', 'platform/other']
        self.matrix = {'include': [
            {'module': module, 'engine': engine, 'commands': 'test ' + module}
            for module in self.paths for engine in ('sqlite', 'postgres')]}
        self.write('.github/module-matrix.json', json.dumps(self.matrix))
        for module in self.paths:
            self.write(module + '/wippy.yaml',
                       'organization: example\nmodule: ' + module.split('/')[-1] + '\n')
        self.dependency('platform/middle', 'base')
        self.dependency('platform/leaf', 'middle', directory='test')
        self.base = self.commit()

    def git(self, *args):
        return subprocess.check_output(['git', *args], cwd=self.root, text=True).strip()

    def write(self, path, content):
        target = self.root / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content)

    def dependency(self, module, dependency, directory='src'):
        self.write(f'{module}/{directory}/_index.yaml', yaml.safe_dump({
            'entries': [{'kind': 'ns.dependency', 'component': 'example/' + dependency}]}))

    def commit(self):
        self.git('add', '.')
        self.git('commit', '-qm', 'test fixture')
        return self.git('rev-parse', 'HEAD')

    def select(self, event_name='pull_request', branch='feature'):
        return select_matrix(self.root, event_name, {'pull_request': {
            'base': {'sha': self.base}, 'head': {'sha': self.git('rev-parse', 'HEAD'), 'ref': branch}}})

    def assert_modules(self, expected, **kwargs):
        result = self.select(**kwargs)
        self.assertEqual(result, {'include': [row for row in self.matrix['include']
                                             if row['module'] in expected]})

    def test_one_module_keeps_its_engines_and_commands(self):
        self.write('platform/other/source.lua', 'return {}')
        self.commit()
        self.assert_modules(['platform/other'])

    def test_core_change_selects_transitive_source_and_harness_dependents(self):
        self.write('core/base/source.lua', 'return {}')
        self.commit()
        self.assert_modules(self.paths[:3])

    def test_dependencies_use_manifest_identity_and_terminate_on_cycles(self):
        self.write('platform/other/wippy.yaml', 'organization: example\nmodule: renamed\n')
        self.dependency('platform/middle', 'renamed')
        self.dependency('platform/other', 'middle')
        self.base = self.commit()
        self.write('platform/other/source.lua', 'return {}')
        self.commit()
        self.assert_modules(self.paths[1:])

    def test_external_dependencies_and_non_dependency_entries_add_no_edges(self):
        self.write('platform/leaf/src/_index.yaml', '''entries:
  - kind: ns.dependency
    component: elsewhere/other
  - kind: registry.entry
    component: example/other
''')
        self.base = self.commit()
        self.write('platform/other/source.lua', 'return {}')
        self.commit()
        self.assert_modules(['platform/other'])

    def test_local_frontend_source_imports_select_their_consumers(self):
        self.write('platform/leaf/ui/vite.config.ts',
                   "export default {alias: {shared: resolve(__dirname, '../../other/ui/src')}}\n")
        self.base = self.commit()
        self.write('platform/other/ui/src/control.ts', 'export const value = 1')
        self.commit()
        self.assert_modules(['platform/other', 'platform/leaf'])

    def test_shared_build_dependencies_select_every_module(self):
        self.dependency('build-inputs', 'other')
        self.base = self.commit()
        self.write('platform/other/source.lua', 'return {}')
        self.commit()
        self.assert_modules(self.paths)

    def test_renames_select_both_source_and_destination_owners(self):
        self.write('platform/other/move.lua', 'return {}')
        self.base = self.commit()
        self.git('mv', 'platform/other/move.lua', 'platform/leaf/move.lua')
        self.commit()
        self.assert_modules(['platform/other', 'platform/leaf'])

    def test_deletions_select_the_owner_and_dependents(self):
        self.git('rm', 'platform/middle/src/_index.yaml')
        self.commit()
        self.assert_modules(['platform/middle', 'platform/leaf'])

    def test_diff_uses_the_merge_base(self):
        self.write('platform/other/source.lua', 'return {}')
        head = self.commit()
        self.git('reset', '--hard', self.base)
        self.write('core/base/unrelated.lua', 'return {}')
        base = self.commit()
        result = select_matrix(self.root, 'pull_request', {'pull_request': {
            'base': {'sha': base}, 'head': {'sha': head, 'ref': 'feature'}}})
        self.assertEqual({row['module'] for row in result['include']}, {'platform/other'})

    def test_shared_paths_select_the_full_matrix(self):
        for path in ('.github/workflows/ci.yml', 'Makefile', 'scripts/build.py',
                     'build-inputs/source.lua', 'root-config.yaml', 'core/shared.lua'):
            with self.subTest(path=path):
                self.write(path, 'shared input')
                self.commit()
                self.assert_modules(self.paths)
                self.git('reset', '--hard', self.base)

    def test_main_push_dispatch_and_reusable_workflow_keep_the_full_matrix(self):
        for event_name in ('push', 'workflow_dispatch', 'workflow_call'):
            with self.subTest(event=event_name):
                self.assertEqual(select_matrix(self.root, event_name, {}), self.matrix)

    def test_release_please_pr_keeps_the_full_matrix(self):
        self.write('platform/other/source.lua', 'return {}')
        self.commit()
        self.assert_modules(self.paths, branch='release-please--branches--main')

    def test_empty_diff_emits_no_jobs(self):
        self.assert_modules([])

    def test_missing_diff_commit_fails(self):
        self.base = 'f' * 40
        with self.assertRaises(subprocess.CalledProcessError):
            self.select()

    def test_invalid_dependency_yaml_fails(self):
        self.write('platform/other/src/_index.yaml', 'entries: [ns.dependency')
        self.commit()
        with self.assertRaises(yaml.YAMLError):
            self.select()

    def test_cli_writes_matrix_and_module_outputs(self):
        self.write('platform/other/source.lua', 'return {}')
        head = self.commit()
        event = self.root / 'event.json'
        event.write_text(json.dumps({'pull_request': {
            'base': {'sha': self.base}, 'head': {'sha': head, 'ref': 'feature'}}}))
        output = self.root / 'output'
        subprocess.run([sys.executable, str(ROOT / 'scripts/ci_matrix.py'),
                        '--repository', str(self.root)], check=True, capture_output=True,
                       text=True, timeout=30, env={**os.environ, 'GITHUB_EVENT_NAME': 'pull_request',
                       'GITHUB_EVENT_PATH': str(event), 'GITHUB_OUTPUT': str(output)})
        values = dict(line.split('=', 1) for line in output.read_text().splitlines())
        self.assertEqual(json.loads(values['modules']), ['platform/other'])
        self.assertEqual(json.loads(values['matrix']), {'include': self.matrix['include'][-2:]})


class WorkflowTests(unittest.TestCase):
    def test_workflow_consumes_selection_and_keeps_check_names(self):
        jobs = yaml.safe_load((ROOT / '.github/workflows/ci.yml').read_text())['jobs']
        modules = jobs['modules']
        self.assertEqual(modules['name'], '${{ matrix.module }} / ${{ matrix.engine }}')
        self.assertEqual(modules['needs'], 'select-modules')
        self.assertEqual(modules['strategy']['matrix'],
                         '${{ fromJSON(needs.select-modules.outputs.matrix) }}')
        self.assertIn("needs.select-modules.outputs.modules != '[]'", modules['if'])
        self.assertIn('fromJSON(needs.select-modules.outputs.modules)', jobs['app-release-assets']['if'])
        selector = jobs['select-modules']
        checkout = next(step for step in selector['steps'] if 'uses' in step)
        self.assertEqual(checkout['with']['fetch-depth'], 0)
        commands = '\n'.join(step.get('run', '') for step in selector['steps'])
        self.assertIn('test_ci_matrix.py', commands)
        self.assertIn('scripts/ci_matrix.py', commands)

    def test_full_matrix_matches_the_module_catalog_and_engine_profiles(self):
        matrix = json.loads((ROOT / '.github/module-matrix.json').read_text())['include']
        catalog = json.loads((ROOT / '.github/modules.json').read_text())['modules']
        expected = {(module, engine) for module, spec in catalog.items()
                    for engine in ['sqlite', *spec['profiles']]}
        self.assertEqual({(row['module'], row['engine']) for row in matrix}, expected)
        self.assertEqual(len(matrix), len(expected))
        self.assertTrue(all(row['commands'].startswith('set -euo pipefail\n') for row in matrix))


if __name__ == '__main__':
    unittest.main()
