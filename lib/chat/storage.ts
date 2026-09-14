import { welcomeText } from "./knowledge";
import type { ChatMessage, PersistedChat } from "./types";

export const CHAT_STORAGE_KEY = "jutan-ai-state";

export const welcomeMessage: ChatMessage = {
  role: "assistant",
  text: welcomeText,
};

export const emptyChat: PersistedChat = {
  messages: [welcomeMessage],
  flow: null,
};

export function readPersistedChat(): PersistedChat {
  if (typeof window === "undefined") return emptyChat;

  try {
    const raw = window.localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return emptyChat;

    const parsed = JSON.parse(raw) as PersistedChat;
    if (!parsed || !Array.isArray(parsed.messages) || parsed.messages.length === 0) {
      return emptyChat;
    }

    return {
      messages: parsed.messages.filter(
        (item) =>
          item &&
          (item.role === "assistant" || item.role === "user") &&
          typeof item.text === "string",
      ),
      flow: parsed.flow ?? null,
    };
  } catch {
    return emptyChat;
  }
}

export function writePersistedChat(state: PersistedChat) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(state));
}

export function subscribeChatStore(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => undefined;

  window.addEventListener("storage", onStoreChange);
  window.addEventListener("jutan-ai-state", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("jutan-ai-state", onStoreChange);
  };
}

export function getChatSnapshot() {
  return JSON.stringify(readPersistedChat());
}

export function getChatServerSnapshot() {
  return JSON.stringify(emptyChat);
}

export function publishChat(state: PersistedChat) {
  writePersistedChat(state);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("jutan-ai-state"));
  }
}

export function clearPersistedChat() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CHAT_STORAGE_KEY);
  window.dispatchEvent(new Event("jutan-ai-state"));
}
