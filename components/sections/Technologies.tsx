import SectionTitle from "@/components/common/SectionTitle";
import { FadeIn } from "@/components/animations";

const technologies = [
  { title: "Frontend", text: "Next.js · React · Tailwind" },
  { title: "Backend", text: "Node.js · Python · API integracije" },
  { title: "AI", text: "OpenAI · LangChain · AI agenti" },
  { title: "Cloud", text: "Docker · Linux · VPS · Cloudflare" },
  { title: "Database", text: "PostgreSQL · MySQL · SQLite" },
  { title: "DevOps", text: "CI/CD · monitoring · varnostne kopije" },
] as const;

export default function Technologies() {
  return (
    <section id="technologies" className="below-fold relative overflow-hidden section-y">
      <div className="container relative">
        <FadeIn>
          <SectionTitle
            index="03"
            badge="Tehnologije"
            title="Sklad, ki ga vzdržujemo"
            description="Orodja, s katerimi izvajamo in vzdržujemo produkcijo."
          />
        </FadeIn>

        <ul className="max-w-3xl">
          {technologies.map((item) => (
            <li
              key={item.title}
              className="grid gap-1 border-t border-white/[0.08] py-5 first:border-t-0 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-baseline sm:gap-8"
            >
              <h3 className="font-heading text-[15px] font-semibold tracking-[-0.03em] text-white light:text-slate-900">
                {item.title}
              </h3>
              <p className="text-[15px] leading-[1.65] text-slate-400">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
