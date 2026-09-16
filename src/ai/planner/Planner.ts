import type { ActionType, Plan, PlanRequest } from "@/src/ai/actions/types";
import type { ApprovalPolicy } from "@/src/ai/approval/policy";
import { DefaultApprovalPolicy } from "@/src/ai/approval/policy";

type Template = Omit<Plan, "requiresApproval" | "steps"> & {
  steps: {
    title: string;
    toolId?: string;
    artifactKind?: string;
    reason: string;
    estimatedTime: string;
  }[];
};

const templates: Record<ActionType, Template> = {
  "create-lead": {
    type: "create-lead",
    title: "Ustvari stik",
    description: "Nov CRM stik.",
    category: "crm",
    estimatedDuration: "3 min",
    steps: [
      { title: "CRM", toolId: "crm.createLead", reason: "Zapis stika.", estimatedTime: "3 min" },
    ],
  },
  "create-client": {
    type: "create-client",
    title: "Ustvari stranko",
    description: "Nov zapis stranke.",
    category: "crm",
    estimatedDuration: "4 min",
    steps: [
      { title: "Iskanje", toolId: "crm.findClient", reason: "Preveri obstoj.", estimatedTime: "1 min" },
      { title: "CRM", toolId: "crm.createLead", reason: "Ustvari zapis.", estimatedTime: "3 min" },
    ],
  },
  "create-project": {
    type: "create-project",
    title: "Ustvari projekt",
    description: "Nov projektni zapis.",
    category: "project",
    estimatedDuration: "4 min",
    steps: [
      { title: "CRM", toolId: "crm.findClient", reason: "Poveži stranko.", estimatedTime: "1 min" },
      { title: "Projekt", toolId: "project.create", reason: "Odpri projekt.", estimatedTime: "3 min" },
    ],
  },
  "create-offer": {
    type: "create-offer",
    title: "Pripravi ponudbo",
    description: "Analiza, CRM, ponudba, PDF, e-pošta.",
    category: "sales",
    estimatedDuration: "18 min",
    steps: [
      { title: "Analiza", toolId: "knowledge.search", reason: "Kontekst izbora.", estimatedTime: "4 min" },
      { title: "CRM", toolId: "crm.findClient", reason: "Podatki stranke.", estimatedTime: "3 min" },
      { title: "Aktivnosti", toolId: "crm.listActivities", reason: "Zadnji dogodki.", estimatedTime: "2 min" },
      { title: "Ponudbe", toolId: "crm.listQuotes", reason: "Obstoječe ponudbe.", estimatedTime: "2 min" },
      { title: "Dokumenti", toolId: "document.search", reason: "Povezani dokumenti.", estimatedTime: "2 min" },
      { title: "Ponudba", toolId: "offer.generate", reason: "Osnutek ponudbe.", estimatedTime: "5 min" },
      { title: "PDF", artifactKind: "PDF", reason: "Dokument za pregled.", estimatedTime: "3 min" },
      { title: "Email", toolId: "email.send", reason: "Pošiljanje zahteva odobritev.", estimatedTime: "3 min" },
    ],
  },
  "create-invoice": {
    type: "create-invoice",
    title: "Pripravi račun",
    description: "Račun zahteva odobritev.",
    category: "erp",
    estimatedDuration: "10 min",
    steps: [
      { title: "CRM", toolId: "crm.findClient", reason: "Stranka.", estimatedTime: "2 min" },
      { title: "Račun", toolId: "invoice.generate", reason: "Osnutek računa.", estimatedTime: "5 min" },
      { title: "PDF", artifactKind: "PDF", reason: "Izvoz.", estimatedTime: "3 min" },
    ],
  },
  "generate-pdf": {
    type: "generate-pdf",
    title: "Generiraj PDF",
    description: "PDF artefakt.",
    category: "docs",
    estimatedDuration: "3 min",
    steps: [{ title: "PDF", artifactKind: "PDF", reason: "Izvoz dokumenta.", estimatedTime: "3 min" }],
  },
  "generate-documentation": {
    type: "generate-documentation",
    title: "Generiraj dokumentacijo",
    description: "Markdown dokumentacija.",
    category: "docs",
    estimatedDuration: "6 min",
    steps: [
      { title: "Znanje", toolId: "knowledge.search", reason: "Viri.", estimatedTime: "3 min" },
      { title: "MD", artifactKind: "MD", reason: "Zapis.", estimatedTime: "3 min" },
    ],
  },
  "generate-sql": {
    type: "generate-sql",
    title: "Generiraj SQL",
    description: "SQL osnutek.",
    category: "engineering",
    estimatedDuration: "4 min",
    steps: [{ title: "SQL", artifactKind: "SQL", reason: "Izvoz poizvedbe.", estimatedTime: "4 min" }],
  },
  "generate-api-spec": {
    type: "generate-api-spec",
    title: "Generiraj API specifikacijo",
    description: "OpenAPI osnutek.",
    category: "engineering",
    estimatedDuration: "8 min",
    steps: [
      { title: "Znanje", toolId: "knowledge.search", reason: "API zapisi.", estimatedTime: "3 min" },
      { title: "API", artifactKind: "API", reason: "Specifikacija.", estimatedTime: "5 min" },
    ],
  },
  "generate-diagram": {
    type: "generate-diagram",
    title: "Generiraj diagram",
    description: "Tok diagrama.",
    category: "docs",
    estimatedDuration: "4 min",
    steps: [{ title: "Diagram", artifactKind: "Diagram", reason: "Prikaz toka.", estimatedTime: "4 min" }],
  },
  "run-automation": {
    type: "run-automation",
    title: "Zaženi avtomatizacijo",
    description: "Poslovni tok.",
    category: "automation",
    estimatedDuration: "5 min",
    steps: [
      { title: "Avtomatizacija", toolId: "automation.run", reason: "Sproži tok.", estimatedTime: "5 min" },
    ],
  },
  "search-knowledge": {
    type: "search-knowledge",
    title: "Išči znanje",
    description: "Iskanje po zbirkah.",
    category: "docs",
    estimatedDuration: "2 min",
    steps: [
      { title: "Iskanje", toolId: "knowledge.search", reason: "Najdi vire.", estimatedTime: "2 min" },
    ],
  },
  "analyze-website": {
    type: "analyze-website",
    title: "Analiza spletnega mesta",
    description: "Pregled (mock, brez zunanjih klicev).",
    category: "engineering",
    estimatedDuration: "12 min",
    steps: [
      { title: "Znanje", toolId: "knowledge.search", reason: "Obstoječi zapisi.", estimatedTime: "4 min" },
      { title: "MD", artifactKind: "MD", reason: "Poročilo audita.", estimatedTime: "8 min" },
    ],
  },
  "analyze-repository": {
    type: "analyze-repository",
    title: "Analiza repozitorija",
    description: "Pregled (mock, brez GitHub).",
    category: "engineering",
    estimatedDuration: "15 min",
    steps: [
      { title: "Znanje", toolId: "knowledge.search", reason: "Interni zapisi.", estimatedTime: "5 min" },
      { title: "MD", artifactKind: "MD", reason: "Poročilo.", estimatedTime: "10 min" },
    ],
  },
  "find-client": {
    type: "find-client",
    title: "Najdi stranko",
    description: "CRM iskanje stranke.",
    category: "crm",
    estimatedDuration: "1 min",
    steps: [{ title: "CRM", toolId: "crm.findClient", reason: "Adapter CRM.", estimatedTime: "1 min" }],
  },
  "find-lead": {
    type: "find-lead",
    title: "Najdi stik",
    description: "CRM iskanje leada.",
    category: "crm",
    estimatedDuration: "1 min",
    steps: [{ title: "CRM", toolId: "crm.findLead", reason: "Adapter CRM.", estimatedTime: "1 min" }],
  },
  "list-open-tasks": {
    type: "list-open-tasks",
    title: "Odprte naloge",
    description: "Seznam nalog iz CRM kataloga.",
    category: "crm",
    estimatedDuration: "1 min",
    steps: [{ title: "Naloge", toolId: "crm.listOpenTasks", reason: "Odprte naloge.", estimatedTime: "1 min" }],
  },
  "search-documents": {
    type: "search-documents",
    title: "Išči dokumente",
    description: "Iskanje po dokumentnem adapterju.",
    category: "docs",
    estimatedDuration: "2 min",
    steps: [{ title: "Dokumenti", toolId: "document.search", reason: "Najdi dokumente.", estimatedTime: "2 min" }],
  },
  "summarize-document": {
    type: "summarize-document",
    title: "Povzetek dokumenta",
    description: "Povzetek prek document adapterja.",
    category: "docs",
    estimatedDuration: "2 min",
    steps: [{ title: "Povzetek", toolId: "document.summary", reason: "Povzetek vsebine.", estimatedTime: "2 min" }],
  },
  "link-artifact": {
    type: "link-artifact",
    title: "Poveži artifact",
    description: "Shrani datoteko in poveži z akcijo.",
    category: "docs",
    estimatedDuration: "2 min",
    steps: [{ title: "Datoteka", toolId: "file.linkArtifact", reason: "Storage adapter.", estimatedTime: "2 min" }],
  },
  "prepare-knowledge": {
    type: "prepare-knowledge",
    title: "Pripravi knowledge kontekst",
    description: "RAG priprava konteksta.",
    category: "docs",
    estimatedDuration: "2 min",
    steps: [
      { title: "Iskanje", toolId: "knowledge.search", reason: "Zbirke.", estimatedTime: "1 min" },
      { title: "Kontekst", toolId: "knowledge.prepareContext", reason: "Združen kontekst.", estimatedTime: "1 min" },
    ],
  },
  "prepare-notification": {
    type: "prepare-notification",
    title: "Pripravi obvestilo",
    description: "Osnutek obvestila. Pošiljanje zahteva odobritev.",
    category: "automation",
    estimatedDuration: "2 min",
    steps: [{ title: "Obvestilo", toolId: "notification.prepare", reason: "Samo priprava.", estimatedTime: "2 min" }],
  },
  "global-search": {
    type: "global-search",
    title: "Globalno iskanje",
    description: "CRM, dokumenti, ticketi, znanje, artifacti.",
    category: "docs",
    estimatedDuration: "2 min",
    steps: [{ title: "Iskanje", toolId: "search.global", reason: "Globalni search sloj.", estimatedTime: "2 min" }],
  },
  "list-activities": {
    type: "list-activities",
    title: "CRM aktivnosti",
    description: "Timeline in aktivnosti.",
    category: "crm",
    estimatedDuration: "1 min",
    steps: [{ title: "Aktivnosti", toolId: "crm.listActivities", reason: "Adapter CRM.", estimatedTime: "1 min" }],
  },
  "list-quotes": {
    type: "list-quotes",
    title: "CRM ponudbe",
    description: "Seznam ponudb.",
    category: "crm",
    estimatedDuration: "1 min",
    steps: [{ title: "Ponudbe", toolId: "crm.listQuotes", reason: "Adapter CRM.", estimatedTime: "1 min" }],
  },
  "read-document": {
    type: "read-document",
    title: "Preberi dokument",
    description: "Branje dokumenta.",
    category: "docs",
    estimatedDuration: "2 min",
    steps: [
      { title: "Branje", toolId: "document.read", reason: "Document adapter.", estimatedTime: "1 min" },
      { title: "Povzetek", toolId: "document.summary", reason: "Povzetek.", estimatedTime: "1 min" },
    ],
  },
  "resolve-artifact": {
    type: "resolve-artifact",
    title: "Razreši artifact",
    description: "Povezave artifacta.",
    category: "docs",
    estimatedDuration: "1 min",
    steps: [{ title: "Povezave", toolId: "artifact.resolve", reason: "Artifact registry.", estimatedTime: "1 min" }],
  },
};

