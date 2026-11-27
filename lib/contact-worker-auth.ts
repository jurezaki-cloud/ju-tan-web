import { timingSafeEqual } from "node:crypto";
export function authorizeContactWorker(req: Request, secret: string | undefined) {
  if (!secret || Buffer.byteLength(secret) < 32) return false;
  const actual = Buffer.from(req.headers.get("authorization") || "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
