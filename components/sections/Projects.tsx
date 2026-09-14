import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { FadeIn } from "@/components/animations";
import ProjectsGrid from "@/components/projects/ProjectsGrid";

const buttonTransition =
  "transition-all duration-[250ms] ease-out hover:-translate-y-1 active:scale-[0.97]";

export default function Projects() {
  return (
    <section id="projects" className="relative overflow-hidden py-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-24 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-green-500/12 blur-[160px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]
          [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)]
          [background-size:72px_72px]"
      />

      <div className="container relative">
        <FadeIn>
          <SectionTitle
            badge="Projekti"
            title="Naši projekti"
            description="Rešitve, ki podjetjem pomagajo pri digitalizaciji, avtomatizaciji in uporabi umetne inteligence."
          />
        </FadeIn>

        <ProjectsGrid />

        <FadeIn delay={0.15}>
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center shadow-lg shadow-black/10 backdrop-blur-xl">
            <h3 className="text-[28px] font-bold text-white">Imate projekt?</h3>
            <p className="mx-auto mt-3 max-w-xl text-[16px] leading-[1.65] text-slate-400">
              Skupaj razvijemo rešitev po meri vašega podjetja.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="#contact"
                className={`group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 px-6 py-3 font-semibold text-white shadow-lg shadow-green-600/30 hover:shadow-xl hover:shadow-green-500/50 ${buttonTransition}`}
              >
                Brezplačen posvet
                <ArrowRight className="h-5 w-5 transition-transform duration-[250ms] group-hover:translate-x-1" />
              </Link>

              <Link
                href="#contact"
                className={`group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white shadow-md shadow-black/20 backdrop-blur-sm hover:border-green-500/50 hover:bg-white/10 hover:shadow-lg hover:shadow-green-500/20 ${buttonTransition}`}
              >
                Kontakt
                <Mail
                  className="transition-transform duration-[250ms] group-hover:scale-110"
                  size={20}
                />
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
