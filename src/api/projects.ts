import { projectService } from "@/src/services/ProjectService";
import type { Project } from "@/src/domain/project";
import type { Result } from "@/src/types/platform";

export async function getProjects(): Promise<Result<Project[]>> {
  return projectService.list();
}

export async function getProjectsByClient(clientId: string): Promise<Result<Project[]>> {
  return projectService.listByClient(clientId);
}

export async function updateProject(
  id: string,
  patch: Partial<Project>,
): Promise<Result<Project>> {
  return projectService.updateProject(id, patch);
}
