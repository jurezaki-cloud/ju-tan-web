import { defineTool, stringProp } from "./define";
import type { Tool } from "@/src/ai/types/tool";

export function createAutomationKnowledgeTools(): Tool[] {
  return [
    defineTool(
      "automation.run",
      "Zaženi avtomatizacijo",
      "Sproži poslovni tok.",
      {
        type: "object",
        properties: { workflowId: stringProp("Id toka") },
        required: ["workflowId"],
      },
      (input) => ({ workflowId: input.workflowId, status: "queued" }),
    ),
    defineTool(
      "knowledge.search",
      "Išči znanje",
      "Iskanje po knowledge zbirkah.",
      {
        type: "object",
        properties: {
          query: stringProp("Poizvedba"),
          collection: stringProp("Zbirka"),
        },
        required: ["query"],
      },
      (input) => ({ query: input.query, collection: input.collection ?? "docs", items: [] }),
    ),
  ];
}

export function createExternalTools(): Tool[] {
  return [
    defineTool(
      "github.search",
      "GitHub iskanje",
      "Iskanje v repozitoriju. Povezava ni aktivna.",
      {
        type: "object",
        properties: { query: stringProp("Poizvedba") },
        required: ["query"],
      },
      async () => {
        throw new Error("GitHub ni priklopljen.");
      },
    ),
    defineTool(
      "repo.read",
      "Branje repozitorija",
      "Prebere datoteko. Povezava ni aktivna.",
      {
        type: "object",
        properties: { path: stringProp("Pot") },
        required: ["path"],
      },
      async () => {
        throw new Error("Repo ni priklopljen.");
      },
    ),
    defineTool(
      "api.test",
      "Test API",
      "Pošlje testni klic. Ni izveden.",
      {
        type: "object",
        properties: { url: stringProp("URL") },
        required: ["url"],
      },
      async () => {
        throw new Error("API test ni priklopljen.");
      },
    ),
    defineTool(
      "email.send",
      "Pošlji e-pošto",
      "Pošiljanje e-pošte. Ni priklopljeno.",
      {
        type: "object",
        properties: {
          to: stringProp("Prejemnik"),
          subject: stringProp("Zadeva"),
        },
        required: ["to", "subject"],
      },
      async () => {
        throw new Error("E-pošta ni priklopljena.");
      },
    ),
    defineTool(
      "calendar.create",
      "Ustvari dogodek",
      "Koledar. Ni priklopljen.",
      {
        type: "object",
        properties: { title: stringProp("Naslov") },
        required: ["title"],
      },
      async () => {
        throw new Error("Koledar ni priklopljen.");
      },
    ),
    defineTool(
      "notification.send",
      "Pošlji obvestilo",
      "Interno obvestilo (mock).",
      {
        type: "object",
        properties: { message: stringProp("Besedilo") },
        required: ["message"],
      },
      (input) => ({ queued: true, message: input.message }),
    ),
  ];
}
