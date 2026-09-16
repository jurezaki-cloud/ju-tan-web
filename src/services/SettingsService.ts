import { appPersistence } from "@/src/persistence/app";
import { userRepository } from "@/src/repositories/UserRepository";
import { store } from "@/src/repositories/mock/store";
import { company } from "@/lib/data/company";
import { err, ok, type Result } from "@/src/types/platform";
import type { User } from "@/src/domain/user";
import type {
  ApiKeyRecord,
  DashboardSummary,
  IntegrationRecord,
  OrganizationSettings,
} from "@/src/types/platform";

export class SettingsService {
  listUsers(): Result<User[]> {
    try {
      return ok(userRepository.list());
    } catch {
      return err("Uporabnikov ni bilo mogoče naložiti.");
    }
  }

  getOrganization(): Result<OrganizationSettings> {
    return ok({
      name: company.name,
      address: `${company.contact.address.street}, ${company.contact.address.postal}`,
    });
  }

  listApiKeys(): Result<ApiKeyRecord[]> {
    return ok(store.apiKeys);
  }

  listIntegrations(): Result<IntegrationRecord[]> {
    return ok(store.integrations);
  }

  getDashboard(): Result<DashboardSummary> {
    try {
      return ok(appPersistence.queries.dashboardStats());
    } catch {
      return err("Pregleda ni bilo mogoče naložiti.");
    }
  }
}

export const settingsService = new SettingsService();
