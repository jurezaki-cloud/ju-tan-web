import { detectFlow, flowCatalog, formatFlowSummary } from "./configurators";
import { replyToMessage } from "./knowledge";
import type { ChatFlow, ChatMessage, PersistedChat } from "./types";

export function currentOptions(flow: ChatFlow | null) {
  if (!flow) return [];
  return flowCatalog[flow.id].questions[flow.step]?.options ?? [];
}

/** Obdela uporabnikov vnos: konfigurator ali običajen odgovor. */
export function handleUserTurn(
  state: PersistedChat,
  input: string,
): { next: PersistedChat; delayReply: ChatMessage } {
  const text = input.trim();
  const userMessage: ChatMessage = { role: "user", text };
  const messages = [...state.messages, userMessage];
  const started = detectFlow(text);
  const lower = text.toLowerCase();
  const wantsContact =
    lower.includes("kontakt") ||
    lower.includes("telefon") ||
    lower.includes("povpraš");

  if (wantsContact && !started) {
    return {
      next: { messages, flow: null },
      delayReply: { role: "assistant", text: replyToMessage(text) },
    };
  }

  if (started && (!state.flow || state.flow.id !== started)) {
    return startFlow(messages, started);
  }

  if (state.flow) {
    return continueFlow({ ...state, messages }, text);
  }

  return {
    next: { messages, flow: null },
    delayReply: { role: "assistant", text: replyToMessage(text) },
  };
}

function startFlow(
  messages: ChatMessage[],
  flowId: NonNullable<ReturnType<typeof detectFlow>>,
) {
  const first = flowCatalog[flowId].questions[0];
  const flow: ChatFlow = { id: flowId, step: 0, answers: {} };
  return {
    next: { messages, flow },
    delayReply: {
      role: "assistant" as const,
      text: `Pripravimo predlog za: ${flowCatalog[flowId].title}.\n\n${first.prompt}`,
    },
  };
}

function continueFlow(state: PersistedChat, answer: string): {
  next: PersistedChat;
  delayReply: ChatMessage;
} {
  const flow = state.flow;
  if (!flow) {
    return {
      next: state,
      delayReply: { role: "assistant", text: replyToMessage(answer) },
    };
  }

  const questions = flowCatalog[flow.id].questions;
  const current = questions[flow.step];
  const answers = { ...flow.answers, [current.id]: answer };
  const nextStep = flow.step + 1;

  if (nextStep >= questions.length) {
    return {
      next: { messages: state.messages, flow: null },
      delayReply: {
        role: "assistant",
        text: formatFlowSummary(flow.id, answers),
      },
    };
  }

  return {
    next: {
      messages: state.messages,
      flow: { ...flow, step: nextStep, answers },
    },
    delayReply: {
      role: "assistant",
      text: questions[nextStep].prompt,
    },
  };
}
