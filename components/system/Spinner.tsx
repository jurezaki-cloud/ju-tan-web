import { cn } from "@/lib/utils";
import { getMessages } from "@/lib/i18n/messages";

type SpinnerProps = {
  size?: "sm" | "md";
  label?: string;
  className?: string;
};

export default function Spinner({
  size = "md",
  label,
  className,
}: SpinnerProps) {
  const loadingLabel = label ?? getMessages().a11y.loading;

  return (
    <span
      role="status"
      aria-label={loadingLabel}
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
        size === "sm" ? "size-4" : "size-5",
        className,
      )}
    />
  );
}
