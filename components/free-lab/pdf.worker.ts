import { processPdfJob } from "@/lib/free-lab/pdf-engine";
import type { PdfJob, PdfReply } from "@/lib/free-lab/pdf";

const scope = self as unknown as {
  onmessage: (event: MessageEvent<PdfJob>) => void;
  postMessage: (reply: PdfReply) => void;
};
scope.onmessage = async (event) => {
  try {
    scope.postMessage(await processPdfJob(event.data));
  } catch (error) {
    scope.postMessage({
      pages: [],
      error: error instanceof Error ? error.message : "Obdelava PDF ni uspela.",
    });
  }
};
