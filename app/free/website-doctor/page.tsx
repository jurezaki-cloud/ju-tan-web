import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import WebsiteDoctor from "@/components/free-lab/WebsiteDoctor";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  createPageMetadata,
  serializeJsonLd,
} from "@/lib/seo";
import styles from "../free.module.css";
const description =
  "Brezplačen lokalni pregled HTML-ja: osnovne SEO oznake, naslovi, mobilne nastavitve in alternative slik. Razumljiva priporočila brez nalaganja kode na strežnik.";
export const metadata = createPageMetadata({
  title: "Website Doctor – pregled HTML-ja",
  description,
  path: "/free/website-doctor",
});
export default function WebsiteDoctorPage() {
  return (
    <div className={styles.container}>
      <div className={styles.toolHeader}>
        <Link href="/free#orodja" className={styles.textLink}>
          <ArrowLeft size={17} aria-hidden="true" /> Vsa orodja
        </Link>
        <p className={styles.eyebrow}>JU-TAN FREE LAB / 05</p>
        <h1>
          Website Doctor.
          <br />
          <span>
            Majhni popravki.
            <br />
            Boljša osnova.
          </span>
        </h1>
        <p>
          Odkrij, kaj lahko izboljšaš v HTML-ju svoje strani. Enajst osnovnih
          pregledov, jasna pojasnila in priporočila za naslednji korak.
        </p>
      </div>
      <WebsiteDoctor />
      <section className={styles.faq} aria-labelledby="doctor-faq-title">
        <div>
          <p className={styles.eyebrow}>VEŠ, KAJ PREVERJAŠ.</p>
          <h2 id="doctor-faq-title">Pred pregledom.</h2>
        </div>
        <div>
          <details>
            <summary>Kje dobim HTML svoje strani?</summary>
            <p>
              Na računalniku odpri stran in v meniju brskalnika izberi prikaz
              izvorne kode strani. Kopiraj celoten HTML in ga prilepi v polje.
              Na telefonu lahko prilepiš kodo, ki jo že imaš. Za prvi preizkus
              uporabi gumb Vstavi primer.
            </p>
          </details>
          <details>
            <summary>Ali zadostuje spletni naslov?</summary>
            <p>
              Ta različica pregleduje prilepljeni HTML. Samodejno pridobivanje
              strani po spletnem naslovu še ni na voljo. Koda ostane v tvojem
              brskalniku; ne izvajamo njenih skript in ne odpiramo povezav ali
              slik iz kode.
            </p>
          </details>
          <details>
            <summary>Ali dobim oceno hitrosti in dostopnosti?</summary>
            <p>
              Iz HTML-ja ne moremo izmeriti hitrosti ali potrditi skladnosti z
              WCAG. Preverimo osnovne oznake in opozorimo na možne izboljšave.
              Za hitrost uporabi povezavo do PageSpeed Insights, dostopnost pa
              preveri tudi s tipkovnico, bralnikom zaslona in na telefonu.
            </p>
          </details>
          <details>
            <summary>Zakaj se poročilo razlikuje od žive strani?</summary>
            <p>
              JavaScript lahko po nalaganju doda naslove in druge elemente. Ta
              pregled ne izvaja JavaScripta, ne upošteva CSS ali HTTP glav in ni
              validator pravilnosti HTML-ja. Pri neobičajni ali napačno
              sestavljeni kodi so možne netočne ugotovitve. Opozorila preveri v
              kontekstu svoje strani.
            </p>
          </details>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebApplication",
                name: "JU-TAN Website Doctor",
                url: absoluteUrl("/free/website-doctor"),
                description,
                applicationCategory: "DeveloperApplication",
                operatingSystem: "Web browser",
                browserRequirements: "Requires JavaScript and Web Workers",
                inLanguage: "sl",
                offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
              },
              breadcrumbJsonLd(
                [
                  { name: "Domov", path: "/" },
                  { name: "FREE LAB", path: "/free" },
                  { name: "Website Doctor", path: "/free/website-doctor" },
                ],
                "website-doctor-breadcrumb",
              ),
            ],
          }),
        }}
      />
    </div>
  );
}
