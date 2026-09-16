import type { Project } from "@/src/domain/project";
import { appPersistence } from "@/src/persistence/app";
import type { RepositoryAdapter } from "@/src/types/persistence";

export class ProjectRepository {
  constructor(private readonly records: RepositoryAdapter<Project> = appPersistence.repositories.projects) {}

  list(): Project[] {
    return this.records.list();
  }

  getById(id: string): Project | undefined {
    return this.records.getById(id);
  }

  listByClient(clientId: string): Project[] {
    return this.list().filter((item) => item.clientId === clientId);
  }

  update(id: string, patch: Partial<Project>): Project | undefined {
    const current = this.getById(id);
    if (!current) return undefined;
    return this.records.save({ ...current, ...patch, id });
  }
}

export const projectRepository = new ProjectRepository();
