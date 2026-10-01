import { bodyClass } from "@/design";
import { cn } from "@/lib/utils";

export type SeoFaqItem = {
  question: string;
  answer: string;
};

export default function SeoFaq({
  id,
  title = "Pogosta vprašanja",
  items,
}: {
  id: string;
  title?: string;
  items: readonly SeoFaqItem[];
}) {
  return (
    <section aria-labelledby={id} className="bg-[#050816] py-16 light:bg-slate-50 md:py-20">
      <div className="container mx-auto max-w-[52rem]">
        <h2 id={id} className="heading-display font-heading font-semibold text-white light:text-slate-900">
          {title}
        </h2>
        <dl className="mt-8 divide-y divide-white/10 border-y border-white/10 light:divide-slate-200 light:border-slate-200">
          {items.map((item) => (
            <div key={item.question} className="py-6">
              <dt className="font-heading text-[1.05rem] font-semibold text-white light:text-slate-900">
                {item.question}
              </dt>
              <dd className={cn(bodyClass, "mt-2 max-w-[46rem] text-slate-400 light:text-slate-600")}>
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
