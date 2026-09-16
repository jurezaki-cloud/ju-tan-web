import { OpenAIProvider } from "@/src/ai/providers/openai/OpenAIProvider";
import { OpenAITransport } from "@/src/ai/providers/openai/OpenAITransport";
import { openAIErrorMapper } from "@/src/ai/providers/openai/OpenAIErrorMapper";
import type { OpenAIConfig } from "@/src/ai/providers/openai/OpenAIConfig";
import { MockProvider } from "@/src/ai/providers/MockProvider";
import { EmailSender } from "@/src/notifications/email/EmailSender";
import type { MailTransport } from "@/src/notifications/email/EmailTransportFactory";
import { PreparedEmailTransport } from "@/src/notifications/email/EmailTransportFactory";
import { EmailMessageBuilder } from "@/src/notifications/email/EmailMessageBuilder";
import { inviteNotificationService } from "@/src/notifications/delivery/InviteNotificationService";
import { passwordResetDeliveryService } from "@/src/notifications/delivery/PasswordResetDeliveryService";
import { smtpReady } from "@/src/notifications/email/EmailTransportConfig";
import { relativeInviteLink } from "@/src/notifications/config";
import type { Invite } from "@/src/domain/identity";
import { Role } from "@/src/config/roles";

const disabledOpenAI: OpenAIConfig = {
  enabled: false,
  apiKey: "",
  model: "gpt-4o-mini",
  embeddingModel: "text-embedding-3-small",
  baseUrl: "https://api.openai.com/v1",
  timeoutMs: 2000,
  maxRetries: 0,
  fallback: true,
};

