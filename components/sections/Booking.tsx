import SectionTitle from "@/components/common/SectionTitle";
import BookingWizard from "@/components/booking/BookingWizard";

export default function Booking() {
  return (
    <section id="booking" className="relative overflow-hidden py-20">
      <div className="container relative">
        <SectionTitle
          badge="Rezervacija"
          title="Izberite termin za posvet"
          description="Izberite storitev, svetovalca, datum in uro. Potrditev prejmete na e-pošto."
        />
        <BookingWizard />
      </div>
    </section>
  );
}
