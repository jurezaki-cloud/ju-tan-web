import { cn } from "@/lib/utils";
import BaseCard from "@/components/common/BaseCard";
import { numberBadgeClass, headingCard, cardBodyClass, metaClass } from "@/design";

type ProcessCardProps = {
  number: string;
  title: string;
  description: string;
  stack: string[];
  align: "left" | "right";
};

export default function ProcessCard({
  number,
  title,
  description,
  stack,
  align,
}: ProcessCardProps) {
  const fromRight = align === "right";

  return (
    <BaseCard
      className={cn(
        "w-full max-w-[400px]",
        fromRight ? "lg:ml-auto lg:text-right" : "lg:mr-auto",
      )}
    >
      <div
        className={cn(
          "relative flex items-center gap-3",
          fromRight && "lg:flex-row-reverse",
        )}
      >
        <span className={numberBadgeClass}>{number}</span>
        <h3 className={headingCard}>{title}</h3>
      </div>

      <p className={`relative mt-3 ${cardBodyClass} leading-[1.7]`}>{description}</p>

      <ul
        className={cn(
          "relative mt-3 flex flex-wrap gap-x-2 gap-y-1",
          fromRight && "lg:justify-end",
        )}
      >
        {stack.map((item, index) => (
          <li key={item} className={metaClass}>
            {index > 0 ? "• " : ""}
            {item}
          </li>
        ))}
      </ul>
    </BaseCard>
  );
}