const readyOpenAI: OpenAIConfig = {
  ...disabledOpenAI,
  enabled: true,
  apiKey: "sk-test-secret-key",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

async function assertOpenAIFallback() {
  const provider = new OpenAIProvider(new OpenAITransport(disabledOpenAI), new MockProvider(), disabledOpenAI);
  const response = await provider.chat({ messages: [{ role: "user", content: "pozdrav" }] });
  if (!response.content.includes("Mock")) throw new Error("openai fallback should use mock");
  if (response.model !== "mock-enterprise") throw new Error("openai fallback model");
}

async function assertOpenAISuccessMapping() {
  const transport = new OpenAITransport(readyOpenAI, async () =>
    jsonResponse({
      model: "gpt-4o-mini",
      choices: [{ message: { content: "Pozdravljeni" } }],
      usage: { prompt_tokens: 4, completion_tokens: 6, total_tokens: 10 },
    }),
  );
  const provider = new OpenAIProvider(transport, new MockProvider(), readyOpenAI);
  const response = await provider.chat({
    messages: [{ role: "user", content: "pozdrav" }],
    model: "gpt-4o-mini",
    temperature: 0.2,
    maxTokens: 80,
  });
  if (response.content !== "Pozdravljeni") throw new Error("openai success content");
  if (response.usage.totalTokens !== 10) throw new Error("openai usage mapping");
  if (response.model !== "gpt-4o-mini") throw new Error("openai model mapping");
}

async function assertOpenAIFailureMapping() {
  const mapped = openAIErrorMapper.map(new Error("401 Unauthorized Bearer sk-live-abc123"));
  if (mapped.message.includes("sk-") || mapped.message.includes("Bearer sk")) throw new Error("secret leaked in openai error");
  if (mapped.message.includes("stack") || mapped.message.includes("at ")) throw new Error("stack leaked");
  const transport = new OpenAITransport(readyOpenAI, async () => jsonResponse({ error: { message: "sk-live-abc123 invalid" } }, 401));
  const provider = new OpenAIProvider(transport, new MockProvider(), { ...readyOpenAI, fallback: true });
  const response = await provider.chat({ messages: [{ role: "user", content: "pozdrav" }] });
  if (!response.content.includes("Mock")) throw new Error("openai failure should fallback");
  const json = JSON.stringify(mapped);
  if (json.includes("sk-live") || json.includes("sk-test")) throw new Error("api key in mapped error json");
}

async function assertSmtpPreparedFallback() {
  if (smtpReady({
    enabled: true,
    host: "",
    port: 587,
    secure: false,
    username: "",
    password: "secret-pass",
    from: "",
    replyTo: "",
    connectionTimeoutMs: 1000,
    sendTimeoutMs: 1000,
  })) {
    throw new Error("smtp without host/from must not be ready");
  }
  const sender = new EmailSender(new PreparedEmailTransport());
  const result = await sender.send({ to: "a@ju-tan.com", templateId: "invite.created", inviteLink: "https://ju-tan.com/invite/rawtokenvalue" });
  if (!result.ok) throw new Error("prepared send should return Result ok");
  if (result.data.status !== "prepared") throw new Error("smtp fallback status");
  if (result.data.failureReason !== "transport_disabled") throw new Error("smtp fallback reason");
  if (result.data.body.includes("rawtokenvalue") && !result.data.inviteLink?.startsWith("/invite/")) {
    throw new Error("invite link should be relative");
  }
  if (result.data.inviteLink !== "/invite/rawtokenvalue") throw new Error("relative invite path");
}

async function assertSmtpSuccessAndFailure() {
  const okTransport: MailTransport = {
    canSend: () => true,
    send: async () => ({ status: "sent" }),
  };
  const failTransport: MailTransport = {
    canSend: () => true,
    send: async () => {
      throw new Error("SMTP 421 AUTH password=supersecret");
    },
  };
  const sent = await new EmailSender(okTransport).send({ to: "a@ju-tan.com", templateId: "password.reset.request" });
  if (!sent.ok || sent.data.status !== "sent") throw new Error("smtp success mapping");
  const failed = await new EmailSender(failTransport).send({ to: "a@ju-tan.com", templateId: "password.reset.confirmation" });
  if (!failed.ok || failed.data.status !== "failed") throw new Error("smtp failure mapping");
  const dump = JSON.stringify(failed);
  if (dump.includes("supersecret") || dump.includes("password=supersecret")) throw new Error("smtp password leaked");
}

async function assertInviteAndResetDelivery() {
  const invite: Invite = {
    id: "inv-test-delivery",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "pending",
    metadata: {},
    tenantId: "tenant-ju-tan",
    organizationId: "org-ju-tan",
    workspaceId: "ws-demo",
    ownerId: "system",
    deletedAt: null,
    version: 1,
    userId: "u-test",
    email: "delivery@ju-tan.com",
    role: Role.EMPLOYEE,
    tokenHash: "hash",
    expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
    invitedBy: "system",
    note: "",
    department: "",
  };
  const inviteResult = await inviteNotificationService.deliver({
    invite,
    inviteLink: "/invite/abc123token",
    templateId: "invite.created",
  });
  if (!inviteResult.ok) throw new Error("invite delivery result");
  const email = inviteResult.data.find((item) => item.channel === "email");
  if (!email) throw new Error("invite email channel");
  if (!["prepared", "sent", "failed"].includes(email.status)) throw new Error("invite delivery status");
  if (email.body.includes("abc123token") === false && email.inviteLink !== "/invite/abc123token") {
    throw new Error("invite link missing");
  }
  const dump = JSON.stringify(inviteResult);
  if (dump.toLowerCase().includes("smtp_password") || dump.includes("OPENAI_API_KEY")) throw new Error("secrets in invite payload");

  const reset = await passwordResetDeliveryService.request("reset@ju-tan.com");
  if (!reset.ok) throw new Error("reset delivery result");
  if (!["prepared", "sent", "failed", "skipped"].includes(reset.data.status)) throw new Error("reset status");
  const confirm = await passwordResetDeliveryService.confirmation("reset@ju-tan.com");
  if (!confirm.ok) throw new Error("reset confirmation result");
}

function assertLinkAndTemplateSafety() {
  if (relativeInviteLink("https://evil.example/invite/tok") !== "/invite/tok") throw new Error("relative invite path");
  if (relativeInviteLink("/invite/tok") !== "/invite/tok") throw new Error("already relative");
  const built = new EmailMessageBuilder().build({
    to: "a@ju-tan.com",
    templateId: "invite.created",
    inviteLink: "https://ju-tan.com/invite/secret-token",
    inviteExpiresAt: "2030-01-01T00:00:00.000Z",
    workspace: "ws-demo",
    role: "EMPLOYEE",
    note: "<script>alert(1)</script>",
  });
  if (built.inviteLink !== "/invite/secret-token") throw new Error("builder relative link");
  if (built.html.includes("<script>")) throw new Error("html interpolation not escaped");
  if (!built.subject.includes("ws-demo") || !built.text.includes("EMPLOYEE")) throw new Error("template vars");
}

export async function assertOpenAISmtpDeliveryHardening() {
  await assertOpenAIFallback();
  await assertOpenAISuccessMapping();
  await assertOpenAIFailureMapping();
  await assertSmtpPreparedFallback();
  await assertSmtpSuccessAndFailure();
  await assertInviteAndResetDelivery();
  assertLinkAndTemplateSafety();
}

void assertOpenAISmtpDeliveryHardening().catch((error) => {
  console.error(error);
  process.exit(1);
});
