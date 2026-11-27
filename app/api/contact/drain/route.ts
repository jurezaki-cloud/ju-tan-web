import { NextResponse } from "next/server";
import { privateInbox, inboxConfigHash } from "@/lib/contact-inbox-blob";
import { deliverInboxIntent } from "@/lib/contact-inbox-delivery";
import { runContactWorker } from "@/lib/contact-operations";
import { authorizeContactWorker } from "@/lib/contact-worker-auth";
import { contactPool } from "@/lib/contact-db";
import { projectConfirmed } from "@/lib/contact-projection";
export const runtime = "nodejs";
export async function POST(req: Request) {
  if (!authorizeContactWorker(req, process.env.CONTACT_WORKER_SECRET)) return new Response(null, { status: 401 });
  if (process.env.CONTACT_DURABLE_INBOX !== "1") return new Response(null, { status: 503 });
  try {
    const summary = await runContactWorker(privateInbox(), inboxConfigHash(), deliverInboxIntent, Date.now,
      (intent, receipt) => projectConfirmed(contactPool(), intent, receipt));
    return NextResponse.json(summary, { status: summary.healthy ? 200 : 503, headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ unavailable: true }, { status: 503, headers: { "Cache-Control": "no-store" } }); }
}
