import { cn } from "@/lib/utils";

type StatusTone = "neutral" | "success" | "caution";

const toneClass: Record<StatusTone, string> = {
  neutral:
    "border-white/10 text-slate-400 light:border-slate-200 light:text-slate-600",
  success: "border-[#16a34a] text-[#16a34a]",
  caution: "border-red-400/60 text-red-400",
};

type StatusBadgeProps = {
  label: string;
  tone?: StatusTone;
};

export function statusTone(label: string): StatusTone {
  const value = label.toLowerCase();
  if (
    value === "resolved" ||
    value === "aktiven" ||
    value === "active" ||
    value === "accepted" ||
    value === "sent" ||
    value === "povezano" ||
    value === "zaključeno" ||
    value === "uvedba" ||
    value === "sent"
  ) {
    return "success";
  }
  if (
    value === "visoka" ||
    value === "open" ||
    value === "neaktiven" ||
    value === "disabled" ||
    value === "expired" ||
    value === "revoked" ||
    value === "deactivated" ||
    value === "failed" ||
    value === "locked" ||
    value === "flagged" ||
    value === "blocked" ||
    value === "cooldown" ||
    value === "rate limited" ||
    value === "degraded"
  ) {
    return "caution";
  }
  return "neutral";
}

export default function StatusBadge({
  label,
  tone = "neutral",
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-lg border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.14em]",
        toneClass[tone],
      )}
    >
      {label}
    </span>
  );
}
