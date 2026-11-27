import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
const files = [];
function walk(dir) {
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, item.name);
    if (item.isDirectory()) walk(path);
    else if (/\.test\.[cm]?[jt]sx?$/.test(item.name)) files.push(path);
  }
}
for (const dir of ['app', 'components', 'lib', 'src', 'tests', 'hooks']) walk(dir);
console.log('Discovered unit tests:', JSON.stringify(files));
const covered = (file) => /\.hardening\.test\.ts$/.test(file) ||
  file.startsWith('lib/free-lab/') || file.startsWith('tests/');
let failed = false;
for (const file of files.filter((file) => !covered(file))) {
  console.log('Running additional existing unit test:', file);
  const result = spawnSync(process.execPath, ['--conditions=react-server', '--import', 'tsx', file], { stdio: 'inherit', env: { ...process.env, RESEND_API_KEY: '', EMAIL_FROM: '', FROM_EMAIL: '', LICENSING_DATABASE_URL: '' } });
  if (result.status !== 0) failed = true;
}
if (failed) process.exitCode = 1;
