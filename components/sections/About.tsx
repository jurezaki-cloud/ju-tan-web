import {
  Bot,
  Cloud,
  ShieldCheck,
  Rocket,
  Cpu,
  HeartHandshake,
} from "lucide-react";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";

const features = [
  {
    icon: Bot,
    title: "AI Avtomatizacija",
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
    title: "Cloud Ready",
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
    <section id="about" className="relative overflow-hidden bg-[#050816] py-32 text-white">
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-green-500/10 blur-[140px]" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-green-500/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionTitle
          badge="Zakaj JU-TAN"
          title="Gradimo digitalno prihodnost podjetij."
          description="Združujemo umetno inteligenco, razvoj programske opreme, spletne aplikacije in sodobno IT infrastrukturo v rešitve, ki podjetjem omogočajo hitrejšo rast, večjo učinkovitost in dolgoročno konkurenčno prednost."
        />

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.title}
                className="group relative overflow-hidden"
              >
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-green-500/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-green-500/20">
                  <Icon className="h-10 w-10 text-green-400" />
                </div>

                <h3 className="text-2xl font-bold transition-colors group-hover:text-green-400">
                  {feature.title}
                </h3>

                <p className="mt-5 leading-8 text-gray-400">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>

        <div className="mt-24 grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            ["500+", "Zaključenih projektov"],
            ["50+", "Zadovoljnih partnerjev"],
            ["10+", "Let izkušenj"],
          ].map(([value, label]) => (
            <Card key={label} className="text-center">
              <div className="text-5xl font-black text-green-400">
                {value}
              </div>

              <p className="mt-3 text-gray-400">
                {label}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
