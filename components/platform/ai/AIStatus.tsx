import StatusBadge from "@/components/platform/StatusBadge";
import type { AiStatus } from "@/src/ai/types";

function tone(status: AiStatus) {
  if (status === "Error") return "caution" as const;
  if (status === "Completed" || status === "Ready") return "success" as const;
  return "neutral" as const;
}

export default function AIStatus({ status }: { status: AiStatus }) {
  return <StatusBadge label={status} tone={tone(status)} />;
}
