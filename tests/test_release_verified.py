#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
"""Exercise qualified archive publication with real subprocesses and a fixture registry."""
from hashlib import sha256
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
MANIFEST_TRAILER = 'Hub-Artifact-Manifest-SHA256'

class VerifiedPublication(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name) / 'repo'
        self.root.mkdir()
        self.evidence = self.root.parent / 'evidence'
        self.evidence.mkdir()
        self.manifest = self.evidence / 'artifacts.json'
        self.state = self.root / 'registry'
        self.state.mkdir()
        self.wippy = self.root / 'fixture-wippy'
        self.wippy.write_text(FAKE_WIPPY)
        self.wippy.chmod(0o755)
        self.env = patch.dict(os.environ, {'RELEASE_TEST_STATE': str(self.state), 'RELEASE_TEST_VERIFY_ARCHIVE': '1'})
        self.env.start()
        self.addCleanup(self.env.stop)
        (self.root / '.gitignore').write_text('registry/\nfixture-wippy\n')
        self.modules = {
            'app': {'path': 'app', 'organization': 'fixture', 'module': 'app',
                    'type': 'application', 'visibility': 'public', 'embed': [], 'targets': ['build']},
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
        (self.root / '.release-please-manifest.json').write_text(json.dumps({path: '1.2.2' for path in self.modules}))
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
        self.git('init', '-q')
        self.commit('base fixture')
        self.base = self.git('rev-parse', 'HEAD').strip()
        self.tag_release(['platform/page', 'platform/first'])

    def commit(self, message, *options):
        self.git('add', '.')
        self.git('-c', 'user.name=Test', '-c', 'user.email=test@example.test', 'commit', '-qm', message, *options)

    def tag_release(self, paths, *, qualified=True):
        self.git('reset', '--soft', self.base)
        versions = {path: '1.2.3' if path in paths else '1.2.2' for path in self.modules}
        (self.root / '.release-please-manifest.json').write_text(json.dumps(versions))
        self.commit('release fixture')
        release = {'repository': 'kickside', 'base': self.base, 'head': self.git('rev-parse', 'HEAD').strip(),
                   'source_tree': self.git('rev-parse', 'HEAD^{tree}').strip(), 'changed_public_paths': sorted(paths)}
        (self.evidence / 'release.json').write_text(json.dumps(release))
        proofs = {}
        for path in paths:
            name = 'fixture/' + self.modules[path]['module']
            filename = name.replace('/', '_') + '-1.2.3.wapp'
            archive = json.dumps({'name': name, 'version': '1.2.3', 'envelope': 'tested-package'}).encode()
            (self.evidence / filename).write_bytes(archive)
            proofs[name] = {'path': path, 'version': '1.2.3', 'artifact': filename,
                            'sha256': sha256(archive).hexdigest()}
        self.manifest.write_text(json.dumps(proofs))
        for engine in ('sqlite', 'postgres'):
            root = self.evidence / engine
            root.mkdir(exist_ok=True)
            (root / 'artifacts.json').write_text(json.dumps({name: dict(row, state='exercised')
                                                           for name, row in proofs.items()}))
        if qualified:
            manifest_digest = sha256(self.manifest.read_bytes()).hexdigest()
            self.commit(f'release fixture\n\n{MANIFEST_TRAILER}: {manifest_digest}', '--amend')
        for path in paths:
            self.git('tag', '-f', self.modules[path]['module'] + '-v1.2.3')

    def set_dependencies(self, path, dependencies):
        declaration = self.root / path / 'module.json'
        module = json.loads(declaration.read_text())
        module['dependencies'] = dependencies
        declaration.write_text(json.dumps(module))

    def git(self, *args):
        return subprocess.check_output(['git', *args], cwd=self.root, text=True)

    def run_publication(self, *, verify_only=False):
        publisher.publish_verified(self.root, self.evidence, str(self.wippy), verify_only=verify_only)

    def events(self):
        path = self.state / 'events'
        return [json.loads(line) for line in path.read_text().splitlines()] if path.exists() else []

    def test_publishes_exact_companions_then_app_and_resumes_without_overwriting(self):
        self.tag_release(['app', 'platform/page', 'platform/first'])
        self.run_publication()
        first = self.events()
        self.assertEqual([event['name'] for event in first if event['step'] == 'publish'],
                         ['fixture/first', 'fixture/page', 'fixture/app'])
        for module in ('first', 'page', 'app'):
            with self.subTest(module=module):
                self.assertEqual((self.state / f'fixture-{module}-1.2.3').read_bytes(),
                                 (self.evidence / f'fixture_{module}-1.2.3.wapp').read_bytes())
        self.run_publication()
        self.assertEqual(sum(event['step'] == 'publish' for event in self.events()), 3)

    def test_partial_publication_resumes_at_missing_artifact(self):
        first = self.state / 'fixture-first-1.2.3'
        with patch.dict(os.environ, {'RELEASE_TEST_FAIL_UPLOAD': 'fixture/page'}):
            with self.assertRaises(subprocess.CalledProcessError):
                self.run_publication()
        self.assertEqual(first.read_bytes(), (self.evidence / 'fixture_first-1.2.3.wapp').read_bytes())
        self.assertFalse((self.state / 'fixture-page-1.2.3').exists())
        self.run_publication()
        self.assertEqual([event['name'] for event in self.events() if event['step'] == 'publish'],
                         ['fixture/first', 'fixture/page'])

    def test_runtime_and_build_dependencies_precede_their_consumers(self):
        self.set_dependencies('platform/first', ['fixture/runtime', 'external/library'])
        self.tag_release(list(reversed(self.modules)))
        self.run_publication()
        self.assertEqual([event['name'] for event in self.events() if event['step'] == 'publish'],
                         ['fixture/runtime', 'fixture/first', 'fixture/tool', 'fixture/page', 'fixture/app'])

    def test_dependency_cycle_prevents_all_publication(self):
        self.set_dependencies('platform/first', ['fixture/page'])
        self.set_dependencies('platform/tool', ['fixture/first'])
        self.tag_release(list(self.modules))
        with self.assertRaisesRegex(ValueError, 'Companion publication dependency cycle'):
            self.run_publication()
        self.assertEqual(self.events(), [])

    def test_dependency_inspection_failure_prevents_all_publication(self):
        with patch.dict(os.environ, {'RELEASE_TEST_REGISTRY_ERROR': '1'}):
            with self.assertRaises(subprocess.CalledProcessError):
                self.run_publication()
        self.assertEqual(self.events(), [])

    def test_single_module_does_not_need_cohort_inspection(self):
        self.tag_release(['platform/first'])
        with patch.dict(os.environ, {'RELEASE_TEST_REGISTRY_ERROR': '1'}):
            self.run_publication()
        self.assertEqual([event['name'] for event in self.events() if event['step'] == 'publish'], ['fixture/first'])

    def test_later_existing_conflict_prevents_all_uploads(self):
        occupied = self.state / 'fixture-page-1.2.3'
        occupied.write_bytes(b'previously published bytes')
        with self.assertRaisesRegex(ValueError, 'Published artifact differs'):
            self.run_publication()
        self.assertEqual(occupied.read_bytes(), b'previously published bytes')
        self.assertFalse(any(event['step'] == 'publish' for event in self.events()))

    def test_changed_later_archive_prevents_entire_cohort(self):
        (self.evidence / 'fixture_page-1.2.3.wapp').write_bytes(b'changed after smoke')
        with self.assertRaisesRegex(ValueError, 'Archive bytes differ'):
            self.run_publication()
        self.assertEqual(self.events(), [])

    def test_changed_uploaded_bytes_fail_verification(self):
        with patch.dict(os.environ, {'RELEASE_TEST_CORRUPT_UPLOAD': '1'}):
            with self.assertRaisesRegex(ValueError, 'Published artifact differs'):
                self.run_publication()

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
        self.git('tag', '-f', 'page-v1.2.3', self.base)
        with self.assertRaisesRegex(ValueError, 'exact release tag'):
            self.run_publication()
        self.assertEqual(self.events(), [])

    def test_app_only_release_still_requires_both_runtime_proofs(self):
        self.tag_release(['app'])
        path = self.evidence / 'postgres/artifacts.json'
        rows = json.loads(path.read_text())
        rows['fixture/app']['state'] = 'packed-only'
        path.write_text(json.dumps(rows))
        with self.assertRaisesRegex(ValueError, 'Smoke evidence differs'):
            self.run_publication()
        self.assertEqual(self.events(), [])

    def test_raced_release_tree_and_parent_refuse_publication(self):
        path = self.evidence / 'release.json'
        receipt = json.loads(path.read_text())
        for field in ('base', 'source_tree'):
            with self.subTest(field=field):
                path.write_text(json.dumps(dict(receipt, **{field: 'a' * 40})))
                with self.assertRaisesRegex(ValueError, 'Tagged release .* differs'):
                    self.run_publication()
        self.assertEqual(self.events(), [])

    def test_tagged_tree_and_selected_cohort_match_smoke(self):
        path = self.evidence / 'release.json'
        receipt = json.loads(path.read_text())
        path.write_text(json.dumps(dict(receipt, changed_public_paths=['platform/first'])))
        with self.assertRaisesRegex(ValueError, 'manifest changes differ'):
            self.run_publication()
        self.assertEqual(self.events(), [])

    def test_verify_only_checks_archives_without_hub_operations(self):
        self.run_publication(verify_only=True)
        self.assertEqual(self.events(), [])

    def test_unmarked_tag_allows_verification_only(self):
        self.tag_release(['platform/first'], qualified=False)
        self.run_publication(verify_only=True)
        with self.assertRaisesRegex(ValueError, MANIFEST_TRAILER):
            self.run_publication()
        self.assertEqual(self.events(), [])

    def test_tagged_digest_pins_the_exact_manifest_bytes(self):
        self.manifest.write_text(self.manifest.read_text() + '\n')
        for verify_only in (False, True):
            with self.subTest(verify_only=verify_only):
                with self.assertRaisesRegex(ValueError, MANIFEST_TRAILER):
                    self.run_publication(verify_only=verify_only)
        self.assertEqual(self.events(), [])


if __name__ == '__main__':
    unittest.main()
