import type { PostgresClientHandle, PostgresQueryResult, PostgresTransaction, SqlParam } from "@/src/types/postgres";
import type { PostgresConnectionConfig } from "@/src/types/persistence";
import type { CompatiblePostgresDriver } from "./driver";
import { PostgresClient } from "./client";
import type { CachedProbe, LiveQueryHandle } from "./types";
import { PersistenceEvents } from "../observability";

export class ManagedPostgresClientHandle implements PostgresClientHandle {
  private connected = false;
  private pingCache?: CachedProbe;

  constructor(
    private readonly driver: CompatiblePostgresDriver,
    private readonly config: PostgresConnectionConfig,
    private readonly nativeClient?: PostgresClient,
    private readonly events = new PersistenceEvents(),
    private readonly pingTtlMs = 1000,
  ) {}

  get live(): boolean {
    return Boolean(this.nativeClient?.live);
  }

  get kind(): "live" | "compatible" {
    return this.nativeClient?.live ? "live" : "compatible";
  }

  async connect(): Promise<void> {
    const started = Date.now();
    await this.driver.connect();
    this.connected = true;
    this.events.emit("metrics", "connection", { kind: this.kind }, Date.now() - started);
  }

  async disconnect(): Promise<void> {
    await this.driver.disconnect();
    this.connected = false;
  }

  async ping(): Promise<boolean> {
    const now = Date.now();
    if (this.pingCache && now - this.pingCache.at < this.pingTtlMs) {
      return this.pingCache.value;
    }
    const started = Date.now();
    const ok = this.kind === "live" ? await this.driver.ping() : this.connected || true;
    this.pingCache = { at: Date.now(), value: ok, latencyMs: Date.now() - started };
    this.events.emit("metrics", "ping", { ok, kind: this.kind }, this.pingCache.latencyMs);
    return ok;
  }

  async query(text: string, params: SqlParam[] = []): Promise<PostgresQueryResult> {
    const started = Date.now();
    const result = await this.driver.execute(text, params);
    this.events.emit("metrics", "query", { kind: this.kind }, Date.now() - started);
    return result;
  }

  async command(text: string, params: SqlParam[] = []): Promise<PostgresQueryResult> {
    if (this.config.readOnly) {
      return { rows: [], rowCount: 0, durationMs: 0 };
    }
    const started = Date.now();
    const result = await this.driver.execute(text, params);
    this.events.emit("metrics", "command", { kind: this.kind }, Date.now() - started);
    return result;
  }

  async transaction<T>(fn: (tx: PostgresTransaction) => Promise<T>): Promise<T> {
    return this.driver.transaction(fn);
  }
}

export function createPostgresClientHandle(
  driver: CompatiblePostgresDriver,
  config: PostgresConnectionConfig,
  nativeClient?: PostgresClient,
  events?: PersistenceEvents,
): PostgresClientHandle {
  return new ManagedPostgresClientHandle(driver, config, nativeClient, events);
}

export function createMockCompatibleHandle(
  driver: CompatiblePostgresDriver,
  config: PostgresConnectionConfig,
  events?: PersistenceEvents,
): PostgresClientHandle {
  return createPostgresClientHandle(driver, { ...config, mode: "mock" }, undefined, events);
}

export function liveHandleFromClient(client: PostgresClient): LiveQueryHandle | undefined {
  if (!client.live) return undefined;
  return {
    query: (text, params) => client.execute(text, params ?? []),
    connect: () => client.connect(),
    end: () => client.disconnect(),
  };
}
