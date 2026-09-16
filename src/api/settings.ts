import { settingsService } from "@/src/services/SettingsService";
import type { User } from "@/src/domain/user";
import type {
  ApiKeyRecord,
  DashboardSummary,
  IntegrationRecord,
  OrganizationSettings,
  Result,
} from "@/src/types/platform";

export async function getDashboard(): Promise<Result<DashboardSummary>> {
  return settingsService.getDashboard();
}

export async function getUsers(): Promise<Result<User[]>> {
  return settingsService.listUsers();
}

export async function getOrganization(): Promise<Result<OrganizationSettings>> {
  return settingsService.getOrganization();
}

export async function getApiKeys(): Promise<Result<ApiKeyRecord[]>> {
  return settingsService.listApiKeys();
}

export async function getIntegrations(): Promise<Result<IntegrationRecord[]>> {
  return settingsService.listIntegrations();
}
