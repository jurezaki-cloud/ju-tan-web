import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import QrStudio from "@/components/free-lab/QrStudio";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  createPageMetadata,
  serializeJsonLd,
} from "@/lib/seo";
import styles from "../free.module.css";

const title = "QR Studio – brezplačni generator QR kod";
const description =
  "Ustvari QR kodo za povezavo, Wi-Fi, e-pošto, telefon, SMS ali kontakt. Izberi barvo in prenesi PNG ali SVG. Brez prijave, neposredno v brskalniku.";
export const metadata = createPageMetadata({
  title,
  description,
  path: "/free/qr-studio",
});

export default function QrStudioPage() {
  return (
    <div className={styles.container}>
      <div className={styles.toolHeader}>
        <Link href="/free#orodja" className={styles.textLink}>
          <ArrowLeft size={17} aria-hidden="true" /> Vsa orodja
        </Link>
        <p className={styles.eyebrow}>JU-TAN FREE LAB / 01</p>
        <h1>
          QR Studio.
          <br />
          <span>Od ideje do kode.</span>
        </h1>
        <p>
          QR Studio. Tvoja povezava, kontakt ali Wi-Fi — v kodi, pripravljeni za
          deljenje.
        </p>
      </div>
      <QrStudio />
      <section className={styles.faq} aria-labelledby="qr-faq-title">
        <div>
          <p className={styles.eyebrow}>OD VNOSA DO SKENIRANJA</p>
          <h2 id="qr-faq-title">Tri poteze. Ena koda.</h2>
          <ol className={styles.featureList}>
            <li>1. Izberi vrsto in vnesi podatke.</li>
            <li>2. Izberi barvo in preveri predogled.</li>
            <li>3. Prenesi kodo in jo preizkusi s telefonom.</li>
          </ol>
        </div>
        <div>
          <details>
            <summary>Ali QR koda poteče?</summary>
            <p>
              Ustvarjena koda je statična in nima časovne omejitve. Deluje,
              dokler so vključena povezava ali podatki veljavni. Če jih
              spremeniš, ustvari in deli novo kodo.
            </p>
          </details>
          <details>
            <summary>PNG ali SVG — kateri format izberem?</summary>
            <p>
              PNG je primeren za sporočila in dokumente. SVG je vektorski format
              za oblikovanje in tisk. Ohranite belo podlago in rob kode ter jo
              pred tiskom preverite na dejanski velikosti.
            </p>
          </details>
          <details>
            <summary>Kam se pošljejo moji podatki?</summary>
            <p>
              Vnosi se obdelajo samo v tem brskalniku. Ne zapisujemo jih v
              naslov strani, lokalno shrambo ali analitiko. Po osvežitvi strani
              so vnosi izgubljeni. QR koda sama vsebuje vnesene podatke, zato jo
              deli le z nameravanimi prejemniki.
            </p>
          </details>
          <details>
            <summary>Ali lahko dodam logotip ali poljubno barvo?</summary>
            <p>
              Ta prva različica ponuja šest temnih barv na beli podlagi in
              kvadratne module. Logotipov in poljubnih oblik še ne podpira, da
              ostane koda dobro berljiva. Skeniranje vedno preveri na napravi,
              ki jo bodo uporabljali prejemniki.
            </p>
          </details>
          <details>
            <summary>Katere naprave podpirajo Wi-Fi in kontakte?</summary>
            <p>
              Prepoznavanje Wi-Fi, SMS in kontaktnih kartic je odvisno od
              kamere, bralnika QR in operacijskega sistema. Wi-Fi je namenjen
              omrežjem WPA/WPA2 Personal ali odprtim omrežjem; službenih omrežij
              Enterprise ta različica ne podpira.
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
                name: "JU-TAN QR Studio",
                url: absoluteUrl("/free/qr-studio"),
                description,
                applicationCategory: "UtilitiesApplication",
                operatingSystem: "Web browser",
                browserRequirements: "Requires JavaScript",
                inLanguage: "sl",
                offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
              },
              breadcrumbJsonLd(
                [
                  { name: "Domov", path: "/" },
                  { name: "FREE LAB", path: "/free" },
                  { name: "QR Studio", path: "/free/qr-studio" },
                ],
                "qr-studio-breadcrumb",
              ),
            ],
          }),
        }}
      />
    </div>
  );
}
