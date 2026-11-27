import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
const files = [];
function walk(dir) {
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, item.name).replaceAll('\\', '/');
    if (item.isDirectory()) walk(path);
    else if (/\.test\.[cm]?[jt]sx?$/.test(item.name)) files.push(path);
  }
}
for (const dir of ['app', 'components', 'lib', 'src', 'tests', 'hooks']) walk(dir);
console.log('Discovered unit tests:', JSON.stringify(files));
const covered = new Set([
  'lib/free-lab/catalog.test.ts', 'lib/free-lab/doctor.test.ts', 'lib/free-lab/image.test.ts',
  'lib/free-lab/pdf.test.ts', 'lib/free-lab/qr/qr.test.ts', 'lib/free-lab/quiz.test.ts',
  'lib/office-download/office-download.hardening.test.ts',
  'src/notifications/delivery.hardening.test.ts', 'src/security/rate-limit/cleanup.hardening.test.ts',
  'src/identity/login.hardening.test.ts', 'src/security/network/proxy.hardening.test.ts',
  'tests/contact-p0.test.ts', 'tests/contact.test.ts', 'tests/google-ads-consent-p0.test.ts',
  'tests/google-ads-p0.test.ts', 'tests/google-ads-retry-p0.test.ts', 'tests/google-ads.test.ts', 'tests/magic.test.ts',
  // Explicit runner: pr93-full-ci.yml, checks (inbox).
  'tests/contact-inbox.test.ts', 'tests/contact-operations.test.ts',
]);
const unknown = files.filter((file) => !covered.has(file));
if (unknown.length) throw new Error(`Unmapped tests require an explicit runner: ${unknown.join(', ')}`);
const result = spawnSync(process.execPath,
  ['--conditions=react-server', '--import', 'tsx', 'scripts/p0-existing-hardening.ts'],
  { stdio: 'inherit', env: { ...process.env, RESEND_API_KEY: '', EMAIL_FROM: '', FROM_EMAIL: '', LICENSING_DATABASE_URL: '', JU_TAN_EMAIL_DELIVERY: '0', JU_TAN_OPENAI: '0' } });
if (result.status !== 0) process.exitCode = 1;