export class Planner {
  constructor(private readonly policy: ApprovalPolicy = new DefaultApprovalPolicy()) {}

  detect(command: string): ActionType {
    const text = command.toLowerCase();
    if (text.includes("račun") || text.includes("racun") || text.includes("invoice")) return "create-invoice";
    if (text.includes("seznam ponud") || text.includes("list quote")) return "list-quotes";
    if (text.includes("ponudb") || text.includes("offer")) return "create-offer";
    if (text.includes("aktivnost") || text.includes("timeline")) return "list-activities";
    if ((text.includes("preberi") || text.includes("read")) && (text.includes("dokument") || text.includes("document"))) {
      return "read-document";
    }
    if (text.includes("resolve") && text.includes("artifact")) return "resolve-artifact";
    if (text.includes("global") || text.includes("išči vse") || text.includes("isci vse")) return "global-search";
    if (text.includes("obvest") || text.includes("notification") || text.includes("slack") || text.includes("teams")) {
      return "prepare-notification";
    }
    if (text.includes("artifact") || text.includes("datotek")) return "link-artifact";
    if (text.includes("povzet") || text.includes("summary")) return "summarize-document";
    if (text.includes("nalog")) return "list-open-tasks";
    if (text.includes("kontekst") || text.includes("preparecontext") || text.includes("rag")) return "prepare-knowledge";
    if ((text.includes("najdi") || text.includes("find")) && (text.includes("dokument") || text.includes("document"))) {
      return "search-documents";
    }
    if ((text.includes("najdi") || text.includes("find")) && (text.includes("stik") || text.includes("lead"))) {
      return "find-lead";
    }
    if ((text.includes("najdi") || text.includes("find")) && (text.includes("strank") || text.includes("client"))) {
      return "find-client";
    }
    if (text.includes("stik") || text.includes("lead")) return "create-lead";
    if (text.includes("strank") || text.includes("client")) return "create-client";
    if (text.includes("projekt")) return "create-project";
    if (text.includes("sql")) return "generate-sql";
    if (text.includes("api")) return "generate-api-spec";
    if (text.includes("diagram")) return "generate-diagram";
    if (text.includes("pdf")) return "generate-pdf";
    if (text.includes("dokument")) return "search-documents";
    if (text.includes("avtomat") || text.includes("workflow")) return "run-automation";
    if (text.includes("repo")) return "analyze-repository";
    if (text.includes("splet") || text.includes("website") || text.includes("audit")) return "analyze-website";
    if (text.includes("znanj") || text.includes("knowledge")) return "search-knowledge";
    return "search-knowledge";
  }

  planFromType(type: ActionType): Plan {
    const template = templates[type];
    const steps = template.steps.map((step, index) => {
      const requiresApproval = this.policy.requiresApproval(step.toolId, type);
      return {
        id: `step-${index + 1}`,
        title: step.title,
        toolId: step.toolId,
        artifactKind: step.artifactKind,
        reason: step.reason,
        estimatedTime: step.estimatedTime,
        requiresApproval,
        status: "Pending" as const,
      };
    });
    return {
      type,
      title: template.title,
      description: template.description,
      category: template.category,
      estimatedDuration: template.estimatedDuration,
      requiresApproval: steps.some((step) => step.requiresApproval),
      steps,
    };
  }

  plan(request: PlanRequest): Plan {
    return this.planFromType(request.type ?? this.detect(request.command));
  }
}
