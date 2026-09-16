import { ok, type Result } from "@/src/types/platform";
import type { NotificationResult } from "@/src/types/notifications";
import { notificationDeliveryService } from "./NotificationDeliveryService";
import { notificationConfig } from "../config";
import { writeAudit } from "@/src/services/identity/shared";

export class PasswordResetDeliveryService {
  async request(email: string, resetToken?: string): Promise<Result<NotificationResult>> {
    if (!email.includes("@")) return ok(this.empty());
    writeAudit("PasswordResetDeliveryPrepared", "system", email, {});
    const origin = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ju-tan.com").replace(/\/$/, "");
    const body = resetToken
      ? `Zahteva za ponastavitev gesla za ${notificationConfig.companyName}. Povezava velja eno uro: ${origin}/login?resetToken=${resetToken}`
      : `Zahteva za ponastavitev gesla za ${notificationConfig.companyName} je bila sprejeta.`;
    return notificationDeliveryService.deliver({
      channel: "email",
      status: "prepared",
      to: email,
      subject: "Ponastavitev gesla",
      body,
      metadata: { templateId: "password.reset.request" },
    });
  }

  async confirmation(email: string): Promise<Result<NotificationResult>> {
    if (!email.includes("@")) return ok(this.empty());
    writeAudit("PasswordResetDeliveryPrepared", "system", email, {});
    return notificationDeliveryService.deliver({
      channel: "email",
      status: "prepared",
      to: email,
      subject: "Geslo je spremenjeno",
      body: `Geslo za ${notificationConfig.companyName} je bilo uspešno spremenjeno.`,
      metadata: { templateId: "password.reset.confirmation" },
    });
  }

  private empty(): NotificationResult {
    return {
      id: "ndel-skip",
      channel: "email",
      provider: "none",
      status: "skipped",
      to: "",
      subject: "",
      body: "",
      retry: { attempt: 0, maxAttempts: 0, terminal: true },
      metadata: {},
    };
  }
}

export const passwordResetDeliveryService = new PasswordResetDeliveryService();
