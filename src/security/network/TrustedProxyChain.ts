import { forwardedForParser } from "./ForwardedForParser";
import { proxyTrustPolicy, type ProxyTrustPolicy } from "./ProxyTrustPolicy";

export class TrustedProxyChain {
  constructor(
    private readonly parser = forwardedForParser,
    private readonly policy: ProxyTrustPolicy = proxyTrustPolicy,
  ) {}

  clientFrom(hops: string[]): string | undefined {
    if (!hops.length) return undefined;
    for (let index = hops.length - 1; index >= 0; index -= 1) {
      const hop = hops[index];
      if (!this.policy.trusts(hop)) return hop;
    }
    return hops[0];
  }

  parseHeader(header: string | null | undefined) {
    return this.parser.parse(header);
  }
}

export const trustedProxyChain = new TrustedProxyChain();
