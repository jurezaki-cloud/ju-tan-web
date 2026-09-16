import { defineTool, stringProp } from "./define";
import type { Tool } from "@/src/ai/types/tool";

export function createProjectTools(): Tool[] {
  return [
    defineTool(
      "project.create",
      "Ustvari projekt",
      "Ustvari projektni zapis.",
      {
        type: "object",
        properties: {
          name: stringProp("Ime"),
          clientId: stringProp("Stranka"),
        },
        required: ["name"],
      },
      (input) => ({ id: "p-mock", name: input.name, clientId: input.clientId, status: "Načrt" }),
    ),
    defineTool(
      "project.update",
      "Posodobi projekt",
      "Posodobi status ali napredek.",
      {
        type: "object",
        properties: {
          id: stringProp("Id"),
          status: stringProp("Status"),
        },
        required: ["id"],
      },
      (input) => ({ id: input.id, status: input.status ?? "V teku" }),
    ),
    defineTool(
      "project.list",
      "Seznam projektov",
      "Vrne seznam projektov.",
      { type: "object", properties: { clientId: stringProp("Filter stranke") } },
      (input) => ({ clientId: input.clientId ?? null, items: [] }),
    ),
  ];
}
