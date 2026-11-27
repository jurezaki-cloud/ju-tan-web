import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkContact, runContactCheck } from './contact-runner.mjs';
const env = { CONTACT_PREVIEW_ORIGIN: 'https://isolated-test.vercel.app', CONTACT_ALLOWED_PREVIEW_HOST: 'isolated-test.vercel.app', CONTACT_WORKER_SECRET: 'w'.repeat(40), CONTACT_MONITOR_SECRET: 'm'.repeat(40), CONTACT_PROTECTION_BYPASS: 'fixture', CONTACT_ALERT_WEBHOOK: 'https://alarm.example.test/hook', CONTACT_ALERT_ALLOWED_HOST: 'alarm.example.test' };
test('worker POST and independent monitor GET use separate secrets, protection and no redirects', async () => {
  for (const mode of ['worker', 'monitor']) {
    const result = await checkContact(mode, env, async (url, options) => {
      assert.equal(url.hostname, env.CONTACT_ALLOWED_PREVIEW_HOST);
      assert.equal(options.method, mode === 'worker' ? 'POST' : 'GET');
      assert.equal(options.redirect, 'error');
      assert.equal(options.headers.Authorization, `Bearer ${mode === 'worker' ? env.CONTACT_WORKER_SECRET : env.CONTACT_MONITOR_SECRET}`);
      assert.equal(options.headers['x-vercel-protection-bypass'], 'fixture');
      return Response.json({ healthy: true, latestHealthy: new Date().toISOString() });
    });
    assert.equal(result.healthy, true);
  }
});
test('503, stale heartbeat and network outage alarm without Resend and without response leakage', async () => {
  for (const state of ['503', 'stale', 'network']) {
    let alarms = 0;
    await assert.rejects(runContactCheck('monitor', env, async (url, options) => {
      if (url.hostname === env.CONTACT_ALERT_ALLOWED_HOST) {
        alarms++;
        assert.deepEqual(JSON.parse(options.body), { event: 'contact-check-failed', mode: 'monitor' });
        return new Response(null, { status: 204 });
      }
      if (state === 'network') throw new Error('secret response');
      return state === '503' ? new Response('private data', { status: 503 }) : Response.json({ healthy: true, latestHealthy: new Date(Date.now() - 601000).toISOString() });
    }), /contact-check-failed/);
    assert.equal(alarms, 1);
  }
});
test('reject unintended origins before making an authenticated request', async () => {
  for (const origin of ['https://ju-tan.com', 'http://isolated-test.vercel.app', 'https://isolated-test.vercel.app/path', 'https://user:pass@isolated-test.vercel.app', 'https://other.vercel.app']) {
    await assert.rejects(checkContact('worker', { ...env, CONTACT_PREVIEW_ORIGIN: origin }, async () => { assert.fail('must not fetch'); }));
  }
});
