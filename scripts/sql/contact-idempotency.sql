-- Review and apply ONLY to an approved environment before deploying this code.
-- This file is not automatically executed by production requests or builds.
CREATE TABLE IF NOT EXISTS contact_delivery_attempts (
  retry_key TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  counted BOOLEAN NOT NULL DEFAULT false
);
CREATE TABLE IF NOT EXISTS site_inquiry_daily (
  day DATE NOT NULL,
  service TEXT NOT NULL,
  confirmed BIGINT NOT NULL DEFAULT 0 CHECK (confirmed >= 0),
  PRIMARY KEY (day, service)
);
-- Expired keys are tombstones: do NOT delete or expire them automatically.
-- Removing a tombstone would let an old retry send mail again after Resend's
-- 24-hour retention. Retention/archival needs a separately reviewed design.
