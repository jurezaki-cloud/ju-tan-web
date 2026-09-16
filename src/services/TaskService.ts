import { taskRepository } from "@/src/repositories/TaskRepository";
import { err, ok, type Result } from "@/src/types/platform";
import type { Task } from "@/src/domain/crm";
import type { CrmListResult, CrmQueryParams, TaskWrite } from "@/src/types/crm";
import { recordCrmAudit } from "./crmAudit";
import { systemCrmAccess, type CrmAccess } from "./crmAccess";
import { nextCrmId, stampCrm } from "./crmStamp";

export class TaskService {
  list(params: CrmQueryParams = {}, access: CrmAccess = systemCrmAccess): Result<CrmListResult<Task>> {
    if (!access.read) return err("Ni dovoljenja za branje CRM.");
    try {
      return ok(taskRepository.list(params));
    } catch {
      return err("Nalog ni bilo mogoče naložiti.");
    }
  }

  getById(id: string, access: CrmAccess = systemCrmAccess): Result<Task> {
    if (!access.read) return err("Ni dovoljenja za branje CRM.");
    const item = taskRepository.getById(id);
    if (!item) return err("Naloga ne obstaja.");
    return ok(item);
  }

  getByClientId(clientId: string): Result<Task[]> {
    return ok(taskRepository.getByClientId(clientId));
  }

  create(input: TaskWrite, access: CrmAccess = systemCrmAccess): Result<Task> {
    if (!access.write) return err("Ni dovoljenja za zapis v CRM.");
    if (!input.name.trim()) return err("Ime naloge je obvezno.");
    const item = stampCrm<Task>(nextCrmId("tk", taskRepository.count()), input.status ?? "open", {
      name: input.name.trim(),
      company: "",
      source: "manual",
      owner: input.assigneeId ?? "",
      priority: input.priority ?? "Srednja",
      dueAt: input.dueAt,
      due: input.dueAt,
      assigneeId: input.assigneeId,
      clientId: input.clientId,
      leadId: input.leadId,
      opportunityId: input.opportunityId,
    });
    taskRepository.create(item);
    recordCrmAudit("TaskCreated", { id: item.id, clientId: item.clientId });
    return ok(item);
  }

  update(id: string, input: Partial<TaskWrite>, access: CrmAccess = systemCrmAccess): Result<Task> {
    if (!access.write) return err("Ni dovoljenja za zapis v CRM.");
    const current = taskRepository.getById(id);
    if (!current) return err("Naloga ne obstaja.");
    const next = { ...current, ...input, due: input.dueAt ?? current.due, updatedAt: new Date().toISOString(), version: (current.version ?? 1) + 1 };
    return ok(taskRepository.update(next));
  }

  archive(id: string, access: CrmAccess = systemCrmAccess): Result<boolean> {
    if (!access.archive) return err("Ni dovoljenja za arhiviranje.");
    const done = taskRepository.archive(id);
    if (done) recordCrmAudit("RecordArchived", { id, type: "task" });
    return ok(done);
  }

  restore(id: string, access: CrmAccess = systemCrmAccess): Result<Task> {
    if (!access.archive) return err("Ni dovoljenja za obnovitev.");
    const item = taskRepository.restore(id);
    if (!item) return err("Naloge ni bilo mogoče obnoviti.");
    recordCrmAudit("RecordRestored", { id, type: "task" });
    return ok(item);
  }
}

export const taskService = new TaskService();
