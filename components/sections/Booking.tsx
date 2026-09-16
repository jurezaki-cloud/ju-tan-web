import { FadeIn } from "@/components/animations";
import Section from "@/components/common/Section";
import SectionTitle from "@/components/common/SectionTitle";
import { bookingNotice } from "@/lib/data/booking";
import BookingWizard from "@/components/booking/BookingWizard";

type BookingProps = {
  heading?: "h1" | "h2";
};

export default function Booking({ heading = "h2" }: BookingProps) {
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
      <div className="relative flex w-full max-w-[760px] flex-col items-center text-center">
        <FadeIn className="w-full">
          <SectionTitle
            heading={heading}
            align="center"
            className="mb-0"
            index="06"
            badge="Posvet"
            title="Dogovorite posvet"
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
