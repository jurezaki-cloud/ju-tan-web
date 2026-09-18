"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations";
import { easeOut } from "@/design";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

const SHOT_W = 1896;
const SHOT_H = 1001;

type Shot = {
  src: string;
  alt: string;
  label: string;
};

const shots = {
  dashboard: {
    src: "/products/office/office-dashboard.webp",
    alt: "JU-TAN Office poslovni pregled z demonstracijskimi podatki",
    label: "Pregled",
  },
  invoices: {
    src: "/products/office/office-invoices.webp",
    alt: "JU-TAN Office računi s statusi in demonstracijskimi podatki",
    label: "Računi",
  },
  warehouse: {
    src: "/products/office/office-warehouse.webp",
    alt: "JU-TAN Office skladišče z zalogo in demonstracijskimi podatki",
    label: "Skladišče",
  },
} as const satisfies Record<string, Shot>;

function Frame({
  shot,
  className,
  imageClassName,
  sizes,
}: {
  shot: Shot;
  className?: string;
  imageClassName?: string;
  sizes: string;
}) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-[1.05rem] border border-white/12 bg-[#0a1012]",
        "shadow-[0_22px_48px_rgba(0,0,0,0.34)]",
        "light:border-slate-200/90 light:bg-white light:shadow-[0_18px_40px_rgba(15,23,42,0.1)]",
        className,
      )}
    >
      <Image
        src={shot.src}
        alt={shot.alt}
        width={SHOT_W}
        height={SHOT_H}
        sizes={sizes}
        loading="lazy"
        className={cn("h-full w-full object-cover object-top", imageClassName)}
      />
      <figcaption className="sr-only">{shot.label}</figcaption>
    </figure>
  );
}

export default function OfficeProductStage() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-[52rem] xl:max-w-[47rem] xl:pt-2">
      <motion.div
        className="pointer-events-none absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(22,163,74,0.1),transparent_66%)] blur-3xl light:bg-[radial-gradient(circle,rgba(22,163,74,0.07),transparent_66%)]"
        aria-hidden
        animate={reduceMotion ? undefined : { opacity: [0.18, 0.3, 0.18] }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Desktop >= 1280: layered editorial stage */}
      <div className="relative hidden min-h-[34rem] xl:block">
        <motion.div
          className="absolute bottom-[6%] left-0 z-[1] w-[46%] max-w-[19rem]"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: reduceMotion ? 0.01 : 0.5,
            delay: reduceMotion ? 0 : 0.18,
            ease: easeOut,
          }}
        >
          <Frame
            shot={shots.warehouse}
            sizes="(min-width: 1280px) 360px, 280px"
            imageClassName="aspect-[16/10] object-[center_28%]"
          />
        </motion.div>

        <motion.div
          className="absolute bottom-[10%] right-0 z-[2] w-[60%] max-w-[26rem]"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: reduceMotion ? 0.01 : 0.5,
            delay: reduceMotion ? 0 : 0.1,
            ease: easeOut,
          }}
        >
          <Frame
            shot={shots.invoices}
            sizes="(min-width: 1280px) 480px, 380px"
            imageClassName="aspect-[16/10] object-[center_42%]"
          />
        </motion.div>

        <motion.div
          className="relative z-[3] ml-[6%] w-[88%] max-w-[38rem]"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: reduceMotion ? 0.01 : 0.5,
            delay: reduceMotion ? 0 : 0.04,
            ease: easeOut,
          }}
        >
          <Frame
            shot={shots.dashboard}
            sizes="(min-width: 1280px) 720px, 560px"
            imageClassName="aspect-[16/10.2] object-[center_18%]"
          />
        </motion.div>
      </div>

      {/* Tablet 768–1279: dashboard dominant, reduced overlap */}
      <div className="relative hidden md:block xl:hidden">
        <FadeIn>
          <Frame
            shot={shots.dashboard}
            sizes="(min-width: 768px) 90vw, 700px"
            imageClassName="aspect-[16/9.6] object-[center_18%]"
          />
        </FadeIn>
        <div className="relative mt-5 grid grid-cols-2 items-end gap-4">
          <FadeIn delay={0.06} className="translate-y-1">
            <Frame
              shot={shots.invoices}
              sizes="(min-width: 768px) 42vw, 360px"
              imageClassName="aspect-[16/10] object-[center_42%]"
            />
          </FadeIn>
          <FadeIn delay={0.1} className="-translate-y-2">
            <Frame
              shot={shots.warehouse}
              sizes="(min-width: 768px) 38vw, 320px"
              imageClassName="aspect-[16/10] object-[center_28%]"
            />
          </FadeIn>
        </div>
      </div>

      {/* Mobile <= 767: deliberate crops — zoom UI proof, not full desktop */}
      <div className="grid gap-4 md:hidden">
        <FadeIn>
          <Frame
            shot={shots.dashboard}
            sizes="100vw"
            className="relative aspect-[4/3]"
            imageClassName="absolute left-[-52%] top-[-26%] h-auto w-[270%] max-w-none"
          />
        </FadeIn>
        <FadeIn delay={0.06}>
          <Frame
            shot={shots.invoices}
            sizes="100vw"
            className="relative aspect-[4/3]"
            imageClassName="absolute left-[-180%] top-[-50%] h-auto w-[310%] max-w-none"
          />
        </FadeIn>
        <FadeIn delay={0.1}>
          <Frame
            shot={shots.warehouse}
            sizes="100vw"
            className="relative aspect-[4/3]"
            imageClassName="absolute left-[-188%] top-[-56%] h-auto w-[315%] max-w-none"
          />
        </FadeIn>
      </div>
    </div>
  );
}
