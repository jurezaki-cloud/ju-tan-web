-- REVIEW ONLY: never invoked by runtime/build; production requires approval.
CREATE TABLE IF NOT EXISTS contact_delivery_attempts (
  retry_key TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  counted BOOLEAN NOT NULL DEFAULT false,
  cancelled BOOLEAN NOT NULL DEFAULT false,
  receipt_id TEXT
);
-- Additive upgrade for an earlier approved P0 schema, preserving tombstones.
ALTER TABLE contact_delivery_attempts ADD COLUMN IF NOT EXISTS cancelled BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE contact_delivery_attempts ADD COLUMN IF NOT EXISTS receipt_id TEXT;
CREATE TABLE IF NOT EXISTS site_inquiry_daily (
  day DATE NOT NULL,
  service TEXT NOT NULL,
  confirmed BIGINT NOT NULL DEFAULT 0 CHECK (confirmed >= 0),
  PRIMARY KEY (day, service)
);
-- No form data, hashes, IPs or contact details. receipt_id is provider metadata.
-- Do not DROP, TRUNCATE, expire or automatically delete retry tombstones.
