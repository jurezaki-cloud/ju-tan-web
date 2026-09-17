import type { Metadata } from "next";
import type { ReactNode } from "react";
import { assertPlatformEnabled } from "@/lib/marketing-surface";

export const metadata: Metadata = {
  title: "Prijava",
  robots: { index: false, follow: false },
};

export default function IdentityLayout({ children }: { children: ReactNode }) {
  assertPlatformEnabled();
  return children;
}
