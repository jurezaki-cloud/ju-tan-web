export type {
  DbColumn,
  DbRow,
  DbTable,
  PostgresClientHandle,
  PostgresDriver,
  PostgresQueryResult,
  PostgresTransaction,
  QuerySpec,
  SqlParam,
  SqlStatement,
} from "@/src/types/postgres";

export type LiveQueryHandle = {
  query(text: string, params?: import("@/src/types/postgres").SqlParam[]): Promise<{
    rows: Record<string, unknown>[];
    rowCount?: number;
  }>;
  connect?(): Promise<void>;
  end?(): Promise<void>;
};

export type CachedProbe = {
  at: number;
  value: boolean;
  latencyMs: number;
};
