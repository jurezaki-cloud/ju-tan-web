import { inspectHtml } from "@/lib/free-lab/doctor-engine";
import type { DoctorReply } from "@/lib/free-lab/doctor";
self.onmessage = (event: MessageEvent<string>) => {
  let reply: DoctorReply;
  try {
    reply = { report: inspectHtml(event.data) };
  } catch (error) {
    reply = {
      error:
        error instanceof Error
          ? error.message
          : "HTML-ja ni mogoče pregledati.",
    };
  }
  self.postMessage(reply);
};
