import CoreMark from "@/components/common/CoreMark";
import { cn } from "@/lib/utils";
import { kickerClass, bodyClass } from "@/design";

type SectionTitleProps = {
  index?: string;
  badge: string;
  title: string;
  description?: string;
  heading?: "h1" | "h2";
  align?: "start" | "center";
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  showRule?: boolean;
};

export default function SectionTitle({
  index,
  badge,
  title,
  description,
  heading = "h2",
  align = "start",
  className,
  titleClassName,
  descriptionClassName,
  showRule = true,
}: SectionTitleProps) {
  const Heading = heading;
  const centered = align === "center";

  return (
    <div
      className={cn(
        centered
          ? "mx-auto mb-10 flex w-full max-w-3xl flex-col items-center text-center"
          : "mb-10 max-w-2xl",
        className,
      )}
    >
      <p
        className={cn(
          kickerClass,
          centered && "justify-center",
        )}
      >
        <CoreMark className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        {index ? (
          <span className="tabular-nums text-green-600/80">{index}</span>
        ) : null}
        {badge}
      </p>

      <Heading
        className={cn(
          "heading-display mt-3.5 font-heading font-semibold break-words text-white light:text-slate-900",
          titleClassName,
        )}
      >
        {title}
      </Heading>

      {description ? (
        <p
          className={cn(
            bodyClass,
            "mt-3.5 max-w-[40rem]",
            centered && "w-full",
            descriptionClassName,
          )}
        >
          {description}
        </p>
      ) : null}

      {showRule ? (
        <div className={cn("plate-rule mt-6", centered && "mx-auto")} aria-hidden />
      ) : null}
    </div>
  );
}
