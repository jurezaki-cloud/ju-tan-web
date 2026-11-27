import { contactCron } from "@/lib/contact-cron";
import { POST as drain } from "@/app/api/contact/drain/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 240;

export async function GET(request: Request) {
  return contactCron(request, drain);
}
