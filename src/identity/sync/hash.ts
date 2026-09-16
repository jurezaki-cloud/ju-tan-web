export function hashIdentitySecret(value: string) {
  let hash = 2166136261;
  for (const byte of new TextEncoder().encode(value)) {
    hash ^= byte;
    hash = Math.imul(hash, 16777619);
  }
  return `idt:${(hash >>> 0).toString(16)}:${value.length}`;
}
