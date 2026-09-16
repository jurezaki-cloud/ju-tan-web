import type { Role } from "@/src/config/roles";
import { Permission } from "@/src/config/permissions";
import { hasPermission } from "@/src/config/permissions";

export class ContextPolicy {
  allow(role: Role | undefined, permission: Permission): boolean {
    if (!role) return false;
    return hasPermission(role, permission);
  }
}

export class ContextMergeStrategy {
  merge(parts: string[]): string {
    return parts.filter((item) => item.trim().length > 0).join("\n\n");
  }
}

export class ContextResolver {
  pick<T>(value: T | undefined, fallback: T): T {
    return value ?? fallback;
  }
}
