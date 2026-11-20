import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
if (!pkg.workspaces?.includes('./.wippy/npm/@*/*') || pkg.dependencies?.['@kickside/ui-kit'] !== '*') {
  throw new Error('package.json must declare the materialized @kickside/ui-kit workspace and dependency')
}

if (process.argv.includes('--locked')) {
  const workspace = '.wippy/npm/@kickside/ui-kit'
  const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'))
  const installed = JSON.parse(readFileSync(`${workspace}/package.json`, 'utf8'))
  const expected = lock.packages?.[workspace]?.version
  if (!expected || installed.version !== expected) {
    throw new Error(`Materialized @kickside/ui-kit ${installed.version} must match package-lock.json (${expected ?? 'missing'}). Refresh both build input locks together.`)
  }
}
