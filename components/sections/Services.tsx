"use client";

import {
  Brain,
  Code2,
  Globe,
  Palette,
  Video,
  Server,
} from "lucide-react";

const services = [
  {
    icon: Brain,
    title: "AI Avtomatizacija",
    text: "Pametni AI sistemi, chatboti in avtomatizacija poslovnih procesov.",
  },
  {
    icon: Code2,
    title: "Programska oprema",
    text: "Razvoj namiznih in spletnih aplikacij po meri.",
  },
  {
    icon: Globe,
    title: "Spletne strani",
    text: "Moderne, hitre in SEO optimizirane spletne strani.",
  },
  {
    icon: Palette,
    title: "Grafično oblikovanje",
    text: "Celostne grafične podobe, logotipi in promocijski materiali.",
  },
  {
    icon: Video,
    title: "Video produkcija",
    text: "Profesionalni predstavitveni in promocijski videi.",
  },
  {
    icon: Server,
    title: "IT infrastruktura",
    text: "Omrežja, strežniki, varnostne kopije in podpora podjetjem.",
  },
];

export default function Services() {
  return (
    <section className="bg-[#08101f] py-28 text-white">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <p className="text-green-400 font-semibold uppercase tracking-[4px]">
            Naše storitve
          </p>

          <h2 className="mt-4 text-5xl font-black">
            Digitalne rešitve prihodnosti
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-gray-400">
            JU-TAN združuje umetno inteligenco, razvoj programske opreme,
            spletne tehnologije in IT infrastrukturo v celovite poslovne rešitve.
          </p>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-2 hover:border-green-500/40 hover:bg-white/10"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10">
                  <Icon className="h-8 w-8 text-green-400" />
                </div>

                <h3 className="text-2xl font-bold">
                  {service.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-400">
                  {service.text}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}