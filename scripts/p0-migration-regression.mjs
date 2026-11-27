import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import pg from 'pg';
const raw = process.env.CONTACT_DATABASE_URL;
const url = new URL(raw ?? 'http://invalid');
assert.equal(url.hostname, 'localhost');
assert.equal(url.pathname, '/ju_tan_contact_test');
const pool = new pg.Pool({connectionString:raw, max:1});
const db = await pool.connect();
try {
  const before = await db.query("SELECT to_regclass('contact_delivery_attempts') obj");
  assert.equal(before.rows[0].obj, null, 'fresh isolated test DB required');
  await db.query('BEGIN');
  await db.query("SET LOCAL lock_timeout='2s'");
  await db.query("SET LOCAL statement_timeout='10s'");
  await db.query(`CREATE TABLE contact_delivery_attempts (
    retry_key TEXT PRIMARY KEY, created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    counted BOOLEAN NOT NULL DEFAULT false)`);
  await db.query("INSERT INTO contact_delivery_attempts (retry_key) VALUES ('isolated-tombstone')");
  const sql = readFileSync('scripts/sql/contact-idempotency.sql','utf8');
  await db.query(sql);
  await db.query(sql); // repeat-safe additive upgrade, not just new schema
  const rows = await db.query("SELECT retry_key, counted, cancelled, receipt_id FROM contact_delivery_attempts");
  assert.deepEqual(rows.rows, [{retry_key:'isolated-tombstone', counted:false, cancelled:false, receipt_id:null}]);
  const office = await db.query("SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename LIKE 'office_%'");
  assert.equal(office.rows.length, 0);
  await db.query('ROLLBACK');
  const after = await db.query("SELECT to_regclass('contact_delivery_attempts') a, to_regclass('site_inquiry_daily') b");
  assert.deepEqual(after.rows[0], {a:null,b:null});
  console.log('PASS: old schema upgrade twice preserves tombstone; transaction rollback leaves no new objects');
} finally {
  await db.query('ROLLBACK').catch(()=>{});
  db.release();
  await pool.end();
}
