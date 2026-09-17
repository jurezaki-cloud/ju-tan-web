import { cn } from "@/lib/utils";
import CTAButton from "@/components/navbar/CTAButton";
import { getMessages } from "@/lib/i18n/messages";

type HeaderCTAProps = {
  className?: string;
  onClick?: () => void;
};

export default function HeaderCTA({ className, onClick }: HeaderCTAProps) {
  const copy = getMessages().header;

  return (
    <CTAButton
      href="/kontakt"
      size="compact"
      className={cn("w-full sm:w-auto", className)}
      onClick={onClick}
      aria-label={copy.ctaAria}
    />
  );
}
