import type { QueryOptions, RepositoryAdapter } from "@/src/types/persistence";
import { appPersistence } from "@/src/persistence/app";
import type { NotificationDelivery, NotificationRetry, NotificationTemplate } from "@/src/types/notifications";
import { TEMPLATES } from "@/src/notifications/templates/NotificationTemplateRenderer";
import { defaultTenant } from "@/src/persistence/entities";

class TypedStore<T extends { id: string; status: string }> {
  constructor(private readonly records: RepositoryAdapter<{ id: string; status: string }>) {}

  list(options?: QueryOptions): T[] {
    return this.records.list({ ...options, includeDeleted: options?.includeDeleted }) as T[];
  }

  search(query: string): T[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.list();
    return this.list({ includeDeleted: true }).filter((item) => JSON.stringify(item).toLowerCase().includes(q));
  }

  getById(id: string, includeDeleted = false): T | undefined {
    if (!includeDeleted) return this.records.getById(id) as T | undefined;
    return this.list({ includeDeleted: true }).find((item) => item.id === id);
  }

  save(entity: T): T {
    this.records.save(entity);
    return entity;
  }

  update(entity: T): T {
    return this.save(entity);
  }

  archive(id: string): boolean {
    return this.records.archive(id);
  }

  restore(id: string): T | undefined {
    const item = this.getById(id, true);
    if (!item) return undefined;
    const next = { ...item, deletedAt: null } as T;
    this.records.save(next);
    return next;
  }

  increment(id: string, field: keyof T, amount = 1): T | undefined {
    const item = this.getById(id, true);
    if (!item) return undefined;
    const current = item[field];
    const nextValue = typeof current === "number" ? ((current + amount) as T[keyof T]) : current;
    const next = { ...item, [field]: nextValue, updatedAt: new Date().toISOString() } as T;
    this.records.save(next);
    return next;
  }
}

export class NotificationDeliveryRepository extends TypedStore<NotificationDelivery> {
  constructor() {
    super(appPersistence.repositories.notificationDeliveries);
  }

  listByInvite(inviteId: string): NotificationDelivery[] {
    return this.list({ includeDeleted: true }).filter((item) => item.inviteId === inviteId);
  }
}

export class NotificationRepository extends NotificationDeliveryRepository {}

export class NotificationTemplateRepository extends TypedStore<NotificationTemplate> {
  constructor() {
    super(appPersistence.repositories.notificationTemplates);
  }

  ensureDefaults() {
    const tenant = appPersistence.tenant ?? defaultTenant;
    const stamp = new Date().toISOString();
    for (const [templateId, template] of Object.entries(TEMPLATES)) {
      const id = `tpl-${templateId}`;
      if (this.getById(id, true)) continue;
      this.save({
        id,
        createdAt: stamp,
        updatedAt: stamp,
        status: "active",
        metadata: {},
        tenantId: tenant.tenantId,
        organizationId: tenant.organizationId,
        workspaceId: tenant.workspaceId ?? "ws-demo",
        ownerId: "system",
        deletedAt: null,
        version: 1,
        templateId: templateId as NotificationTemplate["templateId"],
        locale: "sl",
        subject: template.subject,
        text: template.text,
        html: template.html,
        variables: template.variables,
      });
    }
  }
}

export class NotificationRetryRepository extends TypedStore<NotificationRetry> {
  constructor() {
    super(appPersistence.repositories.notificationRetries);
  }

  listByDelivery(deliveryId: string): NotificationRetry[] {
    return this.list({ includeDeleted: true }).filter((item) => item.deliveryId === deliveryId);
  }
}

export const notificationDeliveryRepository = new NotificationDeliveryRepository();
export const notificationRepository = notificationDeliveryRepository;
export const notificationTemplateRepository = new NotificationTemplateRepository();
export const notificationRetryRepository = new NotificationRetryRepository();
