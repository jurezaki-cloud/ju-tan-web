import { activityRepository } from "@/src/repositories/ActivityRepository";
import { err, ok, type Result } from "@/src/types/platform";
import type { Activity } from "@/src/domain/crm";
import type { ActivityWrite, CrmListResult, CrmQueryParams } from "@/src/types/crm";
import { recordCrmAudit } from "./crmAudit";
import { systemCrmAccess, type CrmAccess } from "./crmAccess";
import { nextCrmId, stampCrm } from "./crmStamp";

export class ActivityService {
  list(params: CrmQueryParams = {}, access: CrmAccess = systemCrmAccess): Result<CrmListResult<Activity>> {
    if (!access.read) return err("Ni dovoljenja za branje CRM.");
    try {
      return ok(activityRepository.list(params));
    } catch {
      return err("Aktivnosti ni bilo mogoče naložiti.");
    }
  }

  getByClientId(clientId: string): Result<Activity[]> {
    return ok(activityRepository.getByClientId(clientId));
  }

  timeline(clientId: string): Result<Activity[]> {
    return ok(activityRepository.getTimelineByClientId(clientId));
  }

  create(input: ActivityWrite, access: CrmAccess = systemCrmAccess): Result<Activity> {
    if (!access.write) return err("Ni dovoljenja za zapis v CRM.");
    const subject = input.subject?.trim() || input.name?.trim() || input.text?.trim();
    if (!subject) return err("Zadeva aktivnosti je obvezna.");
    const item = stampCrm<Activity>(nextCrmId("act", activityRepository.count()), input.status ?? "open", {
      name: subject,
      company: "",
      source: "manual",
      owner: "",
      type: input.type ?? "call",
      kind: input.type ?? "call",
      subject,
      text: input.text ?? subject,
      clientId: input.clientId,
      leadId: input.leadId,
      opportunityId: input.opportunityId,
      dueAt: input.dueAt,
      completedAt: input.completedAt,
    });
    activityRepository.create(item);
    recordCrmAudit("ActivityCreated", { id: item.id, clientId: item.clientId });
    return ok(item);
  }

  complete(id: string, access: CrmAccess = systemCrmAccess): Result<Activity> {
    if (!access.write) return err("Ni dovoljenja za zapis v CRM.");
    const current = activityRepository.getById(id);
    if (!current) return err("Aktivnost ne obstaja.");
    const next = {
      ...current,
      status: "done",
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: (current.version ?? 1) + 1,
    };
    return ok(activityRepository.update(next));
  }

  archive(id: string, access: CrmAccess = systemCrmAccess): Result<boolean> {
    if (!access.archive) return err("Ni dovoljenja za arhiviranje.");
    const done = activityRepository.archive(id);
    if (done) recordCrmAudit("RecordArchived", { id, type: "activity" });
    return ok(done);
  }

  restore(id: string, access: CrmAccess = systemCrmAccess): Result<Activity> {
    if (!access.archive) return err("Ni dovoljenja za obnovitev.");
    const item = activityRepository.restore(id);
    if (!item) return err("Aktivnosti ni bilo mogoče obnoviti.");
    recordCrmAudit("RecordRestored", { id, type: "activity" });
    return ok(item);
  }
}

export const activityService = new ActivityService();
