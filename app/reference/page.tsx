import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import References from "@/components/sections/References";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Reference | Spletne strani, portali in poslovna programska oprema",
  description: "Izbrani projekti JU-TAN Studio: Tanjina lučka upanja, KampRadar in lasten poslovni program JU-TAN Office.",
  path: "/reference",
});

export default function ReferencePage() {
  return (
    <>
      <Header />
      <main id="main" className="pt-24"><References full /></main>
      <Footer />
    </>
  );
}
