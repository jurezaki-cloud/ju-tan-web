import { ok, type Result } from "@/src/types/platform";
import type { ClientIpResolution } from "@/src/types/security";
import { entity, nextId, runIdentityTx, writeAudit } from "@/src/services/identity/shared";
import { proxyAnomalyRepository } from "@/src/repositories/security";
import { clientIpResolver } from "./ClientIpResolver";

export class ProxyIpService {
  resolve(request: Request, remoteAddress?: string): Result<ClientIpResolution> {
    const resolution = clientIpResolver.resolve(request, remoteAddress);
    if (resolution.anomalous) {
      this.record(resolution);
    }
    return ok(resolution);
  }

  ip(request: Request, remoteAddress?: string) {
    const result = this.resolve(request, remoteAddress);
    return result.ok ? result.data.ip : "0.0.0.0";
  }

  private record(resolution: ClientIpResolution) {
    runIdentityTx(() =>
      proxyAnomalyRepository.save({
        ...entity(nextId("pxa"), "open", "system"),
        reason: resolution.source,
        hopCount: resolution.hopCount,
      }),
    );
    writeAudit("ProxyIpAnomalyDetected", "system", undefined, {
      source: resolution.source,
      hopCount: resolution.hopCount,
    });
    if (proxyAnomalyRepository.recentCount(60_000) >= 12) {
      writeAudit("InviteRateLimitBurstDetected", "system", undefined, { kind: "proxy" });
    }
  }
}

export const proxyIpService = new ProxyIpService();
