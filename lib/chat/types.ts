/** Tipi sporočil in konfiguratorjev JU-TAN AI. */

export type ChatRole = "assistant" | "user";

export type ChatMessage = {
  role: ChatRole;
  text: string;
};

export type FlowId = "website" | "software" | "mobile";

export type FlowQuestion = {
  id: string;
  prompt: string;
  options?: string[];
};

export type ChatFlow = {
  id: FlowId;
  step: number;
  answers: Record<string, string>;
};

export type PersistedChat = {
  messages: ChatMessage[];
  flow: ChatFlow | null;
};
