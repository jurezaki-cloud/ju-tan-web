import { projectRepository } from "@/src/repositories/ProjectRepository";
import { err, ok, type Result } from "@/src/types/platform";
import type { Project } from "@/src/domain/project";

export class ProjectService {
  list(): Result<Project[]> {
    try {
      return ok(projectRepository.list());
    } catch {
      return err("Projektov ni bilo mogoče naložiti.");
    }
  }

  listByClient(clientId: string): Result<Project[]> {
    try {
      return ok(projectRepository.listByClient(clientId));
    } catch {
      return err("Projektov stranke ni bilo mogoče naložiti.");
    }
  }

  updateProject(id: string, patch: Partial<Project>): Result<Project> {
    const updated = projectRepository.update(id, patch);
    if (!updated) return err("Projekt ne obstaja.");
    return ok(updated);
  }
}

export const projectService = new ProjectService();
