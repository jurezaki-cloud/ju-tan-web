import type { Task } from "@/src/domain/crm";
import { appPersistence } from "@/src/persistence/app";
import { CrmRepository } from "./crm/CrmRepository";

export class TaskRepository extends CrmRepository<Task> {
  constructor() {
    super("tasks", appPersistence.repositories.tasks);
  }
}

export const taskRepository = new TaskRepository();
