import type {
  DelegationRecord,
  Goal,
  ReasoningTrace,
  RecoveryRecord,
  Reflection,
} from "./types";

export type ExecutionPhase = {
  id: string;
  label: "Planning" | "Searching" | "Creating" | "Generating" | "Approval" | "Finished";
  state: "done" | "current" | "todo";
};

export const mockGoal: Goal = {
  id: "goal-offer",
  title: "Create Offer",
  description: "Ponudba za AI CRM. Ukaz: Naredi ponudbo za AI CRM.",
  priority: "high",
  deadline: "2026-09-20",
  status: "WaitingApproval",
  owner: "u-admin",
  workspace: "sales",
  progress: 70,
  remaining: "E-pošta (odobritev)",
  eta: "18 min",
  command: "Naredi ponudbo za AI CRM",
  artifacts: ["art-pdf"],
  createdAt: "2026-09-15T15:00:00.000Z",
  updatedAt: "2026-09-15T15:18:00.000Z",
  history: [
    { at: "2026-09-15T15:00:00.000Z", text: "Cilj ustvarjen." },
    { at: "2026-09-15T15:18:00.000Z", text: "Čakanje na odobritev e-pošte." },
  ],
  steps: [
    {
      id: "gstep-1",
      title: "Analiza",
      skillId: "create-offer",
      delegate: "knowledge",
      status: "Completed",
      reasoning: {
        reason: "Najprej poiščemo kontekst izbora v knowledge.",
        confidence: 0.78,
        alternatives: ["Brez iskanja"],
        risks: ["Zbirke so mock."],
        estimatedTime: "4 min",
        dependencies: ["knowledge.search"],
      },
    },
    {
      id: "gstep-2",
      title: "CRM",
      skillId: "create-offer",
      delegate: "crm",
      status: "Completed",
      reasoning: {
        reason: "Ponudba potrebuje stranko.",
        confidence: 0.81,
        alternatives: ["Ročni vnos stranke"],
        risks: ["CRM je mock."],
        estimatedTime: "3 min",
        dependencies: ["crm.findClient"],
      },
    },
    {
      id: "gstep-3",
      title: "Ponudba",
      skillId: "create-offer",
      delegate: "sales",
      status: "Completed",
      reasoning: {
        reason: "Osnutek ponudbe iz konteksta.",
        confidence: 0.74,
        alternatives: ["Predloga Word"],
        risks: ["Cene niso izračunane."],
        estimatedTime: "5 min",
        dependencies: ["offer.generate"],
      },
    },
    {
      id: "gstep-4",
      title: "PDF",
      skillId: "create-offer",
      delegate: "sales",
      status: "Completed",
      reasoning: {
        reason: "Dokument za pregled pred pošiljanjem.",
        confidence: 0.8,
        alternatives: ["DOCX"],
        risks: ["Ni pravega PDF motorja."],
        estimatedTime: "3 min",
        dependencies: ["artifact.PDF"],
      },
    },
    {
      id: "gstep-5",
      title: "Email",
      skillId: "create-offer",
      delegate: "sales",
      status: "Blocked",
      reasoning: {
        reason: "Pošiljanje zahteva odobritev. Agent ne obide ApprovalEngine.",
        confidence: 0.9,
        alternatives: ["Samo osnutek"],
        risks: ["E-pošta ni priklopljena."],
        estimatedTime: "3 min",
        dependencies: ["email.send", "approval"],
      },
    },
  ],
};

export const mockReasoning: ReasoningTrace = mockGoal.steps[4]?.reasoning as ReasoningTrace;

export const mockExecution: ExecutionPhase[] = [
  { id: "p1", label: "Planning", state: "done" },
  { id: "p2", label: "Searching", state: "done" },
  { id: "p3", label: "Creating", state: "done" },
  { id: "p4", label: "Generating", state: "done" },
  { id: "p5", label: "Approval", state: "current" },
  { id: "p6", label: "Finished", state: "todo" },
];

export const mockReflection: Reflection = {
  id: "ref-offer",
  goalId: "goal-offer",
  stepId: "gstep-5",
  succeeded: "Analiza, CRM, ponudba in PDF so pripravljeni.",
  failed: "E-pošta čaka na odobritev.",
  improve: "Naslednjič predhodno uskladi prejemnika in odobritev.",
  continue: false,
  at: "2026-09-15T15:18:00.000Z",
};

export const mockRecovery: RecoveryRecord = {
  id: "rec-offer",
  goalId: "goal-offer",
  error: "E-pošta ni izvedena brez odobritve.",
  resolved: false,
  attempts: [
    { attempt: 1, strategy: "retry", note: "Ponovitev zadržana — gated orodje." },
    { attempt: 2, strategy: "manual-approval", note: "Fallback: čakanje na ApprovalEngine." },
  ],
};

export const mockDelegation: DelegationRecord = {
  id: "del-sales",
  goalId: "goal-offer",
  agent: "sales",
  task: "Priprava ponudbe AI CRM",
  status: "Running",
};
