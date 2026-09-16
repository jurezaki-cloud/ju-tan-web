export class ProxyTrustPolicy {
  constructor(
    readonly enabled = process.env.JU_TAN_TRUST_PROXY === "1",
    readonly proxies = (process.env.JU_TAN_TRUSTED_PROXIES ?? "127.0.0.1,::1,::ffff:127.0.0.1")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  ) {}

  trusts(ip: string) {
    return this.proxies.includes(ip);
  }
}

export const proxyTrustPolicy = new ProxyTrustPolicy();
