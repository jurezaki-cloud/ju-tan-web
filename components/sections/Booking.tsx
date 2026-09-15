import SectionTitle from "@/components/common/SectionTitle";
import BookingWizard from "@/components/booking/BookingWizard";

export default function Booking() {
  return (
    <section id="booking" className="below-fold relative overflow-hidden section-y">
      <div className="container relative">
        <SectionTitle
          badge="Termin"
          title="Dogovorite se za posvet"
          description="Po oddaji povpraševanja vas bomo kontaktirali za dogovor termina."
        />
        <BookingWizard />
      </div>
    </section>
  );
}
