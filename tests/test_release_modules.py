#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
"""Exercise release failure/recovery with real subprocesses and a fixture registry."""
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

from release_registry_fixture import FAKE_WIPPY

SCRIPTS = Path(__file__).resolve().parents[1] / 'scripts'
sys.path.insert(0, str(SCRIPTS))
spec = importlib.util.spec_from_file_location('release_publisher', SCRIPTS / 'publish-release-modules.py')
publisher = importlib.util.module_from_spec(spec)
spec.loader.exec_module(publisher)

class ReleasePublication(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)
        self.state = self.root / 'registry'
        self.state.mkdir()
        self.wippy = self.root / 'fixture-wippy'
        self.wippy.write_text(FAKE_WIPPY)
        self.wippy.chmod(0o755)
        self.env = patch.dict(os.environ, {'RELEASE_TEST_STATE': str(self.state)})
        self.env.start()
        self.addCleanup(self.env.stop)
        (self.root / '.gitignore').write_text('registry/\nfixture-wippy\n')
        self.modules = {
            'platform/first': {'path': 'platform/first', 'organization': 'fixture', 'module': 'first',
                               'type': 'library', 'visibility': 'public', 'embed': [], 'targets': []},
            'platform/page': {'path': 'platform/page', 'organization': 'fixture', 'module': 'page',
                              'type': 'plugin', 'visibility': 'public', 'embed': ['fixture.page:ui_fs'], 'targets': ['build']},
            'platform/runtime': {'path': 'platform/runtime', 'organization': 'fixture', 'module': 'runtime',
                                 'type': 'library', 'visibility': 'public', 'embed': [], 'targets': []},
            'platform/tool': {'path': 'platform/tool', 'organization': 'fixture', 'module': 'tool',
                              'type': 'library', 'visibility': 'public', 'embed': [], 'targets': ['build']},
        }
        (self.root / '.github').mkdir()
        (self.root / '.github/modules.json').write_text(json.dumps({'modules': self.modules}))
        (self.root / '.release-please-manifest.json').write_text(json.dumps({path: '1.2.3' for path in self.modules}))
        (self.root / 'release-please-config.json').write_text(json.dumps({'packages': {
            path: {'component': module['module']} for path, module in self.modules.items()}}))
        (self.root / 'Makefile').write_text('release-build-inputs:\n\t@if [ "$(MOD)" = page ]; then echo build-inputs/src; fi\n')
        build_inputs = self.root / 'build-inputs/src'
        build_inputs.mkdir(parents=True)
        (build_inputs / 'dependencies.json').write_text('["fixture/tool"]')
        for path, module in self.modules.items():
            directory = self.root / path
            directory.mkdir(parents=True)
            (directory / 'module.json').write_text(json.dumps({'name': 'fixture/' + module['module'],
                                                               'build': 'build' in module['targets']}))
            if 'build' in module['targets']:
                (directory / '.gitignore').write_text('built\n')
                (directory / 'Makefile').write_text(
                    'build:\n\t@test "$$RELEASE_TEST_BUILD_ERROR" != 1\n'
                    '\t@test -z "$$RELEASE_TEST_BUILD_INPUT" || test "$(notdir $(CURDIR))" != page '
                    '|| test -f "$$RELEASE_TEST_STATE/$$RELEASE_TEST_BUILD_INPUT"\n\t@echo built > built\n')
        self.git('init', '-q')
        self.tag_release()

    def tag_release(self):
        self.git('add', '.')
        self.git('-c', 'user.name=Test', '-c', 'user.email=test@example.test', 'commit', '-qm', 'release fixture')
        for module in self.modules.values():
            self.git('tag', '-f', module['module'] + '-v1.2.3')

    def set_dependencies(self, path, dependencies):
        declaration = self.root / path / 'module.json'
        module = json.loads(declaration.read_text())
        module['dependencies'] = dependencies
        declaration.write_text(json.dumps(module))

    def git(self, *args):
        return subprocess.check_output(['git', *args], cwd=self.root, text=True)

    def run_publication(self, paths=None):
        publisher.publish(self.root, paths if paths is not None else ['platform/first', 'platform/page'], str(self.wippy))

    def events(self):
        path = self.state / 'events'
        return [json.loads(line) for line in path.read_text().splitlines()] if path.exists() else []

    def test_build_publish_verify_and_resume_without_overwriting(self):
        self.run_publication(['app', 'platform/page', 'platform/first'])
        first = self.events()
        self.assertEqual([event['name'] for event in first if event['step'] == 'publish'], ['fixture/first', 'fixture/page'])
        self.assertTrue((self.root / 'platform/page/built').is_file())
        self.run_publication()
        self.assertEqual(sum(event['step'] == 'publish' for event in self.events()), 2)

    def test_partial_publication_resumes_at_missing_artifact(self):
        self.run_publication(['platform/first'])
        self.run_publication()
        self.assertEqual([event['name'] for event in self.events() if event['step'] == 'publish'], ['fixture/first', 'fixture/page'])

    def test_runtime_and_build_dependencies_precede_their_consumers(self):
        self.set_dependencies('platform/first', ['fixture/runtime', 'external/library'])
        self.tag_release()
        with patch.dict(os.environ, {'RELEASE_TEST_BUILD_INPUT': 'fixture-tool-1.2.3'}):
            self.run_publication(list(reversed(self.modules)))
        self.assertEqual([event['name'] for event in self.events() if event['step'] == 'publish'],
                         ['fixture/runtime', 'fixture/first', 'fixture/tool', 'fixture/page'])

    def test_dependency_cycle_prevents_all_builds_and_publication(self):
        self.set_dependencies('platform/first', ['fixture/page'])
        self.set_dependencies('platform/tool', ['fixture/first'])
        self.tag_release()
        with self.assertRaisesRegex(ValueError, 'Companion publication dependency cycle'):
            self.run_publication(list(self.modules))
        self.assertEqual(self.events(), [])
        self.assertFalse((self.root / 'platform/page/built').exists())
        self.assertFalse((self.root / 'platform/tool/built').exists())

    def test_dependency_inspection_failure_prevents_all_builds_and_publication(self):
        with patch.dict(os.environ, {'RELEASE_TEST_REGISTRY_ERROR': '1'}):
            with self.assertRaises(subprocess.CalledProcessError):
                self.run_publication()
        self.assertEqual(self.events(), [])

    def test_single_module_does_not_need_cohort_inspection(self):
        with patch.dict(os.environ, {'RELEASE_TEST_REGISTRY_ERROR': '1'}):
            self.run_publication(['platform/first'])
        self.assertEqual([event['name'] for event in self.events() if event['step'] == 'publish'], ['fixture/first'])

    def test_different_existing_artifact_is_not_overwritten(self):
        occupied = self.state / 'fixture-first-1.2.3'
        occupied.write_bytes(b'previously published bytes')
        with self.assertRaisesRegex(ValueError, 'Published artifact differs'):
            self.run_publication()
        self.assertEqual(occupied.read_bytes(), b'previously published bytes')
        self.assertFalse(any(event['step'] == 'publish' for event in self.events()))

    def test_build_failure_prevents_that_publication(self):
        with patch.dict(os.environ, {'RELEASE_TEST_BUILD_ERROR': '1'}):
            with self.assertRaises(subprocess.CalledProcessError):
                self.run_publication(['platform/page'])
        self.assertEqual(self.events(), [])

    def test_changed_uploaded_bytes_fail_verification(self):
        with patch.dict(os.environ, {'RELEASE_TEST_CORRUPT_UPLOAD': '1'}):
            with self.assertRaisesRegex(ValueError, 'Published artifact differs'):
                self.run_publication(['platform/first'])

    def test_source_changes_prevent_entire_cohort(self):
        (self.root / 'platform/page/module.json').write_text('{}')
        with self.assertRaisesRegex(ValueError, 'clean checkout'):
            self.run_publication()
        self.assertEqual(self.events(), [])

    def test_untracked_source_prevents_entire_cohort(self):
        (self.root / 'platform/page/unreviewed.lua').write_text('return {}')
        with self.assertRaisesRegex(ValueError, 'clean checkout'):
            self.run_publication()
        self.assertEqual(self.events(), [])

    def test_registry_failure_does_not_become_missing_artifact(self):
        with patch.dict(os.environ, {'RELEASE_TEST_INSTALL_ERROR': 'true'}):
            with self.assertRaises(subprocess.CalledProcessError):
                self.run_publication()
        self.assertFalse(any(event['step'] == 'publish' for event in self.events()))

    def test_mismatched_release_tag_prevents_entire_cohort(self):
        self.git('-c', 'user.name=Test', '-c', 'user.email=test@example.test', 'commit', '--allow-empty', '-qm', 'new head')
        with self.assertRaisesRegex(ValueError, 'exact release tag'):
            self.run_publication()
        self.assertEqual(self.events(), [])

    def test_app_only_release_is_left_to_its_own_publisher(self):
        self.run_publication(['app'])
        self.assertEqual(self.events(), [])

    def test_invalid_release_paths_do_not_publish(self):
        for paths in ([], None, 'platform/first', [42]):
            with self.assertRaises(ValueError):
                publisher.publish(self.root, paths, str(self.wippy))
        with self.assertRaises(KeyError):
            self.run_publication(['../unknown'])
        self.assertEqual(self.events(), [])


if __name__ == '__main__':
    unittest.main()
