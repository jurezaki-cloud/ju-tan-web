import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PrivacyPolicyContent from "@/components/privacy/PrivacyPolicyContent";
import {
  createPageMetadata,
  breadcrumbJsonLd,
  serializeJsonLd,
} from "@/lib/seo";
import { privacyMeta } from "@/lib/data/privacy";

export const metadata: Metadata = createPageMetadata({
  title: privacyMeta.title,
  description: privacyMeta.description,
  path: privacyMeta.path,
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main id="main">
        <PrivacyPolicyContent />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            "@context": "https://schema.org",
            ...breadcrumbJsonLd(
              [
                { name: "Domov", path: "/" },
                { name: "Politika zasebnosti", path: privacyMeta.path },
              ],
              "breadcrumb-privacy",
            ),
          }),
        }}
      />
      <Footer />
    </>
  );
}
