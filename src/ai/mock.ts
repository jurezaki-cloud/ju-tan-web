import type {
  AiActivityItem,
  AiArtifact,
  AiContext,
  AiMessage,
  KnowledgeItem,
  QuickAction,
  Suggestion,
  Workflow,
} from "./types";

export const workspaceContext: AiContext = {
  project: "ERP dokumenti",
  client: "Stranka 01",
  attachments: ["Pogodba-razvoj-2026.pdf", "API-specifikacija.docx"],
  history: [
    "Pregled obsega CRM pipeline",
    "Osnutek ponudbe za portal",
    "API tok med CRM in ERP",
  ],
};

export const workspaceActivity: AiActivityItem[] = [
  { id: "act-01", time: "15:12", text: "Generiran osnutek ponudbe PDF." },
  { id: "act-02", time: "14:58", text: "CRM: predlagan naslednji stik." },
  { id: "act-03", time: "14:40", text: "ERP: uskladitev dokumentov." },
  { id: "act-04", time: "14:22", text: "Workflow Nova ponudba — korak Analiza." },
  { id: "act-05", time: "13:51", text: "Knowledge: odprt API zapis." },
  { id: "act-06", time: "13:20", text: "SQL izvoz stikov pripravljen." },
  { id: "act-07", time: "12:44", text: "Developer AI: OpenAPI osnutek." },
  { id: "act-08", time: "11:30", text: "Projekt: posodobljen rok uvedbe." },
  { id: "act-09", time: "10:18", text: "Avtomatizacija: ticket triaža." },
  { id: "act-10", time: "09:05", text: "Povzetek sestanka shranjen." },
];

export const quickActions: QuickAction[] = [
  {
    id: "offer",
    title: "Ustvari ponudbo",
    description: "Osnutek ponudbe iz konteksta stranke.",
    workspace: "sales",
    conversationId: "offer",
  },
  {
    id: "company",
    title: "Analiziraj podjetje",
    description: "Pregled stikov, projektov in tveganj.",
    workspace: "crm",
    conversationId: "company",
  },
  {
    id: "crm",
    title: "CRM pomočnik",
    description: "Pipeline, stiki, naslednji korak.",
    workspace: "crm",
    conversationId: "crm",
  },
  {
    id: "erp",
    title: "ERP pomočnik",
    description: "Dokumenti in interni procesi.",
    workspace: "erp",
    conversationId: "erp",
  },
  {
    id: "project",
    title: "Projekt",
    description: "Obseg, napredek in naloge.",
    workspace: "project",
    conversationId: "project",
  },
  {
    id: "docs",
    title: "Dokumentacija",
    description: "Iskanje v knowledge base.",
    workspace: "knowledge",
    conversationId: "docs",
  },
  {
    id: "api",
    title: "API Integracija",
    description: "Specifikacija vmesnikov.",
    workspace: "developer",
    conversationId: "api",
  },
  {
    id: "auto",
    title: "Avtomatizacija",
    description: "Tok od dogodka do dejanja.",
    workspace: "automation",
    conversationId: "auto",
  },
  {
    id: "web",
    title: "Analiza spletne strani",
    description: "Struktura, CTA, vsebina.",
    workspace: "chat",
    conversationId: "web",
  },
  {
    id: "code",
    title: "Analiza kode",
    description: "Pregled modula brez izvajanja.",
    workspace: "developer",
    conversationId: "code",
  },
];

export const suggestions: Suggestion[] = [
  { id: "s1", label: "Nadaljuj projekt", href: "/ai?ws=project&c=project" },
  { id: "s2", label: "Ustvari ponudbo", href: "/ai?ws=sales&c=offer" },
  { id: "s3", label: "Povzemi sestanek", href: "/ai?ws=chat&c=meeting" },
  { id: "s4", label: "Analiziraj CRM", href: "/ai?ws=crm&c=crm" },
];

export const knowledgeItems: KnowledgeItem[] = [
  {
    id: "k-crm",
    title: "CRM",
    collection: "crm",
    summary: "Stiki, priložnosti in zgodovina komunikacije.",
  },
  {
    id: "k-erp",
    title: "ERP",
    collection: "erp",
    summary: "Dokumenti, zaloga in interni moduli.",
  },
  {
    id: "k-ai",
    title: "AI",
    collection: "docs",
    summary: "Agenti, tokovi in pravila predaje operaterju.",
  },
  {
    id: "k-api",
    title: "API",
    collection: "api",
    summary: "Vmesniki, verzije in avtentikacija.",
  },
  {
    id: "k-int",
    title: "Integracije",
    collection: "integrations",
    summary: "CRM, ERP, računovodstvo, e-pošta.",
  },
  {
    id: "k-doc",
    title: "Dokumentacija",
    collection: "docs",
    summary: "Obseg, specifikacije in uvedba.",
  },
];

