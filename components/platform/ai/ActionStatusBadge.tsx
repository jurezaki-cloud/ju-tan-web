import StatusBadge from "@/components/platform/StatusBadge";
import type { ActionStatus } from "@/src/ai/actions/types";

function tone(status: ActionStatus) {
  if (status === "Completed") return "success" as const;
  if (status === "Failed" || status === "Cancelled") return "caution" as const;
  return "neutral" as const;
}

export default function ActionStatusBadge({ status }: { status: ActionStatus }) {
  return <StatusBadge label={status} tone={tone(status)} />;
}
