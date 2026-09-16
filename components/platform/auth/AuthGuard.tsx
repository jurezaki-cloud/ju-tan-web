"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { permissionForPath } from "@/src/config/navigation";
import { useAuth } from "./AuthContext";
import PageLoader from "@/components/platform/PageLoader";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, can, loading } = useAuth();
  const permission = permissionForPath(pathname);
  const allowed = !permission || can(permission);

  useEffect(() => {
    if (loading) return;
    if (!session.authenticated || !session.user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!allowed) {
      router.replace("/access-denied");
    }
  }, [loading, session, router, pathname, allowed]);

  if (loading || !session.authenticated || !session.user || !allowed) {
    return <PageLoader />;
  }

  return children;
}
