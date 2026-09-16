export const IDENTITY_COOKIE_ACCESS = "jt_access";
export const IDENTITY_COOKIE_REFRESH = "jt_refresh";

export const identityConfig = {
  accessTtlMs: 8 * 60 * 60 * 1000,
  refreshTtlMs: 14 * 24 * 60 * 60 * 1000,
  rememberTtlMs: 30 * 24 * 60 * 60 * 1000,
  demoPassword: "demo",
  passwordHashPrefix: "mock:",
  maxLoginAttempts: 8,
};

export const identityHome: Record<string, string> = {
  OWNER: "/dashboard",
  ADMIN: "/dashboard",
  MANAGER: "/dashboard",
  EMPLOYEE: "/dashboard",
  CLIENT: "/portal",
};
