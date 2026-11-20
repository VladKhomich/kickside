"""Native harnesses resolve public inputs and own their CI databases."""
from pathlib import Path
import hashlib
import json
import os
import re
import shutil
import textwrap
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from release_artifacts import prepared_artifact


class PublicHarnessTests(unittest.TestCase):
    def test_ci_and_release_use_the_supported_runtime_for_every_gate(self):
        for name in ('ci.yml', 'release.yml'):
            workflow = (ROOT / '.github/workflows' / name).read_text()
            setups = re.findall(r'uses: kicksideai/\.github/actions/setup-wippy@[^\n]+\n(.*?)(?=\n    -|\Z)',
                                workflow, re.DOTALL)
            self.assertTrue(setups, name + ' must install the supported runtime')
            for setup in setups:
                with self.subTest(workflow=name, setup=setup):
                    self.assertRegex(setup, r'(?m)^        version: 0\.3\.66a$')

    def test_ci_materializes_ui_kit_from_the_checkout(self):
        workflow = (ROOT / '.github/workflows/ci.yml').read_text()
        step = re.search(r'    - name: Prepare UI Kit build input\n      run: \|\n(.*?)(?=    - name:)',
                         workflow, re.DOTALL)
        self.assertIsNotNone(step, 'frontend gates must use the UI Kit source under test')
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'scripts').mkdir()
            shutil.copy(ROOT / 'scripts/release_artifacts.py', root / 'scripts')
            shutil.copytree(ROOT / 'platform/ui-kit', root / 'platform/ui-kit',
                            ignore=shutil.ignore_patterns('node_modules', '.wippy'))
            (root / '.github').mkdir()
            for path in ('.github/modules.json', '.release-please-manifest.json'):
                shutil.copy(ROOT / path, root / path)
            environment = root / 'github-env'
            environment.touch()
            subprocess.run(['bash', '-euo', 'pipefail', '-c', textwrap.dedent(step[1])],
                           cwd=root, env={**os.environ, 'GITHUB_ENV': str(environment)},
                           capture_output=True, text=True, check=True, timeout=30)
            artifact = Path(environment.read_text().strip().removeprefix('UI_KIT_WAPP='))
            self.assertTrue(artifact.is_file())
            consumer = root / 'consumer'
            subprocess.run(['wippy', 'artifacts', 'materialize', str(artifact),
                            'kickside.ui_kit:package_fs', '--root', str(consumer)],
                           cwd=root, capture_output=True, text=True, check=True, timeout=30)
            for name in ('useComponentDeletion.ts', 'ComponentDeletion.vue'):
                self.assertEqual((consumer / 'npm/@kickside/ui-kit' / name).read_bytes(),
                                 (ROOT / 'platform/ui-kit/package' / name).read_bytes())

    def test_embedded_files_follow_module_exclusions_after_a_build(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / 'ui-kit'
            shutil.copytree(ROOT / 'platform/ui-kit', source,
                            ignore=shutil.ignore_patterns('node_modules', '.wippy'))
            package = source / 'src/assets'
            (source / 'package').rename(package)
            declaration = source / 'src/_index.yaml'
            declaration.write_text(declaration.read_text().replace('directory: ./package', 'directory: ./src/assets'))
            module = {'path': 'ui-kit', 'name': 'kickside/ui-kit',
                      'version': json.loads((package / 'package.json').read_text())['version'],
                      'embed': ['kickside.ui_kit:package_fs']}
            manifest = source / 'wippy.yaml'
            manifest.write_text(manifest.read_text().replace('exclude:\n', 'exclude:\n'
                                '  - "**/*.js.map"\n  - "src/assets/*.css.map"\n'))
            assets = {'asset.js': 'javascript', 'chunks/deep/theme.css': 'styles',
                      'chunks/theme.css.map': 'required map', 'map.json': '{}'}
            for name, content in assets.items():
                path = package / name
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(content)
            with prepared_artifact(root, module, 'wippy') as archive:
                clean = archive.read_bytes()

            maps = ['asset.js.map', 'chunks/deep/asset.js.map', 'theme.css.map']
            for name in maps:
                (package / name).write_text('generated')
            with prepared_artifact(root, module, 'wippy') as archive:
                consumer = root / 'consumer'
                subprocess.run(['wippy', 'artifacts', 'materialize', str(archive), module['embed'][0],
                                '--root', str(consumer)], cwd=root, check=True, capture_output=True)
                installed = consumer / 'npm/@kickside/ui-kit'
                for name in maps:
                    self.assertFalse((installed / name).exists(), name)
                    self.assertEqual((package / name).read_text(), 'generated')
                for name, content in assets.items():
                    self.assertEqual((installed / name).read_text(), content)
                self.assertEqual(archive.read_bytes(), clean)

    def test_root_make_test_runs_each_package_test_script(self):
        for module, directory in (('workflows', 'platform/workflows/ui'), ('app-main', 'app/frontend/applications/main')):
            with self.subTest(module=module):
                result = subprocess.run(['make', '--no-print-directory', '-n', 'test', 'MOD=' + module],
                                        cwd=ROOT, text=True, capture_output=True)
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertIn('cd ' + directory + ' &&', result.stdout)
                self.assertIn('npm test', result.stdout)

    def test_ui_kit_materializes_the_locked_archive(self):
        with tempfile.TemporaryDirectory(prefix='ui kit ') as directory:
            root = Path(directory)
            shutil.copy(ROOT / 'Makefile', root)
            (root / 'scripts').mkdir()
            shutil.copy(ROOT / 'scripts/wire-ui-kit.mjs', root / 'scripts')
            consumer = root / 'app/frontend/applications/main'
            consumer.mkdir(parents=True)
            (consumer / 'package.json').write_text(json.dumps({
                'workspaces': ['./.wippy/npm/@*/*'], 'dependencies': {'@kickside/ui-kit': '*'},
            }))
            vendor = root / 'build-inputs/.wippy/vendor/kickside'
            vendor.mkdir(parents=True)
            locked = vendor / 'ui-kit-1.7.10.wapp'
            stale = vendor / 'ui-kit-1.7.9.wapp'
            source = root / 'platform/ui-kit'
            shutil.copytree(ROOT / 'platform/ui-kit', source,
                            ignore=shutil.ignore_patterns('node_modules', '.wippy'))
            wippy = shutil.which('wippy')
            self.assertIsNotNone(wippy)
            module = {'name': 'kickside/ui-kit', 'path': 'platform/ui-kit', 'embed': ['kickside.ui_kit:package_fs']}
            package_path = source / 'package/package.json'
            package = json.loads(package_path.read_text())
            for version, archive in [('1.7.9', stale), ('1.7.10', locked)]:
                package_path.write_text(json.dumps({**package, 'version': version}))
                with prepared_artifact(root, dict(module, version=version), wippy) as artifact:
                    shutil.copyfile(artifact, archive)
            lock = root / 'build-inputs/wippy.lock'
            lock.write_text('modules:\n  - version: "1.7.10"\n'
                            f'    hash: {hashlib.sha256(locked.read_bytes()).hexdigest()}\n'
                            '    name: "kickside/ui-kit"\n'
                            'directories: {src: src, modules: .wippy}\n')
            (root / 'build-inputs/src').mkdir()
            wrapper = root / 'wippy-fixture'
            wrapper.write_text('#!/bin/sh\ncase "$1" in\n'
                               'update) echo resolved >> "$UI_KIT_TEST_TRACE"; exit 0 ;;\n'
                               'install) test -z "$UI_KIT_TEST_FAIL_INSTALL" || exit 1 ;;\n'
                               'esac\nexec "$UI_KIT_TEST_WIPPY" "$@"\n')
            wrapper.chmod(0o755)
            npm = root / 'npm'
            npm.write_text('#!/bin/sh\nprintf "%s\\n" "$1" >> "$UI_KIT_TEST_NPM_TRACE"\n')
            npm.chmod(0o755)
            trace = root / 'materialized'
            npm_trace = root / 'npm-commands'
            env = {**os.environ, 'PATH': str(root) + os.pathsep + os.environ['PATH'],
                   'UI_KIT_TEST_TRACE': str(trace), 'UI_KIT_TEST_WIPPY': wippy,
                   'UI_KIT_TEST_NPM_TRACE': str(npm_trace)}

            def materialize(override='', *, fail_install=False):
                return subprocess.run(['make', 'ui-kit', 'MOD=app-main', f'WIPPY_BIN={wrapper}',
                                       f'UI_KIT_WAPP={override}'], cwd=root,
                                      env={**env, 'UI_KIT_TEST_FAIL_INSTALL': '1' if fail_install else ''},
                                      text=True, capture_output=True, timeout=30)

            installed = consumer / '.wippy/npm/@kickside/ui-kit/package.json'
            result = materialize()
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(json.loads(installed.read_text())['version'], '1.7.10')
            self.assertTrue(stale.is_file())
            result = materialize(fail_install=True)
            self.assertNotEqual(result.returncode, 0)
            self.assertEqual(json.loads(installed.read_text())['version'], '1.7.10')
            result = materialize(stale)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(json.loads(installed.read_text())['version'], '1.7.9')
            self.assertEqual(trace.read_text().splitlines(), ['resolved', 'resolved'])

            package_lock = consumer / 'package-lock.json'
            workspace = '.wippy/npm/@kickside/ui-kit'
            package_lock.write_text(json.dumps({'packages': {workspace: {'version': '1.7.10'}}}))
            snapshots = {file: file.read_bytes() for file in (lock, package_lock)}
            release = ['make', 'release-build-app-main', f'WIPPY_BIN={wrapper}', f'UI_KIT_WAPP={stale}']
            result = subprocess.run(release, cwd=root, env=env, text=True, capture_output=True, timeout=30)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(json.loads(installed.read_text())['version'], '1.7.10')
            self.assertEqual(trace.read_text().splitlines(), ['resolved', 'resolved'])
            self.assertEqual(npm_trace.read_text().splitlines(), ['install', 'install', 'ci', 'run'])
            self.assertEqual({file: file.read_bytes() for file in snapshots}, snapshots)

            package_lock.write_text(json.dumps({'packages': {workspace: {'version': '1.7.9'}}}))
            result = subprocess.run(release, cwd=root, env=env, text=True, capture_output=True, timeout=30)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('must match package-lock.json', result.stderr)
            self.assertEqual(npm_trace.read_text().splitlines(), ['install', 'install', 'ci', 'run'])

            lock.unlink()
            result = subprocess.run(release, cwd=root, env=env, text=True, capture_output=True, timeout=30)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('Application release requires build-inputs/wippy.lock', result.stderr)
            self.assertFalse(lock.exists())

    def test_release_extra_files_resolve_within_their_module(self):
        config = json.loads((ROOT / 'release-please-config.json').read_text())
        checked = []
        for module, package in config['packages'].items():
            for extra in package.get('extra-files', []):
                path = extra if isinstance(extra, str) else extra['path']
                if isinstance(extra, dict) and extra.get('glob'):
                    continue
                # Release Please resolves extra-file paths against the package.
                target = ROOT / path.lstrip('/') if path.startswith('/') else ROOT / module / path
                with self.subTest(module=module, path=path):
                    self.assertTrue(target.is_file(), f'release updater cannot find {target}')
                checked.append(target)
        self.assertIn(ROOT / 'platform/ui-kit/package/package.json', checked)

    def test_stateful_postgres_jobs_allocate_and_select_owned_databases(self):
        jobs = json.loads((ROOT / '.github/module-matrix.json').read_text())['include']
        checked = []
        for row in jobs:
            module = row['module']
            if row['engine'] != 'postgres':
                continue
            job = row['commands']
            harness = ROOT / module / 'test/.wippy.yaml'
            if not harness.is_file() or not re.search(r'(?m)^  pg_database:', harness.read_text()):
                continue
            with self.subTest(module=module):
                self.assertIn('createdb "$database"', job)
                self.assertIn('trap cleanup_databases EXIT', job)
                for command in job.splitlines():
                    if 'wippy lint' in command or 'wippy test' in command:
                        # A worker suite may need its own clean queue. Every
                        # command must still use a tracked disposable database,
                        # including those after the primary harness database.
                        selected = re.search(r'--set "vars\.pg_database=\$\{databases\[(\d+)\]\}"', command)
                        tracked = re.findall(r'databases\+=\("\$([a-zA-Z_]\w*)"\)', job)
                        if selected:
                            self.assertLess(int(selected[1]), len(tracked), command)
                        else:
                            named = re.search(r'--set "vars\.pg_database=\$([a-zA-Z_]\w*)"', command)
                            self.assertIsNotNone(named, command)
                            self.assertIn(named[1], tracked, command)
            checked.append(module)
        self.assertTrue(checked, 'CI must exercise stateful PostgreSQL harnesses')

    def test_automation_upgrade_and_live_harnesses_use_separate_databases(self):
        jobs = json.loads((ROOT / '.github/module-matrix.json').read_text())['include']
        commands = next(row['commands'] for row in jobs
                        if row['module'] == 'platform/automation' and row['engine'] == 'postgres')
        # Execute CI's routing and cleanup, without building modules or opening
        # PostgreSQL. Record the database selected by each real shell command.
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            for harness in ('test', 'live-test'):
                (root / 'platform/automation' / harness).mkdir(parents=True)
            tools = root / 'tools'
            tools.mkdir()
            helper = tools / 'record'
            helper.write_text('''#!/usr/bin/env python3
import json, os, sys
from pathlib import Path
name = Path(sys.argv[0]).name
with open(os.environ['HARNESS_CALLS'], 'a') as output:
    output.write(json.dumps({'name': name, 'args': sys.argv[1:], 'cwd': os.getcwd()}) + '\\n')
if name == 'wippy': print('PASSED\\n1 tests')
if name == 'jq': print('0.0.0')
''')
            helper.chmod(0o755)
            for name in ('createdb', 'dropdb', 'wippy', 'make', 'jq'):
                (tools / name).symlink_to(helper)
            calls = root / 'calls.jsonl'
            subprocess.run(['bash', '-euo', 'pipefail', '-c', commands], cwd=root,
                           env={**os.environ, 'PATH': str(tools) + os.pathsep + os.environ['PATH'],
                                'HARNESS_CALLS': str(calls), 'GITHUB_RUN_ID': 'review', 'GITHUB_RUN_ATTEMPT': '1'},
                           check=True, capture_output=True, text=True, timeout=20)
            recorded = [json.loads(line) for line in calls.read_text().splitlines()]
        tests = [call for call in recorded if call['name'] == 'wippy' and call['args'][0] == 'test']
        self.assertEqual(len(tests), 2)
        def selected(call, key):
            return next(arg.split('=', 1)[1] for arg in call['args'] if arg.startswith(key + '='))
        main = selected(tests[0], 'vars.pg_database')
        upgrade = selected(tests[0], 'vars.pg_prepared_upgrade_database')
        history = selected(tests[0], 'vars.pg_history_upgrade_database')
        live = selected(tests[1], 'vars.pg_database')
        self.assertEqual(len({main, upgrade, history, live}), 4, 'the live harness must not boot on manually migrated upgrade tables')
        created = [call['args'][0] for call in recorded if call['name'] == 'createdb']
        dropped = [call['args'][0] for call in recorded if call['name'] == 'dropdb']
        self.assertCountEqual(created, [main, upgrade, history, live])
        self.assertCountEqual(dropped, created)

    def test_automation_shell_harness_removes_all_owned_sqlite_files(self):
        for status in (0, 1):
            with self.subTest(status=status), tempfile.TemporaryDirectory() as temp:
                root = Path(temp)
                scratch = root / 'scratch'
                scratch.mkdir()
                binary = root / 'wippy'
                binary.write_text('''#!/usr/bin/env python3
import os, sys
from pathlib import Path
path = next(arg.split('=', 1)[1] for arg in sys.argv if arg.startswith('vars.sqlite_path='))
for suffix in ('', '-wal', '-shm', '.history-upgrade', '.history-upgrade-wal', '.history-upgrade-shm'):
    Path(path + suffix).write_text('fixture')
print('PASSED\\n1 tests' if os.environ['TEST_STATUS'] == '0' else 'FAILED')
sys.exit(int(os.environ['TEST_STATUS']))
''')
                binary.chmod(0o755)
                result = subprocess.run(['bash', str(ROOT / 'platform/automation/test/run-tests.sh')],
                                        cwd=root, capture_output=True, text=True, timeout=20,
                                        env={**os.environ, 'PATH': str(root) + os.pathsep + os.environ['PATH'],
                                             'TMPDIR': str(scratch), 'WIPPY_TEST_ARGS': '', 'TEST_STATUS': str(status)})
                self.assertEqual(result.returncode, status, result.stdout + result.stderr)
                self.assertEqual(list(scratch.iterdir()), [], 'the harness retains an owned database or WAL')

    def test_workspace_replacements_resolve_from_public_sources(self):
        paths = subprocess.check_output(['git', 'ls-files', '**/.wippy.yaml', '**/wippy.yaml'],
                                        cwd=ROOT, text=True).splitlines()
        checked = []
        for path in paths:
            config = ROOT / path
            workspace = re.search(r'(?m)^workspace:\n  replacements:\n((?:[ \t]+[^\n]*\n|\n)*)',
                                  config.read_text())
            if workspace is None:
                continue
            for target in re.findall(r'(?m)^    [^#\s][^:]*: (.+)$', workspace[1]):
                directory = config.parent / target.strip().strip("\"'")
                with self.subTest(config=path, replacement=target):
                    self.assertTrue(directory.is_dir(), 'Replacement must resolve from public sources')
                checked.append(directory)
        self.assertTrue(checked, 'Harness configurations must exercise local source replacements')
