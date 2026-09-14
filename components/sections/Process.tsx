"use client";

import SectionTitle from "@/components/common/SectionTitle";
import ProcessCard from "@/components/process/ProcessCard";
import { FadeIn } from "@/components/animations";
import { process } from "@/lib/data/process";

export default function Process() {
  return (
    <section id="process" className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-emerald-500/5" />
      <div className="pointer-events-none absolute right-[-120px] top-32 h-[380px] w-[380px] rounded-full bg-green-500/12 blur-[140px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]
          [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)]
          [background-size:72px_72px]"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="container relative">
        <FadeIn>
          <SectionTitle
            badge="Postopek"
            title="Kako poteka sodelovanje"
            description="Jasna pot od analize do dolgoročne podpore."
          />
        </FadeIn>

        <div className="relative mx-auto mt-20 max-w-5xl">
          <div className="absolute top-0 bottom-6 left-[1.35rem] w-px bg-gradient-to-b from-green-500/0 via-green-500/40 to-green-500/0 lg:left-1/2 lg:-translate-x-1/2" />

          <ol className="space-y-10 lg:space-y-16">
            {process.map((step, index) => {
              const isEven = index % 2 === 0;

              return (
                <li key={step.number} className="relative">
                  <span className="absolute top-8 left-0 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-green-400/40 bg-[#050816] text-sm font-black text-green-300 shadow-[0_0_24px_rgba(34,197,94,0.35)] lg:left-1/2 lg:-translate-x-1/2">
                    {step.number}
                  </span>

                  <div
                    className={`pl-14 lg:w-1/2 lg:pl-0 ${
                      isEven ? "lg:pr-16" : "lg:ml-auto lg:pl-16"
                    }`}
                  >
                    <FadeIn delay={index * 0.08}>
                      <ProcessCard
                        step={step.number}
                        title={step.title}
                        description={step.description}
                        icon={step.icon}
                      />
                    </FadeIn>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
