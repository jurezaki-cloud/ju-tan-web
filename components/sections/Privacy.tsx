import SectionTitle from "@/components/common/SectionTitle";
import { company } from "@/lib/data/company";

export default function Privacy() {
  return (
    <section id="privacy" className="below-fold relative overflow-hidden section-y">
      <div className="container relative max-w-3xl">
        <SectionTitle
          index="08"
          badge="Zasebnost"
          title="Politika zasebnosti"
          description="Kako obdelujemo podatke iz povpraševanj."
        />
        <div className="space-y-4 text-[16px] leading-[1.7] text-slate-400">
          <p>
            Upravljavec podatkov je {company.name}, e-pošta {company.contact.email}.
          </p>
          <p>
            Ob oddaji obrazca obdelujemo ime, e-pošto, telefon (če ga navedete),
            podjetje, izbrano storitev in sporočilo, da vam lahko odgovorimo in
            dogovorimo posvet. Pravna podlaga je vaše soglasje.
          </p>
          <p>
            Pogovor v vodiču storitev se shrani v brskalniku (localStorage), da
            ostane zgodovina na tej napravi. Obrazec pošlje podatke na naš
            strežnik in pooblaščenemu ponudniku e-pošte.
          </p>
          <p>
            Podatkov ne prodajamo. Soglasje lahko kadarkoli prekličete na{" "}
            {company.contact.email}.
          </p>
        </div>
      </div>
    </section>
  );
}
