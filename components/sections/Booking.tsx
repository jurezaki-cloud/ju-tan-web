import SectionTitle from "@/components/common/SectionTitle";
import BookingWizard from "@/components/booking/BookingWizard";
import { bookingNotice } from "@/lib/data/booking";

type BookingProps = {
  heading?: "h1" | "h2";
};

export default function Booking({ heading = "h2" }: BookingProps) {
  return (
    <section id="booking" className="below-fold relative overflow-hidden section-y">
      <div className="container relative">
        <SectionTitle
          heading={heading}
          index="06"
          badge="Termin"
          title="Rezervirajte termin"
          description={bookingNotice}
        />
        <BookingWizard />
      </div>
    </section>
  );
}
