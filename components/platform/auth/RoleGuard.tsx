"use client";

import type { ReactNode } from "react";
import type { Role } from "@/src/config/roles";
import { useAuth } from "./AuthContext";
import ErrorState from "@/components/platform/ErrorState";

export default function RoleGuard({
  roles,
  children,
}: {
  roles: Role[];
  children: ReactNode;
}) {
  const { session } = useAuth();
  const role = session.user?.role;
  if (!role || !roles.includes(role)) {
    return (
      <ErrorState title="Ni vloge" description="Vloga nima dostopa do tega pogleda." />
    );
  }
  return children;
}
