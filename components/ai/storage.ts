import { welcomeMessage, type AgentMessage } from "./content";

const KEY = "jutan-ai-agent";
const EVENT = "jutan-agent-history";

export type AgentState = {
  messages: AgentMessage[];
  showForm: boolean;
};

export const emptyAgentState: AgentState = {
  messages: [welcomeMessage],
  showForm: false,
};

export function readAgentState(): AgentState {
  if (typeof window === "undefined") return emptyAgentState;

  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyAgentState;
    const parsed = JSON.parse(raw) as AgentState;
    if (!parsed?.messages?.length) return emptyAgentState;
    return {
      showForm: Boolean(parsed.showForm),
      messages: parsed.messages.filter(
        (item) =>
          item &&
          typeof item.text === "string" &&
          (item.role === "assistant" || item.role === "user"),
      ),
    };
  } catch {
    return emptyAgentState;
  }
}

export function subscribeAgentHistory(onChange: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

export function getAgentSnapshot() {
  return JSON.stringify(readAgentState());
}

export function getAgentServerSnapshot() {
  return JSON.stringify(emptyAgentState);
}

export function publishAgentState(state: AgentState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
  window.dispatchEvent(new Event(EVENT));
}

export function clearAgentHistory() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
}
