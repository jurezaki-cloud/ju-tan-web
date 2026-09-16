export function splitSql(sql: string): string[] {
  return sql
    .split(/;\s*(?:\n|$)/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && !item.startsWith("--"));
}
