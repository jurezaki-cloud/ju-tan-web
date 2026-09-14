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
    <div className="mx-auto max-w-3xl text-center">
      <Badge>{badge}</Badge>

      <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
        {title}
      </h2>

      {description && (
        <p className="mt-3 text-[16px] leading-[1.65] text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
}