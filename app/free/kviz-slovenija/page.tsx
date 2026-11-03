import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SloveniaQuiz from "@/components/free-lab/SloveniaQuiz";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  createPageMetadata,
  serializeJsonLd,
} from "@/lib/seo";
import styles from "../free.module.css";

const description =
  "Preizkusi znanje o Sloveniji: deset vprašanj o naravi, krajih in zgodovini. Brezplačen solo kviz z razlagami odgovorov, brez prijave in časovne omejitve.";
export const metadata = createPageMetadata({
  title: "Slovenija Quiz Battle – brezplačen kviz o Sloveniji",
  description,
  path: "/free/kviz-slovenija",
});
export default function QuizPage() {
  return (
    <div className={styles.container}>
      <div className={styles.toolHeader}>
        <Link href="/free#orodja" className={styles.textLink}>
          <ArrowLeft size={17} aria-hidden="true" /> Vsa orodja
        </Link>
        <p className={styles.eyebrow}>JU-TAN FREE LAB / 03</p>
        <h1>
          Slovenija Quiz Battle.
          <br />
          <span>
            Majhna dežela.
            <br />
            Velik izziv.
          </span>
        </h1>
        <p>
          Od vrhov do zgodovinskih mejnikov. Preizkusi svoje znanje v solo kvizu
          in odkrij nekaj novega.
        </p>
      </div>
      <SloveniaQuiz />
      <section className={styles.faq} aria-labelledby="quiz-faq-title">
        <div>
          <p className={styles.eyebrow}>IGRAJ. ODKRIJ. PONOVI.</p>
          <h2 id="quiz-faq-title">Pošten izziv.</h2>
        </div>
        <div>
          <details>
            <summary>Ali igram proti drugim igralcem?</summary>
            <p>
              Ta prva različica je solo kviz. Spletnih nasprotnikov, skupnih sob
              in javne lestvice še nima. Vsak pravilen odgovor prinese 100 točk;
              hitrost ne vpliva na rezultat.
            </p>
          </details>
          <details>
            <summary>Ali se moj rezultat shrani?</summary>
            <p>
              Ne. Rezultat in odgovori ostanejo v pomnilniku tega zavihka do
              ponovnega začetka, ponastavitve ali osvežitve strani. Za igro ne
              potrebuješ računa.
            </p>
          </details>
          <details>
            <summary>Od kod prihajajo vprašanja?</summary>
            <p>
              Vprašanja temeljijo na podatkih{" "}
              <a href="https://www.gov.si/podrocja/drzava-in-druzba/o-sloveniji/">
                GOV.SI
              </a>{" "}
              in{" "}
              <a href="https://www.slovenia.info/en/places-to-go/attractions/postojna-cave">
                Slovenske turistične organizacije
              </a>
              . Po vsakem odgovoru in v končnem pregledu je povezava do
              pripadajočega vira. Zbirka je bila preverjena 3. novembra 2026.
            </p>
          </details>
          <details>
            <summary>Zakaj se nekatera vprašanja ponovijo?</summary>
            <p>
              Začetna zbirka vsebuje 12 vprašanj. Vsaka igra izbere deset
              vprašanj brez ponovitve znotraj iste igre ter premeša odgovore.
              Med različnimi igrami se vprašanja lahko ponovijo.
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
                name: "Slovenija Quiz Battle",
                url: absoluteUrl("/free/kviz-slovenija"),
                description,
                applicationCategory: "GameApplication",
                operatingSystem: "Web browser",
                inLanguage: "sl",
                offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
              },
              breadcrumbJsonLd(
                [
                  { name: "Domov", path: "/" },
                  { name: "FREE LAB", path: "/free" },
                  {
                    name: "Slovenija Quiz Battle",
                    path: "/free/kviz-slovenija",
                  },
                ],
                "quiz-breadcrumb",
              ),
            ],
          }),
        }}
      />
    </div>
  );
}
