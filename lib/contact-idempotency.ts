/** Validate only the opaque key syntax. Client clocks are not trusted clocks.
 * Lifetime and deterministic mail timestamps come from the durable server row.
 */
export function contactRetryKey(raw: string | null): { key: string } | false {
  if (!raw || !/^(\d{13})\.([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i.test(raw)) return false;
  return { key: `contact/${raw}` };
}
