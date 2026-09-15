import SectionTitle from "@/components/common/SectionTitle";
import BookingWizard from "@/components/booking/BookingWizard";
import { bookingNotice } from "@/lib/data/booking";

export default function Booking() {
  return (
    <section id="booking" className="below-fold relative overflow-hidden section-y">
      <div className="container relative">
        <SectionTitle
          badge="Termin"
          title="Dogovorite se za posvet"
          description={bookingNotice}
        />
        <BookingWizard />
      </div>
    </section>
  );
}
