-- Apply ONLY to the approved empty contact test database. Never run at build/start.
-- Separate from the legacy site_inquiry_daily counter and Office schema.
CREATE TABLE IF NOT EXISTS contact_inbox_confirmed (
  intent_id TEXT PRIMARY KEY CHECK (intent_id ~ '^[a-f0-9]{64}$'),
  receipt_id TEXT NOT NULL CHECK (length(trim(receipt_id)) > 0),
  accepted_day DATE NOT NULL,
  service TEXT NOT NULL
);
CREATE OR REPLACE VIEW contact_inbox_daily AS
SELECT accepted_day AS day, service, count(*)::bigint AS confirmed
FROM contact_inbox_confirmed GROUP BY accepted_day, service;
