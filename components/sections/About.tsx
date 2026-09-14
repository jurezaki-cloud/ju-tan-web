import {
  Bot,
  Cloud,
  ShieldCheck,
  Rocket,
  Cpu,
  HeartHandshake,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SectionTitle from "@/components/common/SectionTitle";
import { FadeIn, Reveal } from "@/components/animations";

const features = [
  {
    icon: Bot,
    title: "AI avtomatizacija",
    description:
      "Razvijamo inteligentne AI agente in avtomatizacije, ki prihranijo čas ter povečajo produktivnost.",
  },
  {
    icon: Rocket,
    title: "Hitra izvedba",
    description:
      "Od ideje do delujoče rešitve v najkrajšem možnem času z uporabo sodobnih tehnologij.",
  },
  {
    icon: ShieldCheck,
    title: "Zanesljivost",
    description:
      "Varnost, stabilnost in kakovost so temelj vsake rešitve, ki jo razvijemo.",
  },
  {
    icon: Cloud,
    title: "Pripravljenost na oblak",
    description:
      "Pripravljeni na lokalno ali oblačno infrastrukturo z visoko razpoložljivostjo.",
  },
  {
    icon: Cpu,
    title: "Razvoj po meri",
    description:
      "Programska oprema, spletne aplikacije in AI sistemi prilagojeni vašemu poslovanju.",
  },
  {
    icon: HeartHandshake,
    title: "Dolgoročna podpora",
    description:
      "Projekt se ne konča z objavo – partnerjem nudimo podporo in nadaljnji razvoj.",
  },
];

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden py-16 md:py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-green-500/10 blur-[140px]" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-green-500/10 blur-[140px]" />

      <div className="container relative">
        <FadeIn>
          <SectionTitle
            badge="Zakaj JU-TAN"
            title="Gradimo digitalno prihodnost podjetij"
            description="Združujemo umetno inteligenco, razvoj programske opreme, spletne aplikacije in sodobno IT infrastrukturo v rešitve, ki podjetjem omogočajo hitrejšo rast, večjo učinkovitost in dolgoročno konkurenčno prednost."
          />
        </FadeIn>

        <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-2 md:mt-8 xl:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <Reveal key={feature.title} delay={index * 0.08}>
                <Card className="group relative overflow-hidden">
                  <CardContent>
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-green-500/20">
                      <Icon className="h-7 w-7 text-green-400" />
                    </div>

                    <h3 className="text-xl font-bold transition-colors group-hover:text-green-400">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-[16px] leading-[1.65] text-gray-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            ["500+", "Zaključenih projektov"],
            ["50+", "Zadovoljnih partnerjev"],
            ["10+", "Let izkušenj"],
          ].map(([value, label]) => (
            <Card key={label} className="text-center">
              <CardContent>
                <div className="text-5xl font-black text-green-400">
                  {value}
                </div>

                <p className="mt-3 text-gray-400">
                  {label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
