import { NextResponse } from "next/server";
import { privateInbox } from "@/lib/contact-inbox-blob";
import { contactDay, dailyCount, workerHealth } from "@/lib/contact-operations";
import { authorizeContactWorker } from "@/lib/contact-worker-auth";
export const runtime = "nodejs";
export async function GET(req: Request) {
  if (!authorizeContactWorker(req, process.env.CONTACT_MONITOR_SECRET)) return new Response(null, { status: 401 });
  if (process.env.CONTACT_DURABLE_INBOX !== "1") return new Response(null, { status: 503 });
  try {
    const store = privateInbox();
    const health = await workerHealth(store);
    const day = contactDay(Date.now());
    const confirmedToday = await dailyCount(store, day);
    return NextResponse.json({ ...health, day, confirmedToday, timeZone: "Europe/Ljubljana" }, { status: health.healthy ? 200 : 503, headers: { "Cache-Control": "no-store, private" } });
  } catch { return NextResponse.json({ healthy: false, unavailable: true }, { status: 503, headers: { "Cache-Control": "no-store, private" } }); }
}
