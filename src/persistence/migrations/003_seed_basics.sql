-- Seed ledger (data applied by seed runner, not inline literals)

CREATE TABLE IF NOT EXISTS schema_seeds (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_schema_seeds_applied_at ON schema_seeds (applied_at);
