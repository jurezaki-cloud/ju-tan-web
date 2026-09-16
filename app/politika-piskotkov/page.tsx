import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FadeIn } from "@/components/animations";
import SectionTitle from "@/components/common/SectionTitle";
import { surfacePanel } from "@/design";
import { cn } from "@/lib/utils";
import {
  createPageMetadata,
  breadcrumbJsonLd,
  serializeJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Politika piškotkov",
  description:
    "Politika piškotkov podjetja JU-TAN. Informacije o piškotkih na spletnem mestu in možnostih upravljanja.",
  path: "/politika-piskotkov",
});

export default function CookiePolicyPage() {
  return (
    <>
      <Header />
      <main id="main">
        <article className="section-y">
          <div className="container">
            <FadeIn className="mx-auto max-w-[760px]">
              <SectionTitle
                heading="h1"
                badge="Pravna obvestila"
                title="Politika piškotkov"
                description="Na tej strani bo JU-TAN objavil seznam piškotkov, njihov namen, trajanje in pravno podlago. Seznam mora ustrezati dejanskim piškotkom na spletnem mestu; dokler ni dopolnjen, ga ne obravnavajte kot dokončen."
              />
              <div className={cn(surfacePanel, "text-[16px] leading-[1.7] text-slate-400 light:text-slate-600")}>
                <p>
                  Nujni piškotki, ki so potrebni za delovanje strani (npr.
                  nastavitev teme), se lahko uporabljajo brez predhodne
                  privolitve. Analitične ali marketinške piškotke sme JU-TAN
                  uporabljati šele po privolitvi — [dopolniti, ali se
                  uporabljajo].
                </p>
                <p className="mt-4">
                  Podrobnosti o obdelavi osebnih podatkov so v{" "}
                  <Link
                    href="/politika-zasebnosti"
                    className="font-medium text-[#16a34a] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
                  >
                    Politiki zasebnosti
                  </Link>
                  .
                </p>
              </div>
            </FadeIn>
          </div>
        </article>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            "@context": "https://schema.org",
            ...breadcrumbJsonLd(
              [
                { name: "Domov", path: "/" },
                { name: "Politika piškotkov", path: "/politika-piskotkov" },
              ],
              "breadcrumb-cookies",
            ),
          }),
        }}
      />
      <Footer />
    </>
  );
}