export const offerWorkflow: Workflow = {
  id: "wf-offer",
  title: "Nova ponudba",
  steps: [
    { id: "w1", label: "Analiza" },
    { id: "w2", label: "Projekt" },
    { id: "w3", label: "CRM" },
    { id: "w4", label: "PDF" },
    { id: "w5", label: "Email" },
  ],
};

export const artifacts: AiArtifact[] = [
  {
    id: "art-pdf",
    kind: "PDF",
    title: "Ponudba-2026-014.pdf",
    summary: "Osnutek ponudbe za Stranko 01.",
  },
  {
    id: "art-word",
    kind: "Word",
    title: "Obseg-ERP.docx",
    summary: "Pisni obseg modulov.",
  },
  {
    id: "art-xls",
    kind: "Excel",
    title: "Pipeline.xlsx",
    summary: "CRM priložnosti, demo izvoz.",
  },
  {
    id: "art-md",
    kind: "Markdown",
    title: "povzetek-sestanka.md",
    summary: "Točke in naslednji koraki.",
  },
  {
    id: "art-json",
    kind: "JSON",
    title: "client-cl-01.json",
    summary: "Struktura zapisa stranke.",
  },
  {
    id: "art-sql",
    kind: "SQL",
    title: "export-leads.sql",
    summary: "Izvoz stikov, samo osnutek.",
  },
  {
    id: "art-api",
    kind: "API Spec",
    title: "openapi-crm.yaml",
    summary: "Osnutek OpenAPI za CRM.",
  },
  {
    id: "art-dia",
    kind: "Diagram",
    title: "tok-ponudbe.mmd",
    summary: "Analiza → CRM → PDF → Email.",
  },
];

const assistant = (partial: Omit<AiMessage, "role">): AiMessage => ({
  role: "assistant",
  ...partial,
});

const user = (partial: Omit<AiMessage, "role" | "kind" | "status">): AiMessage => ({
  role: "user",
  kind: "text",
  status: "Completed",
  ...partial,
});

