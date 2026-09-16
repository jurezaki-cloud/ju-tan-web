import type { SeedContext, SeedStatus, TenantScope } from "@/src/types/persistence";
import { InMemoryTables } from "../db/InMemoryTables";
import { PersistenceEvents, PersistenceTracer } from "../observability";
import { SeedRunner } from "./index";
import { SeedRegistry } from "./seed-registry";
import { applySeedSteps } from "./seed-steps";
import { defaultTenant } from "../entities";

export class PersistenceSeedRunner {
  constructor(
    private readonly tables: InMemoryTables,
    private readonly scope: TenantScope = defaultTenant,
    private readonly inner = new SeedRunner(tables, scope),
    private readonly registry = new SeedRegistry(),
    private readonly tracer = new PersistenceTracer(),
    private readonly events = new PersistenceEvents(),
  ) {}

  run(context: SeedContext = { tenant: this.scope, now: () => new Date() }): SeedStatus[] {
    return this.tracer.measure("seed", undefined, () => {
      this.inner.run(context);
      applySeedSteps(this.tables, context.tenant, this.registry);
      this.events.emit("audit", "seed-applied", { tenant: context.tenant.tenantId });
      return this.registry.status();
    });
  }

  status(): SeedStatus[] {
    return this.registry.status();
  }
}
