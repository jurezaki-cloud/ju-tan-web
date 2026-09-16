const DEV_SECRET = "ju-tan-dev-identity-hmac-secret-key!!";

export function getIdentityTokenSecret(): string | undefined {
  const secret = process.env.IDENTITY_TOKEN_SECRET?.trim();
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === "production") return undefined;
  return DEV_SECRET;
}