export const conversations: Record<string, AiMessage[]> = {
  offer: [
    user({
      id: "m1",
      time: "14:10",
      body: "Pripravi ponudbo za aktivno stranko.",
    }),
    assistant({
      id: "m2",
      time: "14:10",
      status: "Completed",
      kind: "markdown",
      body: "Osnutek za **Stranko 01**, projekt ERP dokumenti.\n\nObseg: moduli dokumentov, zaloga, API na računovodstvo.",
    }),
    assistant({
      id: "m3",
      time: "14:11",
      status: "Completed",
      kind: "table",
      body: "Postavke",
      table: {
        headers: ["Postavka", "Obseg", "Ocena"],
        rows: [
          ["Analiza", "1 teden", "2.400 €"],
          ["Razvoj", "6 tednov", "18.000 €"],
          ["Uvedba", "1 teden", "2.200 €"],
        ],
      },
    }),
    assistant({
      id: "m4",
      time: "14:11",
      status: "Completed",
      kind: "artifact",
      body: "Datoteka je pripravljena za pregled.",
      artifact: artifacts[0],
    }),
  ],
  company: [
    user({ id: "m1", time: "13:40", body: "Analiziraj aktivno podjetje." }),
    assistant({
      id: "m2",
      time: "13:40",
      status: "Completed",
      kind: "success",
      body: "Stranka 01: 2 aktivna projekta, zadnji stik 14. 9. 2026. Ni odprtih visokih ticketov na ERP dokumentih.",
    }),
    assistant({
      id: "m3",
      time: "13:41",
      status: "Completed",
      kind: "warning",
      body: "API integracija ima rok 22. 11. — preverite odvisnost od računovodstva.",
    }),
  ],
  crm: [
    user({ id: "m1", time: "11:20", body: "Kaj je naslednji korak v CRM?" }),
    assistant({
      id: "m2",
      time: "11:20",
      status: "Completed",
      kind: "table",
      body: "Odprti stiki",
      table: {
        headers: ["Stik", "Status", "Zadnji stik"],
        rows: [
          ["Kontakt 02", "Novo", "10. 9. 2026"],
          ["Kontakt 06", "Novo", "5. 9. 2026"],
        ],
      },
    }),
  ],
  erp: [
    user({ id: "m1", time: "10:05", body: "Kje so dokumenti za ERP?" }),
    assistant({
      id: "m2",
      time: "10:05",
      status: "Completed",
      kind: "text",
      body: "V mapi Specifikacije: ERP-moduli.docx. V mapi Pogodbe: Pogodba-razvoj-2026.pdf.",
    }),
    assistant({
      id: "m3",
      time: "10:06",
      status: "Completed",
      kind: "artifact",
      body: "Povezava na obseg.",
      artifact: artifacts[1],
    }),
  ],
  project: [
    user({ id: "m1", time: "09:50", body: "Nadaljuj projekt ERP dokumenti." }),
    assistant({
      id: "m2",
      time: "09:50",
      status: "Completed",
      kind: "markdown",
      body: "Napredek **62 %**. Odgovorna oseba: Razvoj. Rok: 30. 10. 2026.\n\nNaslednji korak: testno okolje pred uvedbo.",
    }),
  ],
  docs: [
    user({ id: "m1", time: "09:12", body: "Poišči dokumentacijo za API." }),
    assistant({
      id: "m2",
      time: "09:12",
      status: "Completed",
      kind: "text",
      body: "Zbirka api: verzije vmesnikov, avtentikacija, CRM in ERP endpointi. Backend še ni priklopljen — to je knowledge kartica.",
    }),
  ],
  api: [
    user({ id: "m1", time: "16:02", body: "Pripravi API specifikacijo za CRM." }),
    assistant({
      id: "m2",
      time: "16:02",
      status: "Completed",
      kind: "code",
      body: "Osnutek OpenAPI (mock).",
      code: {
        language: "yaml",
        content: "openapi: 3.0.3\ninfo:\n  title: JU-TAN CRM\n  version: 0.1.0\npaths:\n  /leads:\n    get:\n      summary: Seznam stikov",
      },
    }),
    assistant({
      id: "m3",
      time: "16:03",
      status: "Completed",
      kind: "artifact",
      body: "Specifikacija kot artifact.",
      artifact: artifacts[6],
    }),
  ],
  auto: [
    user({ id: "m1", time: "08:30", body: "Pokaži tok nove ponudbe." }),
    assistant({
      id: "m2",
      time: "08:30",
      status: "Completed",
      kind: "text",
      body: "Workflow je v zavihku Automation: Analiza → Projekt → CRM → PDF → Email.",
    }),
    assistant({
      id: "m3",
      time: "08:31",
      status: "Completed",
      kind: "artifact",
      body: "Diagram toka.",
      artifact: artifacts[7],
    }),
  ],
  web: [
    user({ id: "m1", time: "17:10", body: "Analiziraj predstavitveno stran." }),
    assistant({
      id: "m2",
      time: "17:10",
      status: "Completed",
      kind: "markdown",
      body: "Hero pove **kaj / za koga / CTA**. Storitve so razdeljene po poslovnih področjih. To ni sprememba produkcijske strani — samo branje strukture.",
    }),
  ],
  code: [
    user({ id: "m1", time: "18:00", body: "Preglej repository sloj." }),
    assistant({
      id: "m2",
      time: "18:00",
      status: "Completed",
      kind: "code",
      body: "Vzorčni klic (mock, se ne izvede).",
      code: {
        language: "ts",
        content: "export async function getClients() {\n  return clientService.list();\n}",
      },
    }),
    assistant({
      id: "m3",
      time: "18:01",
      status: "Completed",
      kind: "success",
      body: "Sloj je ločen: UI → API → service → repository. Priklop modela ne spremeni tega zaslona.",
    }),
  ],
  meeting: [
    user({ id: "m1", time: "12:00", body: "Povzemi zadnji sestanek." }),
    assistant({
      id: "m2",
      time: "12:00",
      status: "Completed",
      kind: "markdown",
      body: "**Sklep:** testno okolje pred uvedbo ERP.\n\n**Naloga:** uskladitev obsega CRM pipeline do 16. 9.",
    }),
    assistant({
      id: "m3",
      time: "12:01",
      status: "Completed",
      kind: "artifact",
      body: "Povzetek kot Markdown.",
      artifact: artifacts[3],
    }),
  ],
};

export function getConversation(id: string | undefined): AiMessage[] | null {
  if (!id) return null;
  return conversations[id] ?? null;
}
