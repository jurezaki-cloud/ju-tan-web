import type { ReactNode } from "react";
import AuthGuard from "@/components/platform/auth/AuthGuard";
import PermissionGuard from "@/components/platform/auth/PermissionGuard";
import RoleGuard from "@/components/platform/auth/RoleGuard";
import { Permission } from "@/src/config/permissions";
import { Role } from "@/src/config/roles";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <RoleGuard roles={[Role.OWNER, Role.ADMIN, Role.MANAGER]}>
        <PermissionGuard permission={Permission.UsersRead}>{children}</PermissionGuard>
      </RoleGuard>
    </AuthGuard>
  );
}
