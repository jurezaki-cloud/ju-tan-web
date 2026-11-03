import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PdfMaster from "@/components/free-lab/PdfMaster";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  createPageMetadata,
  serializeJsonLd,
} from "@/lib/seo";
import styles from "../free.module.css";
const description =
  "Združi PDF-je, izloči izbrane strani, spremeni njihovo zaporedje in jih zavrti. Brezplačno, brez prijave in brez nalaganja dokumentov na strežnik.";
export const metadata = createPageMetadata({
  title: "PDF Master – združi in uredi PDF",
  description,
  path: "/free/pdf-master",
});
export default function PdfMasterPage() {
  return (
    <div className={styles.container}>
      <div className={styles.toolHeader}>
        <Link href="/free#orodja" className={styles.textLink}>
          <ArrowLeft size={17} aria-hidden="true" /> Vsa orodja
        </Link>
        <p className={styles.eyebrow}>JU-TAN FREE LAB / 04</p>
        <h1>
          PDF Master.
          <br />
          <span>
            Tvoje strani.
            <br />
            Tvoj vrstni red.
          </span>
        </h1>
        <p>
          Združi dokumente ali izloči samo strani, ki jih potrebuješ. Preprosto,
          lokalno in brez prijave.
        </p>
      </div>
      <PdfMaster />
      <section className={styles.faq} aria-labelledby="pdf-faq-title">
        <div>
          <p className={styles.eyebrow}>MANJ UREJANJA. VEČ REDA.</p>
          <h2 id="pdf-faq-title">Preden začneš.</h2>
        </div>
        <div>
          <details>
            <summary>Kako združim ali razdelim PDF?</summary>
            <p>
              Za združevanje izberi več dokumentov in jih razvrsti z gumboma Gor
              in Dol. Za izločitev dela PDF izberi en dokument ter vpiši želene
              strani, na primer 1-3. Izvoz ustvari en nov PDF. Za več ločenih
              datotek ponovi izvoz z drugim izborom.
            </p>
          </details>
          <details>
            <summary>Ali dokumenti zapustijo mojo napravo?</summary>
            <p>
              Ne. Obdelava poteka v ločenem delu brskalnika, brez nalaganja
              dokumentov ali imen datotek na strežnik. Orodje jih ne shranjuje v
              račun ali lokalno shrambo. Po čiščenju ali osvežitvi strani jih
              moraš izbrati znova.
            </p>
          </details>
          <details>
            <summary>Kaj se pri izvozu ne ohrani?</summary>
            <p>
              Izvoz sestavi nov dokument iz izbranih strani. Zaznamki, struktura
              dostopnosti in veljavnost digitalnih podpisov se ne ohranijo.
              Obrazce in zaščitene PDF-je zavrnemo. Orodje ne pregleduje ali
              odstranjuje morebitne nevarne vsebine. Izvirnike obdrži in
              rezultat preveri v svojem bralniku PDF.
            </p>
          </details>
          <details>
            <summary>Ali lahko urejam besedilo ali stisnem PDF?</summary>
            <p>
              Ta različica omogoča združevanje, izbor, zaporedje in vrtenje
              strani. Urejanje besedila, OCR, stiskanje, sličice strani in
              paketni izvoz v ZIP še niso podprti. Obdelava je omejena na 30
              sekund; pri večjih dokumentih poskusi z manjšim izborom datotek.
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
                name: "JU-TAN PDF Master",
                url: absoluteUrl("/free/pdf-master"),
                description,
                applicationCategory: "UtilitiesApplication",
                operatingSystem: "Web browser",
                browserRequirements: "Requires JavaScript and Web Workers",
                inLanguage: "sl",
                offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
              },
              breadcrumbJsonLd(
                [
                  { name: "Domov", path: "/" },
                  { name: "FREE LAB", path: "/free" },
                  { name: "PDF Master", path: "/free/pdf-master" },
                ],
                "pdf-master-breadcrumb",
              ),
            ],
          }),
        }}
      />
    </div>
  );
}
