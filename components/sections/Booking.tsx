import { FadeIn } from "@/components/animations";
import Section from "@/components/common/Section";
import SectionTitle from "@/components/common/SectionTitle";
import { bodyClass, kickerClass } from "@/design";
import { bookingNotice } from "@/lib/data/booking";
import { cn } from "@/lib/utils";
import BookingWizard from "@/components/booking/BookingWizard";

type BookingProps = {
  heading?: "h1" | "h2";
  variant?: "default" | "homepage";
};

export default function Booking({
  heading = "h2",
  variant = "default",
}: BookingProps) {
  const isHomepage = variant === "homepage";
  const Heading = heading;

  if (isHomepage) {
    return (
      <Section
        belowFold
        innerClassName="overflow-x-hidden"
        decorate={
          <div
            className="booking-ambient-glow pointer-events-none absolute left-1/2 bottom-0 h-[18rem] w-[min(32rem,88vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(22,163,74,0.16),transparent_72%)] blur-[56px]"
            aria-hidden
          />
        }
      >
        <div
          id="booking"
          className="pointer-events-none absolute left-0 top-[-8rem] h-px w-px md:top-0"
          aria-hidden
        />
        <div className="mx-auto w-full max-w-[1180px] border-y border-white/10 py-9 md:py-11 lg:py-12 light:border-slate-200">
          <div className="grid gap-8 md:gap-10 lg:grid-cols-[minmax(0,1.08fr)_1px_minmax(21rem,25rem)] lg:items-center lg:gap-10 xl:gap-14">
            <FadeIn className="max-w-[42rem]">
              <div>
                <p className={kickerClass}>NASLEDNJI KORAK</p>
                <Heading className="heading-display mt-3.5 font-heading text-[clamp(2rem,4.4vw,3.4rem)] font-semibold tracking-[-0.05em] text-white light:text-slate-900">
                  Imate idejo, proces ali problem,
                  <br className="hidden md:block" /> ki ga je mogoče rešiti bolje?
                </Heading>
                <p
                  className={cn(
                    bodyClass,
                    "mt-4 max-w-[36rem] text-slate-300 light:text-slate-600",
                  )}
                >
                  Povejte nam, kaj želite izboljšati. Skupaj bomo preverili,
                  kakšna rešitev ima smisel.
                </p>
              </div>
            </FadeIn>

            <div
              className="hidden self-stretch justify-self-center lg:block lg:w-px lg:bg-[linear-gradient(180deg,transparent,rgba(22,163,74,0.26)_12%,rgba(22,163,74,0.38)_50%,rgba(22,163,74,0.26)_88%,transparent)]"
              aria-hidden
            />

            <FadeIn delay={0.08} className="lg:justify-self-start">
              <div className="border-t border-[#16a34a]/18 pt-6 text-left lg:max-w-[25rem] lg:border-t-0 lg:pt-0">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 light:text-slate-500">
                  ZAČNIMO POGOVOR
                </p>
                <h3 className="mt-3 font-heading text-[1.5rem] font-semibold tracking-[-0.04em] text-white light:text-slate-900">
                  20-minutni uvodni pogovor
                </h3>
                <div className="mt-4 [&>div]:items-start [&>div]:text-left [&>div]:gap-0 [&_a]:mt-6 [&_p]:max-w-none [&_p]:text-slate-300 [&_p]:light:text-slate-600">
                  <BookingWizard />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section
      id="booking"
      belowFold
      innerClassName="flex flex-col items-center justify-center overflow-x-hidden"
      decorate={
        <div
          className="booking-ambient-glow pointer-events-none absolute left-1/2 bottom-8 h-[22rem] w-[min(36rem,90vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(22,163,74,0.22),transparent_70%)] blur-[64px]"
          aria-hidden
        />
      }
    >
      <div
        className="relative flex w-full max-w-[760px] flex-col items-center text-center"
      >
        <FadeIn className="w-full">
          <SectionTitle
            heading={heading}
            align="center"
            className="mb-0"
            index="06"
            badge="Povpraševanje"
            title="Pošljite povpraševanje"
            description={bookingNotice}
          />
        </FadeIn>

        <FadeIn delay={0.1} className="mt-10 w-full max-w-[40rem]">
          <BookingWizard />
        </FadeIn>
      </div>
    </Section>
  );
}
