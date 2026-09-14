import { Badge } from "@/components/ui/badge";

interface SectionTitleProps {
  badge: string;
  title: string;
  description?: string;
}

export default function SectionTitle({
  badge,
  title,
  description,
}: SectionTitleProps) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <Badge>{badge}</Badge>

      <h2 className="mt-3 mb-4 text-[32px] font-black leading-tight md:text-[46px]">
        {title}
      </h2>

      {description ? (
        <p className="text-[16px] leading-[1.65] text-gray-400">{description}</p>
      ) : null}
    </div>
  );
}
