import { forwardedForParser } from "./ForwardedForParser";
import { TrustedProxyChain } from "./TrustedProxyChain";
import { ProxyTrustPolicy } from "./ProxyTrustPolicy";
import { ClientIpResolver } from "./ClientIpResolver";

function headers(init: Record<string, string>) {
  return {
    get(name: string) {
      return init[name.toLowerCase()] ?? null;
    },
  };
}

export function assertProxyIpHardening(): void {
  const hops = forwardedForParser.parse("203.0.113.10, 127.0.0.1");
  if (hops[0] !== "203.0.113.10" || hops[1] !== "127.0.0.1") throw new Error("xff parse");
  if (forwardedForParser.parse("<script>").length) throw new Error("xss header");
  if (forwardedForParser.parse("unknown, not-an-ip").length) throw new Error("junk header");
  if (!forwardedForParser.valid("::1")) throw new Error("loopback v6");

  const chain = new TrustedProxyChain(forwardedForParser, new ProxyTrustPolicy(true, ["127.0.0.1", "::1"]));
  if (chain.clientFrom(["203.0.113.50", "127.0.0.1"]) !== "203.0.113.50") throw new Error("trusted chain");

  const resolver = new ClientIpResolver(new TrustedProxyChain(forwardedForParser, new ProxyTrustPolicy(false, [])), new ProxyTrustPolicy(false, []));
  const untrusted = resolver.resolve({ headers: headers({ "x-forwarded-for": "198.51.100.9" }) }, "10.0.0.8");
  if (untrusted.ip !== "10.0.0.8") throw new Error("untrusted fallback");
  if (!untrusted.anomalous) throw new Error("spoofed header should be anomalous");

  const trustedResolver = new ClientIpResolver(
    new TrustedProxyChain(forwardedForParser, new ProxyTrustPolicy(true, ["127.0.0.1"])),
    new ProxyTrustPolicy(true, ["127.0.0.1"]),
  );
  const trusted = trustedResolver.resolve(
    { headers: headers({ "x-forwarded-for": "198.51.100.20, 127.0.0.1" }) },
    "127.0.0.1",
  );
  if (trusted.ip !== "198.51.100.20" || trusted.source !== "forwarded") throw new Error("trusted xff");
  const trustedReal = trustedResolver.resolve({ headers: headers({ "x-real-ip": "198.51.100.30" }) }, "127.0.0.1");
  if (trustedReal.ip !== "198.51.100.30" || trustedReal.source !== "real-ip") throw new Error("trusted real-ip");

  const junk = resolver.resolve({ headers: headers({ "x-forwarded-for": "not-an-ip, <script>" }) }, "10.0.0.1");
  if (junk.ip !== "10.0.0.1" || !junk.anomalous) throw new Error("junk header fallback");
}

export { headers };
