"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  clearPersistedChat,
  currentOptions,
  getChatServerSnapshot,
  getChatSnapshot,
  handleUserTurn,
  publishChat,
  subscribeChatStore,
  type PersistedChat,
} from "@/lib/chat";

const emptySubscribe = () => () => undefined;

type ChatContextValue = {
  open: boolean;
  typing: boolean;
  input: string;
  persisted: PersistedChat;
  options: string[];
  setOpen: (open: boolean) => void;
  setInput: (value: string) => void;
  send: (text: string) => void;
  clear: () => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(
    subscribeChatStore,
    getChatSnapshot,
    getChatServerSnapshot,
  );
  const persisted = JSON.parse(raw) as PersistedChat;
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");

  const send = useCallback(
    (text: string) => {
      const value = text.trim();
      if (!value || typing) return;

      const { next, delayReply } = handleUserTurn(persisted, value);
      setInput("");
      publishChat(next);
      setTyping(true);

      window.setTimeout(() => {
        publishChat({
          ...next,
          messages: [...next.messages, delayReply],
        });
        setTyping(false);
      }, 720);
    },
    [persisted, typing],
  );

  const clear = useCallback(() => {
    setTyping(false);
    clearPersistedChat();
  }, []);

  const value = useMemo(
    () => ({
      open,
      typing,
      input,
      persisted,
      options: currentOptions(persisted.flow),
      setOpen,
      setInput,
      send,
      clear,
    }),
    [open, typing, input, persisted, send, clear],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const value = useContext(ChatContext);
  if (!value) {
    throw new Error("useChat mora biti znotraj ChatProvider.");
  }
  return value;
}

export function useChatMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}
