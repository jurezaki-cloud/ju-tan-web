export class ForwardedForParser {
  parse(header: string | null | undefined): string[] {
    if (!header) return [];
    if (header.length > 1024) return [];
    return header
      .split(",")
      .map((part) => this.normalize(part))
      .filter((part): part is string => Boolean(part));
  }

  normalize(value: string): string | undefined {
    const trimmed = value.trim().replace(/^"|"$/g, "");
    if (!trimmed || trimmed.length > 64) return undefined;
    if (/[<>'"\\]/.test(trimmed)) return undefined;
    const withoutPort = trimmed.replace(/^\[([^\]]+)\](?::\d+)?$/, "$1").replace(/^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/, "$1");
    if (withoutPort.toLowerCase() === "unknown") return undefined;
    if (!this.valid(withoutPort)) return undefined;
    return withoutPort;
  }

  valid(ip: string) {
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
      return ip.split(".").every((octet) => {
        const n = Number(octet);
        return n >= 0 && n <= 255 && String(n) === octet;
      });
    }
    if (ip === "::1" || ip === "::ffff:127.0.0.1") return true;
    if (ip.includes(":")) {
      return /^[0-9a-fA-F:]+$/.test(ip) && ip.includes(":");
    }
    return false;
  }
}

export const forwardedForParser = new ForwardedForParser();
