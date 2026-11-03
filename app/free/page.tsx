import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check, Sparkles } from "lucide-react";
import ToolCatalog from "@/components/free-lab/ToolCatalog";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  createPageMetadata,
  serializeJsonLd,
} from "@/lib/seo";
import styles from "./free.module.css";

const title = "FREE LAB – brezplačna digitalna orodja";
const description =
  "Odkrij JU-TAN FREE LAB: QR Studio, Image Magic, kviz o Sloveniji in voščilnice Magic Surprise. PDF Master in Website Doctor sta v pripravi.";
const baseMetadata = createPageMetadata({ title, description, path: "/free" });
export const metadata = {
  ...baseMetadata,
  openGraph: {
    ...baseMetadata.openGraph,
    images: [
      {
        url: "/free/opengraph-image",
        width: 1200,
        height: 630,
        alt: "JU-TAN FREE LAB — Ustvari. Uredi. Odkrij.",
      },
    ],
  },
  twitter: { ...baseMetadata.twitter, images: ["/free/opengraph-image"] },
};

const faqs = [
  [
    "Katera orodja lahko uporabljam že danes?",
    "QR Studio, Image Magic, Slovenija Quiz Battle v solo načinu in voščilnice v Magic Surprise so že na voljo. PDF Master in Website Doctor še pripravljamo.",
  ],
  [
    "Ali potrebujem račun ali plačilno kartico?",
    "Za razpoložljiva orodja FREE LAB ne potrebuješ računa ali plačilne kartice. Tudi prihodnja orodja načrtujemo za brezplačno uporabo brez obvezne registracije.",
  ],
  [
    "Kaj se zgodi z mojimi datotekami?",
    "Image Magic obdeluje izbrano sliko v tvojem brskalniku, brez nalaganja datoteke na strežnik. Tudi PDF Master načrtujemo z lokalno obdelavo. Omejitve so navedene pri vsakem orodju.",
  ],
  [
    "Bo FREE LAB deloval na telefonu?",
    "Platforma je zasnovana za telefon, tablico in računalnik. Posamezna orodja bomo pred izdajo preverili tudi na mobilnih napravah.",
  ],
];

export default function FreePage() {
  return (
    <>
      <div className={styles.container}>
        <section className={styles.hero} aria-labelledby="lab-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <span className={styles.dot} /> JU-TAN STUDIO / FREE LAB
            </p>
            <h1 id="lab-title">
              Ustvari.
              <br />
              Uredi. <span>Odkrij.</span>
            </h1>
            <p className={styles.lead}>
              Majhna orodja.
              <br />
              <strong>Velike možnosti.</strong>
            </p>
            <p className={styles.intro}>
              Prostor za tvoje ideje in vsakodnevne digitalne izzive. Brezplačna
              orodja, narejena z občutkom za preprosto.
            </p>
            <div className={styles.actions}>
              <a href="#orodja" className={styles.primary}>
                Razišči orodja <ArrowDown size={18} aria-hidden="true" />
              </a>
              <Link href="/magic" prefetch={false} className={styles.textLink}>
                Ustvari voščilnico <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
            <p className={styles.releaseNote}>
              QR Studio, Image Magic, solo kviz in Magic Surprise so že na voljo.
            </p>
          </div>
          <div className={styles.heroArt} aria-hidden="true">
            <div className={styles.artHeader}>
              <span>JU-TAN / LAB 001</span>
              <span>✦</span>
            </div>
            <div className={styles.orbit}>
              <span className={styles.orbitLabel}>IDEJA → MOŽNOST</span>
              <span className={styles.asterisk}>✳</span>
              <span className={styles.orbitBottom}>USTVARJENO ZA VSAKOGAR</span>
            </div>
            <div className={styles.artFooter}>
              <span>
                MANJ KLIKOV.
                <br />
                VEČ USTVARJANJA.
              </span>
              <span className={styles.artNumber}>
                06<span>IZBRANIH ORODIJ</span>
              </span>
            </div>
          </div>
        </section>
        <div className={styles.principles}>
          <span>
            <Check size={17} aria-hidden="true" /> Brezplačna uporaba
          </span>
          <span>
            <Check size={17} aria-hidden="true" /> Brez obvezne prijave
          </span>
          <span>
            <Check size={17} aria-hidden="true" /> Zasnovano za mobilne naprave
          </span>
        </div>
        <ToolCatalog />
        <section className={styles.feature} aria-labelledby="feature-title">
          <div>
            <p className={styles.eyebrow}>ŽE LAHKO PREIZKUSIŠ</p>
            <h2 id="feature-title">Nekomu polepšaj dan.</h2>
            <p>
              Osebno sporočilo, animirana voščilnica ali malo presenečenje.
              Magic Surprise je že del sveta JU-TAN.
            </p>
            <Link href="/magic" prefetch={false} className={styles.primary}>
              Odpri Magic Surprise <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <Sparkles
            className={styles.featureIcon}
            size={110}
            strokeWidth={1}
            aria-hidden="true"
          />
        </section>
        <section className={styles.faq} aria-labelledby="faq-title">
          <div>
            <p className={styles.eyebrow}>DOBRO JE VEDETI</p>
            <h2 id="faq-title">Preprosto. Tudi v ozadju.</h2>
          </div>
          <div>
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section className={styles.contact}>
          <p>Imaš večjo idejo?</p>
          <h2>Ustvarimo nekaj tvojega.</h2>
          <Link href="/kontakt" className={styles.textLink}>
            Povej nam, kaj potrebuješ{" "}
            <ArrowUpRight size={20} aria-hidden="true" />
          </Link>
        </section>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "CollectionPage",
                "@id": `${absoluteUrl("/free")}#webpage`,
                url: absoluteUrl("/free"),
                name: title,
                description,
                inLanguage: "sl",
                isPartOf: { "@id": `${absoluteUrl("/")}#website` },
              },
              breadcrumbJsonLd(
                [
                  { name: "Domov", path: "/" },
                  { name: "FREE LAB", path: "/free" },
                ],
                "free-lab-breadcrumb",
              ),
            ],
          }),
        }}
      />
    </>
  );
}
