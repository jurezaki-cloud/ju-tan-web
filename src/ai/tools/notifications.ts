import { defineTool, stringProp } from "./define";
import type { Tool, ToolContext } from "@/src/ai/types/tool";
import { Role } from "@/src/config/roles";
import { userAdminService } from "@/src/services/identity";
import { notificationDeliveryService } from "@/src/notifications";
import type { NotificationChannel } from "@/src/types/notifications";
import { inviteSecurityService } from "@/src/security/invite";
import { inviteRepository } from "@/src/repositories/identity";
import { notificationCopyAdvisor } from "@/src/ai/services/NotificationCopyAdvisor";

function actorFromContext(_context: ToolContext) {
  void _context;
  return { id: "u-admin", role: Role.ADMIN };
}

export function createNotificationTools(): Tool[] {
  return [
    defineTool(
      "notification.prepare",
      "Pripravi obvestilo",
      "Pripravi subject, sporočilo in predlaga kanal.",
      {
        type: "object",
        properties: {
          email: stringProp("E-pošta"),
          channel: stringProp("Kanal"),
        },
        required: ["email"],
      },
      async (input) => {
        const channel = (input.channel as NotificationChannel) || "email";
        const suggestion = userAdminService.suggestInvite(String(input.email));
        const advice = await notificationCopyAdvisor.advise(String(input.email));
        return {
          channel: input.channel ? channel : advice.channel,
          subject: advice.subject,
          message: advice.onboardingCopy,
          note: suggestion.note,
          resendWaitSec: advice.resendWaitSec,
          fallbackMessage: advice.fallbackMessage,
          providerId: advice.providerId,
          usage: advice.usage,
        };
      },
    ),
    defineTool(
      "notification.send",
      "Pošlji obvestilo",
      "Pošlje pripravljen payload prek delivery sloja.",
      {
        type: "object",
        properties: {
          email: stringProp("E-pošta"),
          channel: stringProp("Kanal"),
          subject: stringProp("Zadeva"),
          body: stringProp("Vsebina"),
        },
        required: ["email"],
      },
      (input) =>
        notificationDeliveryService.deliver({
          channel: (input.channel as NotificationChannel) || "email",
          status: "prepared",
          to: String(input.email),
          subject: String(input.subject ?? "Povabilo"),
          body: String(input.body ?? ""),
          metadata: { templateId: "invite.created" },
        }),
    ),
    defineTool(
      "notification.retry",
      "Ponovi dostavo",
      "Ponovi failed delivery attempt.",
      {
        type: "object",
        properties: { deliveryId: stringProp("Id dostave") },
        required: ["deliveryId"],
      },
      (input) => notificationDeliveryService.retry(String(input.deliveryId)),
    ),
    defineTool(
      "invite.send",
      "Pošlji povabilo",
      "Ustvari invite in sproži delivery.",
      {
        type: "object",
        properties: {
          email: stringProp("E-pošta"),
          role: stringProp("Vloga"),
        },
        required: ["email"],
      },
      (input) => {
        const suggestion = userAdminService.suggestInvite(String(input.email));
        return userAdminService.invite(
          { id: "u-admin", role: Role.ADMIN },
          {
            email: String(input.email),
            role: (input.role as Role) ?? suggestion.role,
            workspaceId: suggestion.workspaceId,
            note: suggestion.note,
          },
        );
      },
    ),
    defineTool(
      "invite.resend",
      "Ponovno pošlji povabilo",
      "Predlaga in izvede resend.",
      {
        type: "object",
        properties: { inviteId: stringProp("Id povabila") },
        required: ["inviteId"],
      },
      (input) => userAdminService.resendInvite({ id: "u-admin", role: Role.ADMIN }, String(input.inviteId)),
    ),
    defineTool(
      "invite.throttle",
      "Predlagaj throttle",
      "Predlaga varnejši resend timing in cooldown policy.",
      {
        type: "object",
        properties: { inviteId: stringProp("Id povabila") },
        required: ["inviteId"],
      },
      (input) => {
        const inviteId = String(input.inviteId);
        const state = inviteSecurityService.stateForInvite(inviteId);
        return {
          inviteId,
          suggestedResendWaitSec: 300,
          cooldownPolicy: "5 min med resend-i istega povabila",
          onboardingGuardSummary: state?.status === "locked" ? "Žeton je zaklenjen." : "Throttle je aktiven.",
          lockedUntil: state?.lockedUntil,
          invalidAttempts: state?.invalidAttempts ?? 0,
        };
      },
    ),
    defineTool(
      "invite.lock",
      "Zakleni povabilo",
      "Začasno zaklene invite žeton.",
      {
        type: "object",
        properties: { inviteId: stringProp("Id povabila") },
        required: ["inviteId"],
      },
      (input) => {
        const invite = inviteRepository.getById(String(input.inviteId), true);
        if (!invite) return { ok: false, error: "Povabilo ni veljavno." };
        return inviteSecurityService.lock(invite.tokenHash, invite.id);
      },
    ),
    defineTool(
      "invite.unlock",
      "Odkleni povabilo",
      "Odstrani lockout z invite žetona.",
      {
        type: "object",
        properties: { inviteId: stringProp("Id povabila") },
        required: ["inviteId"],
      },
      (input) => {
        const invite = inviteRepository.getById(String(input.inviteId), true);
        if (!invite) return { ok: false, error: "Povabilo ni veljavno." };
        return inviteSecurityService.unlock(invite.tokenHash);
      },
    ),
    defineTool(
      "invite.flagAbuse",
      "Označi zlorabo",
      "Zapiše abuse flag in audit.",
      {
        type: "object",
        properties: {
          inviteId: stringProp("Id povabila"),
          kind: stringProp("Vrsta"),
        },
        required: ["inviteId"],
      },
      (input, context) =>
        inviteSecurityService.flag(actorFromContext(context).id, String(input.inviteId), String(input.kind ?? "manual")),
    ),
    defineTool(
      "invite.cooldown",
      "Aktiviraj cooldown",
      "Vklopi cooldown po resend/create.",
      {
        type: "object",
        properties: {
          inviteId: stringProp("Id povabila"),
          email: stringProp("E-pošta"),
        },
        required: ["inviteId"],
      },
      (input, context) => {
        const actor = actorFromContext(context);
        inviteSecurityService.cooldownResend(actor.id, String(input.inviteId));
        if (input.email) inviteSecurityService.cooldownCreate(actor.id, String(input.email));
        return { ok: true, inviteId: String(input.inviteId) };
      },
    ),
  ];
}
