export const SEED_STEPS = [
  "organization",
  "workspace",
  "admin-user",
  "demo-client",
  "demo-lead",
  "demo-project",
  "demo-document",
  "demo-artifact",
  "demo-conversation",
  "demo-audit",
  "demo-session",
  "demo-feature-flags",
] as const;

export type SeedStepId = (typeof SEED_STEPS)[number];

export const SEED_IDS = {
  organization: "org-ju-tan",
  workspace: "ws-demo",
  adminUser: "u-01",
  client: "cli-demo",
  lead: "lead-demo",
  project: "prj-demo",
  document: "doc-demo",
  artifact: "art-demo",
  conversation: "convo-demo",
  audit: "aud-seed",
  session: "ses-demo",
  featureFlag: "ff-demo-workspace",
} as const;

export const SEED_FEATURE_FLAGS = [
  { id: "ff-demo-workspace", key: "workspace.demo", enabled: true },
  { id: "ff-persistence-postgres", key: "persistence.postgres", enabled: false },
] as const;
