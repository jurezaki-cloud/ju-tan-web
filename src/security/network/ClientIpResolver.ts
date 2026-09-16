import type { ClientIpResolution } from "@/src/types/security";
import { forwardedForParser } from "./ForwardedForParser";
import { trustedProxyChain, type TrustedProxyChain } from "./TrustedProxyChain";
import { realIpResolver } from "./RealIpResolver";
import { proxyTrustPolicy, type ProxyTrustPolicy } from "./ProxyTrustPolicy";

const FALLBACK = "0.0.0.0";

export class ClientIpResolver {
  constructor(
    private readonly chain: TrustedProxyChain = trustedProxyChain,
    private readonly policy: ProxyTrustPolicy = proxyTrustPolicy,
  ) {}

  resolve(
    request: {
      headers: { get(name: string): string | null };
    },
    remoteAddress?: string,
  ): ClientIpResolution {
    try {
      const forwarded = request.headers.get("x-forwarded-for");
      const real = request.headers.get("x-real-ip");
      const hops = this.chain.parseHeader(forwarded);
      const remote = forwardedForParser.normalize(remoteAddress ?? "") ?? FALLBACK;

      if (forwarded && hops.length === 0) {
        return { ip: remote, trusted: false, anomalous: true, hopCount: 0, source: "fallback" };
      }

      if (this.policy.enabled && hops.length) {
        const client = this.chain.clientFrom(hops) ?? remote;
        return {
          ip: client,
          trusted: true,
          anomalous: hops.length > 8,
          hopCount: hops.length,
          source: "forwarded",
        };
      }

      if (this.policy.enabled && real) {
        const parsed = realIpResolver.fromHeader(real);
        if (!parsed) return { ip: remote, trusted: false, anomalous: true, hopCount: 0, source: "fallback" };
        return { ip: parsed, trusted: true, anomalous: false, hopCount: 1, source: "real-ip" };
      }

      if (!this.policy.enabled && (forwarded || real)) {
        return { ip: remote, trusted: false, anomalous: Boolean(forwarded || real), hopCount: hops.length, source: "remote" };
      }

      return { ip: remote, trusted: false, anomalous: false, hopCount: 0, source: remote === FALLBACK ? "fallback" : "remote" };
    } catch {
      return { ip: FALLBACK, trusted: false, anomalous: true, hopCount: 0, source: "fallback" };
    }
  }
}

export const clientIpResolver = new ClientIpResolver();
