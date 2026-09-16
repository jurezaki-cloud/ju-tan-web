import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Prijava",
  robots: { index: false, follow: false },
};

export default function IdentityLayout({ children }: { children: ReactNode }) {
  return children;
}
