import { defineTool, stringProp } from "./define";
import type { Tool } from "@/src/ai/types/tool";
import { offerService } from "@/src/services/OfferService";
import { offerDraftService } from "@/src/services/OfferDraftService";
import { offerApprovalService } from "@/src/services/OfferApprovalService";

export function createTicketTools(): Tool[] {
  return [
    defineTool(
      "ticket.create",
      "Ustvari ticket",
      "Odpre support zapis.",
      {
        type: "object",
        properties: {
          title: stringProp("Naslov"),
          requester: stringProp("Stranka"),
        },
        required: ["title"],
      },
      (input) => ({
        id: "t-mock",
        title: input.title,
        requester: input.requester ?? "",
        status: "Open",
      }),
    ),
  ];
}

export function createDocumentTools(): Tool[] {
  return [
    defineTool(
      "document.create",
      "Ustvari dokument",
      "Ustvari zapis dokumenta.",
      {
        type: "object",
        properties: {
          name: stringProp("Ime"),
          folder: stringProp("Mapa"),
        },
        required: ["name"],
      },
      (input) => ({ id: "d-mock", name: input.name, folder: input.folder ?? "PDF" }),
    ),
    defineTool(
      "document.search",
      "Išči dokumente",
      "Iskanje po imenu ali mapi.",
      {
        type: "object",
        properties: { query: stringProp("Poizvedba") },
        required: ["query"],
      },
      (input) => ({ query: input.query, items: [] }),
    ),
  ];
}

export function createOfferFlowTools(): Tool[] {
  return [
    defineTool(
      "offer.generate",
      "Generiraj ponudbo",
      "Pripravi osnutek ponudbe iz stranke ali lead-a.",
      {
        type: "object",
        properties: {
          clientId: stringProp("Stranka"),
          leadId: stringProp("Lead"),
          title: stringProp("Naziv"),
        },
      },
      (input) =>
        offerDraftService.fromLead({
          clientId: input.clientId ? String(input.clientId) : undefined,
          leadId: input.leadId ? String(input.leadId) : undefined,
          title: input.title ? String(input.title) : undefined,
          source: "ai",
        }),
    ),
    defineTool(
      "offer.summary",
      "Povzemi ponudbo",
      "Povzetek, tveganja in predpostavke.",
      {
        type: "object",
        properties: { offerId: stringProp("Ponudba") },
        required: ["offerId"],
      },
      (input) => offerService.summary(String(input.offerId)),
    ),
    defineTool(
      "offer.revise",
      "Revizija ponudbe",
      "Primerja različice in zabeleži revizijo.",
      {
        type: "object",
        properties: {
          offerId: stringProp("Ponudba"),
          changeSummary: stringProp("Povzetek"),
        },
        required: ["offerId"],
      },
      (input) =>
        offerDraftService.revise({
          offerId: String(input.offerId),
          changeSummary: String(input.changeSummary ?? "AI revizija"),
        }),
    ),
    defineTool(
      "offer.approve.request",
      "Zahtevaj odobritev",
      "Pripravi approval request.",
      {
        type: "object",
        properties: {
          offerId: stringProp("Ponudba"),
          comment: stringProp("Komentar"),
        },
        required: ["offerId"],
      },
      (input) =>
        offerApprovalService.request({
          offerId: String(input.offerId),
          comment: input.comment ? String(input.comment) : "AI zahteva odobritev",
        }),
    ),
    defineTool(
      "offer.approve.grant",
      "Odobri ponudbo",
      "Podeli odobritev prek Approval Engine.",
      {
        type: "object",
        properties: { offerId: stringProp("Ponudba") },
        required: ["offerId"],
      },
      (input) => offerApprovalService.grant(String(input.offerId)),
    ),
    defineTool(
      "offer.linkArtifact",
      "Poveži artifact",
      "Poveže PDF/JSON artifact s ponudbo.",
      {
        type: "object",
        properties: {
          offerId: stringProp("Ponudba"),
          artifactId: stringProp("Artifact"),
        },
        required: ["offerId", "artifactId"],
      },
      (input) => offerService.linkArtifact(String(input.offerId), String(input.artifactId)),
    ),
  ];
}

export function createOfferInvoiceTools(): Tool[] {
  return [
    ...createOfferFlowTools(),
    defineTool(
      "invoice.generate",
      "Generiraj račun",
      "Pripravi osnutek računa.",
      {
        type: "object",
        properties: { clientId: stringProp("Stranka") },
        required: ["clientId"],
      },
      (input) => ({ clientId: input.clientId, artifact: "PDF" }),
    ),
  ];
}
