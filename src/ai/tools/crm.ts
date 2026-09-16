import { defineTool, stringProp } from "./define";
import type { Tool } from "@/src/ai/types/tool";
import { crmService } from "@/src/services/CRMService";
import { leadService } from "@/src/services/LeadService";
import { clientService } from "@/src/services/ClientService";

export function createCrmTools(): Tool[] {
  return [
    defineTool(
      "crm.createLead",
      "Ustvari stik",
      "Ustvari CRM stik.",
      {
        type: "object",
        properties: {
          name: stringProp("Ime"),
          company: stringProp("Podjetje"),
          email: stringProp("E-pošta"),
        },
        required: ["name", "company"],
      },
      (input) =>
        crmService.createLead({
          name: String(input.name),
          company: String(input.company),
          companyId: "",
          email: input.email ? String(input.email) : "",
          phone: "",
          status: "Novo",
          lastContact: new Date().toLocaleDateString("sl-SI"),
        }),
    ),
    defineTool(
      "crm.findClient",
      "Najdi stranko",
      "Poišče stranko po id ali imenu.",
      {
        type: "object",
        properties: {
          id: stringProp("Id stranke"),
          name: stringProp("Ime"),
        },
      },
      (input) => {
        if (input.id) return clientService.getById(String(input.id));
        const list = clientService.search(String(input.name ?? ""));
        return list.ok ? list.data[0] ?? { found: false } : list;
      },
    ),
    defineTool(
      "crm.updateLead",
      "Posodobi stik",
      "Posodobi polja obstoječega stika.",
      {
        type: "object",
        properties: {
          id: stringProp("Id stika"),
          status: stringProp("Status"),
        },
        required: ["id"],
      },
      (input) => leadService.update(String(input.id), { status: input.status ? String(input.status) : undefined }),
    ),
  ];
}
