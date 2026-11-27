import { pathToFileURL } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

// No scheduler is installed or enabled by this file. Run worker and monitor from
// independent existing schedulers; monitor must run even if worker is stopped.
export async function checkContact(mode, env = process.env, request = fetch) {
  if (!['worker', 'monitor'].includes(mode)) throw new Error('invalid-mode');
  const production = env.CONTACT_RUNNER_ENV === 'production';
  if (env.CONTACT_RUNNER_ENV && !['preview', 'production'].includes(env.CONTACT_RUNNER_ENV)) throw new Error('invalid-environment');
  const target = new URL(production ? env.CONTACT_PRODUCTION_ORIGIN : env.CONTACT_PREVIEW_ORIGIN);
  const allowedHost = production ? 'ju-tan.com' : env.CONTACT_ALLOWED_PREVIEW_HOST;
  if (target.protocol !== 'https:' || target.hostname !== allowedHost ||
      (!production && !target.hostname.endsWith('.vercel.app')) || target.port || target.username || target.password ||
      target.pathname !== '/' || target.search || target.hash) throw new Error('invalid-preview-target');
  const secret = mode === 'worker' ? env.CONTACT_WORKER_SECRET : env.CONTACT_MONITOR_SECRET;
  if (!secret || secret.length < 32 || (!production && !env.CONTACT_PROTECTION_BYPASS)) throw new Error('missing-runner-secret');
  if (production && (!env.CONTACT_ALERT_WEBHOOK || !env.CONTACT_ALERT_ALLOWED_HOST ||
      (mode === 'monitor' && (!env.CONTACT_MONITOR_HEARTBEAT_URL || !env.CONTACT_MONITOR_HEARTBEAT_HOST)))) throw new Error('missing-independent-monitoring');
  const response = await request(new URL(`/api/contact/${mode === 'worker' ? 'drain' : 'health'}`, target), {
    method: mode === 'worker' ? 'POST' : 'GET', redirect: 'error', signal: AbortSignal.timeout(55000),
    headers: { Authorization: `Bearer ${secret}`, ...(!production ? { 'x-vercel-protection-bypass': env.CONTACT_PROTECTION_BYPASS } : {}) },
  });
  if (!response.ok) throw new Error('contact-unhealthy');
  const state = await response.json();
  const age = Date.now() - Date.parse(state.latestHealthy);
  if (state.healthy !== true || (mode === 'monitor' && (!Number.isFinite(age) || age < -60000 || age >= 600000))) throw new Error('contact-unhealthy');
  return { healthy: true };
}

export async function runContactCheck(mode, env = process.env, request = fetch) {
  try {
    const result = await checkContact(mode, env, request);
    // External dead-man monitor must alarm if this success ping stops arriving.
    if (mode === 'monitor' && env.CONTACT_MONITOR_HEARTBEAT_URL) {
      const url = new URL(env.CONTACT_MONITOR_HEARTBEAT_URL);
      if (url.protocol !== 'https:' || url.hostname !== env.CONTACT_MONITOR_HEARTBEAT_HOST || url.username || url.password || url.port || url.hash) throw new Error('invalid-heartbeat-target');
      const response = await request(url, { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw new Error('heartbeat-unavailable');
    }
    return result;
  }
  catch {
    // Optional independent channel. Never forward response bodies, URLs or secrets.
    // The scheduler must also alert on exit 1, including failure of this webhook.
    if (env.CONTACT_ALERT_WEBHOOK) {
      try {
        const url = new URL(env.CONTACT_ALERT_WEBHOOK);
        if (url.protocol !== 'https:' || url.hostname !== env.CONTACT_ALERT_ALLOWED_HOST || url.username || url.password) throw new Error('invalid-alert-target');
        const response = await request(url, { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(10000), headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'contact-check-failed', mode }) });
        if (!response.ok) throw new Error('alert-failed');
      } catch { console.error('Contact independent alarm unavailable'); }
    }
    throw new Error('contact-check-failed');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const repeat = process.argv[3] === '--repeat';
  do {
    try { await runContactCheck(process.argv[2]); console.log('PASS contact check'); }
    catch {
      console.error('FAIL contact check; inspect protected worker/monitor health');
      if (!repeat) process.exitCode = 1;
    }
    // Sequential, at most one outstanding call; no catch-up flood after downtime.
    if (repeat) await delay(300000);
  } while (repeat);
}
