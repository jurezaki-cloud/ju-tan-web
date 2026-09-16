import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FadeIn } from "@/components/animations";
import SectionTitle from "@/components/common/SectionTitle";
import { surfacePanel } from "@/design";
import { cn } from "@/lib/utils";
import { cookieRows, cookiesLastUpdated } from "@/lib/data/cookies";
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
                description="Seznam temelji na kodi spletnega mesta. Analitična orodja se naložijo šele po privolitvi."
              />
              <p className="mt-4 text-[14px] text-slate-500">Zadnja posodobitev: {cookiesLastUpdated}</p>
              <div className={cn(surfacePanel, "mt-8 text-[16px] leading-[1.7] text-slate-400 light:text-slate-600")}>
                <p>
                  Nujni zapisi (seja platforme, tema, izbira pasice) so potrebni za delovanje.
                  Analitiko Vercel naložimo samo, če izberete »Sprejmem«. Marketinških piškotkov
                  tretjih oglaševalcev ne uporabljamo.
                </p>
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[36rem] text-left text-[14px]">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-300 light:border-slate-200 light:text-slate-700">
                        <th className="py-2 pr-3 font-medium">Ime</th>
                        <th className="py-2 pr-3 font-medium">Vrsta</th>
                        <th className="py-2 pr-3 font-medium">Hramba</th>
                        <th className="py-2 font-medium">Namen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cookieRows.map((row) => (
                        <tr key={row.name} className="border-b border-white/5 light:border-slate-100">
                          <td className="py-2.5 pr-3 align-top font-mono text-[12px] text-white light:text-slate-900">
                            {row.name}
                          </td>
                          <td className="py-2.5 pr-3 align-top">{row.type}</td>
                          <td className="py-2.5 pr-3 align-top">{row.store}</td>
                          <td className="py-2.5 align-top">
                            {row.purpose} {row.duration}.
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
