import { authorizeContactWorker } from "./contact-worker-auth";

type Env = Record<string, string | undefined>;
/** Vercel's existing CRON_SECRET stays unchanged; no Office credentials leave Vercel. */
export async function contactCron(request: Request, drain: (request: Request) => Promise<Response>, env: Env = process.env, send: typeof fetch = fetch) {
  if (!authorizeContactWorker(request, env.CRON_SECRET)) return new Response(null, { status: 401 });
  const result = (status: number) => new Response(null, { status, headers: { "Cache-Control": "no-store" } });
  if (env.VERCEL_ENV !== "production" || env.CONTACT_DURABLE_INBOX !== "1") return result(503);
  let heartbeat: URL;
  try {
    heartbeat = new URL(env.CONTACT_HEARTBEAT_URL || "");
    // UUID URL is a secret. Never return it or log provider response bodies.
    if (heartbeat.protocol !== "https:" || heartbeat.hostname !== "hc-ping.com" ||
        heartbeat.port || heartbeat.username || heartbeat.password || heartbeat.search || heartbeat.hash ||
        !/^\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(heartbeat.pathname) ||
        !env.CONTACT_WORKER_SECRET || env.CONTACT_WORKER_SECRET.length < 32 ||
        env.CONTACT_WORKER_SECRET === env.CRON_SECRET) return result(503);
  } catch { return result(503); }
  let healthy = false;
  try {
    const response = await drain(new Request("https://ju-tan.com/api/contact/drain", {
      method: "POST", headers: { Authorization: `Bearer ${env.CONTACT_WORKER_SECRET}` },
    }));
    healthy = response.ok && (await response.json()).healthy === true;
  } catch { /* External dead-man monitor also detects timeout or process loss. */ }
  try {
    const url = healthy ? heartbeat : new URL(heartbeat.href + "/fail");
    const ping = await send(url, { method: "POST", redirect: "error", signal: AbortSignal.timeout(10000) });
    if (!ping.ok) return result(503);
  } catch { return result(503); }
  return result(healthy ? 204 : 503);
}
