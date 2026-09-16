import { defineTool, stringProp } from "./define";
import type { Tool } from "@/src/ai/types/tool";
import type { IntegrationBundle, NotificationChannel } from "@/src/types/integrations";
import { crmService } from "@/src/services/CRMService";
import { taskService } from "@/src/services/TaskService";
import { quoteService } from "@/src/services/QuoteService";
import { createOfferFlowTools } from "./operations";

const channels: NotificationChannel[] = ["in-app", "email", "webhook", "slack", "teams"];

function asChannel(value: unknown): NotificationChannel {
  const raw = String(value ?? "in-app");
  return channels.includes(raw as NotificationChannel) ? (raw as NotificationChannel) : "in-app";
}

export function createDataTools(integrations: IntegrationBundle): Tool[] {
  return [
    defineTool(
      "crm.findClient",
      "Najdi stranko",
      "Poišče stranko v CRM adapterju.",
      {
        type: "object",
        properties: { id: stringProp("Id"), name: stringProp("Ime") },
      },
      (input) =>
        integrations.crm.findClient({
          id: input.id ? String(input.id) : undefined,
          name: input.name ? String(input.name) : undefined,
        }) ?? { found: false },
    ),
    defineTool(
      "crm.findLead",
      "Najdi stik",
      "Poišče lead v CRM.",
      {
        type: "object",
        properties: { id: stringProp("Id"), name: stringProp("Ime") },
      },
      (input) =>
        integrations.crm.findLead({
          id: input.id ? String(input.id) : undefined,
          name: input.name ? String(input.name) : undefined,
        }) ?? { found: false },
    ),
    defineTool(
      "crm.listOpenTasks",
      "Odprte naloge",
      "Seznam odprtih nalog.",
      { type: "object", properties: { clientId: stringProp("Klient") } },
      (input) => ({ items: integrations.crm.listTasks(input.clientId ? String(input.clientId) : undefined) }),
    ),
    defineTool(
      "crm.listTasks",
      "CRM naloge",
      "Seznam nalog iz CRM adapterja.",
      { type: "object", properties: { clientId: stringProp("Klient") } },
      (input) => ({ items: integrations.crm.listTasks(input.clientId ? String(input.clientId) : undefined) }),
    ),
    defineTool(
      "crm.listActivities",
      "CRM aktivnosti",
      "Seznam aktivnosti.",
      { type: "object", properties: { clientId: stringProp("Klient") } },
      (input) => ({ items: integrations.crm.listActivities(input.clientId ? String(input.clientId) : undefined) }),
    ),
    defineTool(
      "crm.listQuotes",
      "CRM ponudbe",
      "Seznam ponudb.",
      { type: "object", properties: { clientId: stringProp("Klient") } },
      (input) => ({ items: integrations.crm.listQuotes(input.clientId ? String(input.clientId) : undefined) }),
    ),
    defineTool(
      "crm.createLead",
      "Ustvari lead",
      "Ustvari lead prek CRM servisa.",
      {
        type: "object",
        properties: {
          name: stringProp("Ime"),
          company: stringProp("Podjetje"),
          email: stringProp("E-pošta"),
          clientId: stringProp("Klient"),
        },
        required: ["name", "company"],
      },
      (input) =>
        crmService.createLead({
          name: String(input.name),
          company: String(input.company),
          companyId: input.clientId ? String(input.clientId) : "",
          status: "Novo",
          phone: "",
          email: input.email ? String(input.email) : "",
          lastContact: new Date().toLocaleDateString("sl-SI"),
        }),
    ),
    defineTool(
      "crm.createTask",
      "Ustvari nalogo",
      "Ustvari CRM nalogo.",
      {
        type: "object",
        properties: {
          name: stringProp("Ime"),
          clientId: stringProp("Klient"),
          dueAt: stringProp("Rok"),
        },
        required: ["name"],
      },
      (input) =>
        taskService.create({
          name: String(input.name),
          clientId: input.clientId ? String(input.clientId) : undefined,
          dueAt: input.dueAt ? String(input.dueAt) : undefined,
        }),
    ),
    defineTool(
      "crm.prepareQuoteDraft",
      "Osnutek ponudbe",
      "Pripravi osnutek ponudbe za stranko.",
      {
        type: "object",
        properties: { clientId: stringProp("Klient") },
        required: ["clientId"],
      },
      (input) => quoteService.draftFromClient(String(input.clientId)),
    ),
    defineTool(
      "crm.summarizeTimeline",
      "Povzetek časovnice",
      "Povzame CRM timeline stranke.",
      {
        type: "object",
        properties: { clientId: stringProp("Klient") },
        required: ["clientId"],
      },
      (input) => crmService.summarizeTimeline(String(input.clientId)),
    ),
    defineTool(
      "crm.suggestNextActivity",
      "Naslednja aktivnost",
      "Predlaga naslednjo CRM aktivnost.",
      {
        type: "object",
        properties: { clientId: stringProp("Klient") },
        required: ["clientId"],
      },
      (input) => crmService.suggestNextActivity(String(input.clientId)),
    ),
    defineTool(
      "document.search",
      "Išči dokumente",
      "Iskanje dokumentov prek adapterja.",
      {
        type: "object",
        properties: { query: stringProp("Poizvedba") },
        required: ["query"],
      },
      (input) => ({ items: integrations.documents.search(String(input.query)) }),
    ),
    defineTool(
      "document.read",
      "Preberi dokument",
      "Prebere dokument prek adapterja.",
      {
        type: "object",
        properties: { id: stringProp("Id dokumenta") },
        required: ["id"],
      },
      (input) => integrations.documents.read(String(input.id)) ?? { found: false },
    ),
    defineTool(
      "document.summary",
      "Povzetek dokumenta",
      "Sestavi povzetek dokumenta.",
      {
        type: "object",
        properties: { id: stringProp("Id dokumenta") },
        required: ["id"],
      },
      (input) => ({ summary: integrations.documents.summarize(String(input.id)) }),
    ),
    defineTool(
      "document.linkArtifact",
      "Poveži dokument z artifactom",
      "Poveže dokument in artifact.",
      {
        type: "object",
        properties: {
          documentId: stringProp("Dokument"),
          artifactId: stringProp("Artifact"),
          actionId: stringProp("Akcija"),
        },
        required: ["documentId", "artifactId"],
      },
      (input) =>
        integrations.documents.linkArtifact(String(input.documentId), String(input.artifactId), {
          actionId: input.actionId ? String(input.actionId) : undefined,
        }),
    ),
    defineTool(
      "artifact.link",
      "Poveži artifact",
      "Poveže artifact s CRM ali dokumentom.",
      {
        type: "object",
        properties: {
          artifactId: stringProp("Artifact"),
          clientId: stringProp("Klient"),
          leadId: stringProp("Lead"),
          projectId: stringProp("Projekt"),
          documentId: stringProp("Dokument"),
          actionId: stringProp("Akcija"),
          workflowId: stringProp("Tok"),
          approvalId: stringProp("Odobritev"),
        },
        required: ["artifactId"],
      },
      (input) =>
        integrations.artifacts.link({
          artifactId: String(input.artifactId),
          clientId: input.clientId ? String(input.clientId) : undefined,
          leadId: input.leadId ? String(input.leadId) : undefined,
          projectId: input.projectId ? String(input.projectId) : undefined,
          documentId: input.documentId ? String(input.documentId) : undefined,
          actionId: input.actionId ? String(input.actionId) : undefined,
          workflowId: input.workflowId ? String(input.workflowId) : undefined,
          approvalId: input.approvalId ? String(input.approvalId) : undefined,
        }),
    ),
    defineTool(
      "artifact.resolve",
      "Razreši artifact",
      "Vrne povezave artifacta.",
      {
        type: "object",
        properties: { artifactId: stringProp("Artifact") },
        required: ["artifactId"],
      },
      (input) => integrations.artifacts.reference(String(input.artifactId)) ?? { found: false },
    ),
    defineTool(
      "file.linkArtifact",
      "Poveži artifact",
      "Shrani vsebino in poveže z akcijo.",
      {
        type: "object",
        properties: {
          name: stringProp("Ime"),
          content: stringProp("Vsebina"),
          actionId: stringProp("Akcija"),
        },
        required: ["name", "content"],
      },
      (input) => {
        const meta = integrations.storage.put(String(input.name), String(input.content), "text/plain");
        const ref = integrations.artifacts.store({
          id: meta.id,
          format: "MD",
          title: String(input.name),
          uri: `mock://files/${meta.id}`,
        });
        if (input.actionId) {
          integrations.artifacts.link({ artifactId: ref.id, actionId: String(input.actionId) });
        }
        return { file: meta, artifact: ref };
      },
    ),
    defineTool(
      "knowledge.search",
      "Išči znanje",
      "Iskanje po knowledge adapterju.",
      {
        type: "object",
        properties: {
          query: stringProp("Poizvedba"),
          collection: stringProp("Zbirka"),
        },
        required: ["query"],
      },
      (input) => ({
        items: integrations.knowledge.search(String(input.query), input.collection ? String(input.collection) : undefined),
      }),
    ),
    defineTool(
      "knowledge.prepareContext",
      "Pripravi knowledge kontekst",
      "Sestavi RAG kontekst.",
      {
        type: "object",
        properties: { query: stringProp("Poizvedba") },
        required: ["query"],
      },
      (input) => ({ context: integrations.knowledge.prepareContext(String(input.query)) }),
    ),
    defineTool(
      "notification.prepare",
      "Pripravi obvestilo",
      "Sestavi obvestilo. E-pošta zahteva odobritev.",
      {
        type: "object",
        properties: {
          title: stringProp("Naslov"),
          body: stringProp("Besedilo"),
          channel: stringProp("Kanal"),
        },
        required: ["title", "body"],
      },
      (input) => {
        const channel = asChannel(input.channel);
        return integrations.notifications.prepare({
          channel,
          title: String(input.title),
          body: String(input.body),
          requiresApproval: channel !== "in-app",
        });
      },
    ),
    defineTool(
      "search.global",
      "Globalno iskanje",
      "Iskanje po CRM, dokumentih, ticketih, znanju in artifactih.",
      {
        type: "object",
        properties: { query: stringProp("Poizvedba") },
        required: ["query"],
      },
      (input) => ({ items: integrations.search.search(String(input.query)) }),
    ),
    ...createOfferFlowTools(),
  ];
}
