import type { Metadata } from "next";
import type { ReactNode } from "react";
import PlatformShell from "@/components/platform/PlatformShell";
import { readAccessToken } from "@/src/identity/adapters/cookies";
import { getIdentity } from "@/src/identity";
import { AuthError } from "@/src/identity/errors";

export const metadata: Metadata = {
  title: "Platforma",
  robots: { index: false, follow: false },
};

export default async function PlatformLayout({ children }: { children: ReactNode }) {
  const token = await readAccessToken();
  let initialUser = null;
  if (token) {
    try {
      initialUser = getIdentity().controller.session(token).user;
    } catch (error) {
      if (!(error instanceof AuthError)) throw error;
    }
  }

  return <PlatformShell initialUser={initialUser}>{children}</PlatformShell>;
}
