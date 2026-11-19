# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
"""Wippy subprocess fixture used by hosted and qualified release tests."""
FAKE_WIPPY = r'''#!/usr/bin/env python3
import json, os, pathlib, sys
args=sys.argv[1:]; state=pathlib.Path(os.environ['RELEASE_TEST_STATE'])
def option(name): return args[args.index(name)+1]
def record(value):
 with (state/'events').open('a') as f: f.write(json.dumps(value)+'\n')
if 'registry' in args:
 if os.environ.get('RELEASE_TEST_REGISTRY_ERROR'):
  sys.exit(1)
 cfg=json.loads(pathlib.Path(option('--config')).read_text())
 lock=json.loads(pathlib.Path(option('--lock-file')).read_text())
 replacements=cfg['workspace']['replacements']
 if replacements:
  root=pathlib.Path(next(iter(replacements.values())))
  deps=json.loads((root/'module.json').read_text()).get('dependencies',[])
 else:
  root=pathlib.Path(lock['directories']['src'])
  deps=json.loads((root/'dependencies.json').read_text())
 if 'list' in args: print(json.dumps([{'id':'fixture:dep.'+str(index)} for index in range(len(deps))]))
 else:
  index=int(option('show').split('.')[-1])
  print(json.dumps({'data':{'component':deps[index]}}))
 sys.exit(0)
if 'install' in args:
 if os.environ.get('RELEASE_TEST_INSTALL_ERROR'):
  print('registry authorization failed',file=sys.stderr); sys.exit(1)
 cfg=json.loads(pathlib.Path(option('--config')).read_text())
 lock=json.loads(pathlib.Path(cfg['registry']['dependency_lock_path']).read_text())
 for item in lock['modules']:
  name,version=item['name'],item['version']; stored=state/(name.replace('/','-')+'-'+version)
  if not stored.exists():
   print('failed to download module: '+name+'@'+version+': module not found',file=sys.stderr); sys.exit(1)
  organization,module=name.split('/')
  output=pathlib.Path(cfg['registry']['dependency_vendor_dir'])/organization/(module+'-'+version+'.wapp')
  output.parent.mkdir(parents=True,exist_ok=True); output.write_bytes(stored.read_bytes())
 record({'step':'install'}); sys.exit(0)
if 'pack' in args:
 if os.environ.get('RELEASE_TEST_VERIFY_ARCHIVE'): raise RuntimeError('must reuse the qualified archive')
 cfg=json.loads(pathlib.Path(option('--config')).read_text())
 name=option('--module'); directory=pathlib.Path(cfg['workspace']['replacements'][name])
 item=json.loads((directory/'module.json').read_text())
 if item['build'] and not (directory/'built').exists(): raise RuntimeError('frontend was not built')
 lock=json.loads(pathlib.Path(option('--lock-file')).read_text())
 payload=json.dumps({'name':name,'version':lock['modules'][0]['version'],'envelope':'module-pack'}).encode()
 pathlib.Path(args[-1]).write_bytes(payload)
 record({'step':'pack','name':item['name']}); sys.exit(0)
if '--wapp' not in args: raise RuntimeError('publication must use the prepared artifact')
payload=pathlib.Path(option('--wapp')).read_bytes()
item=json.loads(payload)
if item['version'] != option('--version'): raise RuntimeError('wrong version')
if os.environ.get('RELEASE_TEST_FAIL_UPLOAD') == item['name']:
 print('transient upload failure',file=sys.stderr); sys.exit(1)
stored=state/(item['name'].replace('/','-')+'-'+item['version'])
if stored.exists(): raise RuntimeError('immutable version already exists')
if os.environ.get('RELEASE_TEST_CORRUPT_UPLOAD'): payload += b'changed in transit'
stored.write_bytes(payload); record({'step':'publish','name':item['name']})
'''
