import { Permission } from "@/src/config/permissions";
import type { Role } from "@/src/config/roles";
import { hasPermission } from "@/src/config/permissions";
import type { NotificationChannel } from "@/src/types/integrations";

export class IntegrationPolicy {
  canReadCrm(role?: Role): boolean {
    if (!role) return true;
    return hasPermission(role, Permission.CRM) || hasPermission(role, Permission.CRMRead) || hasPermission(role, Permission.Clients);
  }

  canReadDocuments(role?: Role): boolean {
    if (!role) return true;
    return hasPermission(role, Permission.Documents) || hasPermission(role, Permission.Portal) || hasPermission(role, Permission.AI);
  }

  canWrite(role?: Role): boolean {
    if (!role) return false;
    return hasPermission(role, Permission.All) || hasPermission(role, Permission.Settings) || hasPermission(role, Permission.CRM);
  }

  canLink(role?: Role): boolean {
    if (!role) return true;
    return this.canReadCrm(role) || this.canReadDocuments(role) || hasPermission(role, Permission.AI);
  }

  canSummarize(role?: Role): boolean {
    if (!role) return true;
    return this.canReadDocuments(role) || hasPermission(role, Permission.AI);
  }

  canWriteSensitive(role?: Role): boolean {
    if (!role) return false;
    return hasPermission(role, Permission.All) || hasPermission(role, Permission.Settings);
  }

  allowFileDelete(): boolean {
    return false;
  }

  allowDocumentDelete(): boolean {
    return false;
  }

  notificationRequiresApproval(channel: NotificationChannel): boolean {
    return channel === "email" || channel === "webhook" || channel === "slack" || channel === "teams";
  }
}

export class ReadPolicy {
  constructor(private readonly policy: IntegrationPolicy) {}
  crm(role?: Role) {
    return this.policy.canReadCrm(role);
  }
  documents(role?: Role) {
    return this.policy.canReadDocuments(role);
  }
}

export class WritePolicy {
  constructor(private readonly policy: IntegrationPolicy) {}
  allow(role?: Role) {
    return this.policy.canWrite(role);
  }
  sensitive(role?: Role) {
    return this.policy.canWriteSensitive(role);
  }
}

export class LinkPolicy {
  constructor(private readonly policy: IntegrationPolicy) {}
  allow(role?: Role) {
    return this.policy.canLink(role);
  }
}

export class SummaryPolicy {
  constructor(private readonly policy: IntegrationPolicy) {}
  allow(role?: Role) {
    return this.policy.canSummarize(role);
  }
}
