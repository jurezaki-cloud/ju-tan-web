import SectionTitle from "@/components/common/SectionTitle";
import { company } from "@/lib/data/company";

export default function Privacy() {
  return (
    <section id="privacy" className="below-fold relative overflow-hidden section-y">
      <div className="container relative max-w-3xl">
        <SectionTitle
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
            Podatkov ne prodajamo. Hrani jih pooblaščeni ponudnik e-pošte za
            namen dostave sporočila. Soglasje lahko kadarkoli prekličete na{" "}
            {company.contact.email}.
          </p>
        </div>
      </div>
    </section>
  );
}
