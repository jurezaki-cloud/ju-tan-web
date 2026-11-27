import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

// Registry advisory analysis only: no install/update/fix and no secret access.
const result = spawnSync('npm', ['audit', '--json'], { encoding: 'utf8', maxBuffer: 8_000_000 });
let audit;
try { audit = JSON.parse(result.stdout); } catch { throw new Error('npm audit produced no valid report'); }
if (audit.error || !audit.metadata?.vulnerabilities) throw new Error('npm audit registry failure');
console.log('AUDIT_METADATA', JSON.stringify(audit.metadata));
const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
for (const [name, info] of Object.entries(audit.vulnerabilities ?? {})) {
  const nodes = info.nodes.map(path => ({path, version: lock.packages[path]?.version, dev: lock.packages[path]?.dev === true}));
  const explain = spawnSync('npm', ['explain', name, '--json'], {encoding:'utf8', maxBuffer:2_000_000});
  console.log('AUDIT_PACKAGE', JSON.stringify({name, ...info, nodes, dependencyPaths: JSON.parse(explain.stdout || '[]')}));
}
const client = readFileSync('lib/contact-client.ts','utf8');
assert.ok(!/setItem\([^\n]*(?:payload|body|email|message)/.test(client), 'no form persistence');
const ledger = readFileSync('lib/contact-ledger.ts','utf8');
assert.ok(!/licensingPool|licensing\//.test(ledger), 'ledger must not import Office pool');
const pool = readFileSync('lib/contact-db.ts','utf8');
assert.ok(!/process.env\.(?:LICENSING_DATABASE_URL|DATABASE_URL|JU_TAN_LICENSE)/.test(pool));
assert.match(pool, /rejectUnauthorized: true/);
console.log('PASS: isolated contact dependencies and no form browser persistence');
