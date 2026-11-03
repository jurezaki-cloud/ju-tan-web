import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ImageMagic from "@/components/free-lab/ImageMagic";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  createPageMetadata,
  serializeJsonLd,
} from "@/lib/seo";
import styles from "../free.module.css";

const description =
  "Zmanjšaj fotografije, spremeni velikost in pretvori JPG, PNG ali WebP. Brezplačno, brez prijave in brez nalaganja slik na strežnik.";
export const metadata = createPageMetadata({
  title: "Image Magic – zmanjšaj in pretvori slike",
  description,
  path: "/free/image-magic",
});

export default function ImageMagicPage() {
  return (
    <div className={styles.container}>
      <div className={styles.toolHeader}>
        <Link href="/free#orodja" className={styles.textLink}>
          <ArrowLeft size={17} aria-hidden="true" /> Vsa orodja
        </Link>
        <p className={styles.eyebrow}>JU-TAN FREE LAB / 02</p>
        <h1>
          Image Magic.
          <br />
          <span>
            Manjša datoteka.
            <br />
            Več možnosti.
          </span>
        </h1>
        <p>
          Fotografija za splet, trgovino ali sporočilo. Prava velikost in format
          — v nekaj potezah.
        </p>
      </div>
      <ImageMagic />
      <section className={styles.faq} aria-labelledby="image-faq-title">
        <div>
          <p className={styles.eyebrow}>TVOJA SLIKA. TVOJA NAPRAVA.</p>
          <h2 id="image-faq-title">Dobro je vedeti.</h2>
        </div>
        <div>
          <details>
            <summary>Kam se naloži moja fotografija?</summary>
            <p>
              Nikamor. Brskalnik prebere izbrano datoteko in ustvari novo sliko
              na tvoji napravi. Vsebine in imen datotek ne pošiljamo v analitiko
              ali shrambo. Preneseno datoteko shraniš sam.
            </p>
          </details>
          <details>
            <summary>Kateri format izberem?</summary>
            <p>
              WebP je primeren za splet, JPG za fotografije in široko
              združljivost, PNG pa za prosojne grafike brez izgub pri stiskanju.
              JPG prosojne dele zapolni z belo. Velikost rezultata je odvisna od
              slike in nastavitev; manjša datoteka ni zagotovljena.
            </p>
          </details>
          <details>
            <summary>
              Ali se ohranijo orientacija, animacija in metapodatki?
            </summary>
            <p>
              Orientacijo fotografije prebere brskalnik. Izvoz ustvari novo
              statično sliko in ne kopira izvornih podatkov EXIF, kot so GPS,
              model fotoaparata ali datum fotografiranja. Animirane PNG/WebP
              datoteke zavrnemo. Barve se lahko zaradi pretvorbe barvnega
              prostora nekoliko spremenijo.
            </p>
          </details>
          <details>
            <summary>Kakšne so omejitve?</summary>
            <p>
              Ena slika JPG, PNG ali WebP do 20 MB, 24 milijonov slikovnih pik
              in 12.000 px na stranico. Najdaljša stranica izvoza je do 4096 px.
              Manjših slik ne povečujemo. HEIC, SVG in GIF niso podprti. Na
              telefonu lahko velike slike porabijo več pomnilnika; ob težavah
              izberi manjši izvirnik.
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
                name: "JU-TAN Image Magic",
                url: absoluteUrl("/free/image-magic"),
                description,
                applicationCategory: "MultimediaApplication",
                operatingSystem: "Web browser",
                browserRequirements: "Requires JavaScript and Canvas",
                inLanguage: "sl",
                offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
              },
              breadcrumbJsonLd(
                [
                  { name: "Domov", path: "/" },
                  { name: "FREE LAB", path: "/free" },
                  { name: "Image Magic", path: "/free/image-magic" },
                ],
                "image-magic-breadcrumb",
              ),
            ],
          }),
        }}
      />
    </div>
  );
}
