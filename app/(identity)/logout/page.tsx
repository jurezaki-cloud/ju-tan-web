"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import IdentityFrame from "@/components/identity/IdentityFrame";
import PageLoader from "@/components/platform/PageLoader";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    void fetch("/api/identity/logout", { method: "POST" }).finally(() => {
      router.replace("/login");
      router.refresh();
    });
  }, [router]);

  return (
    <IdentityFrame title="Odjava">
      <PageLoader />
    </IdentityFrame>
  );
}
