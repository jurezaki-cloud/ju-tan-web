"use client";

import type { ReactNode } from "react";
import type { Permission } from "@/src/config/permissions";
import { useAuth } from "./AuthContext";
import ErrorState from "@/components/platform/ErrorState";

export default function PermissionGuard({
  permission,
  children,
}: {
  permission: Permission;
  children: ReactNode;
}) {
  const { can } = useAuth();
  if (!can(permission)) {
    return (
      <ErrorState
        title="Ni dovoljenja"
        description="Za ta modul nimate pravice."
      />
    );
  }
  return children;
}
