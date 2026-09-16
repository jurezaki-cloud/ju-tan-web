export interface Conversation {
  id: string;
  topic: string;
  resolved: boolean;
  started: string;
}

export interface ConversationStat {
  question: string;
  count: number;
}
