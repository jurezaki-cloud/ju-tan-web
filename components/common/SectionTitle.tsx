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

      <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-4 text-base leading-7 text-gray-400 md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}