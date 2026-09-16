import type { Activity } from "@/src/domain/crm";
import { appPersistence } from "@/src/persistence/app";
import { CrmRepository } from "./crm/CrmRepository";

export class ActivityRepository extends CrmRepository<Activity> {
  constructor() {
    super("activities", appPersistence.repositories.activities);
  }

  getTimelineByClientId(clientId: string): Activity[] {
    return this.getByClientId(clientId).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
}

export const activityRepository = new ActivityRepository();
