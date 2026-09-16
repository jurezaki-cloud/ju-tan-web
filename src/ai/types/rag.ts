export type KnowledgeChunk = {
  id: string;
  collection: string;
  text: string;
  score?: number;
};

export interface KnowledgeProvider {
  search(query: string, collection?: string): Promise<KnowledgeChunk[]>;
  retrieve(id: string): Promise<KnowledgeChunk | undefined>;
  rank(query: string, chunks: KnowledgeChunk[]): Promise<KnowledgeChunk[]>;
  prepareContext(query: string, collection?: string): Promise<string>;
}

export interface EmbeddingProvider {
  embed(texts: string[]): Promise<number[][]>;
}

export interface VectorStore {
  upsert(id: string, vector: number[], metadata: Record<string, unknown>): Promise<void>;
  query(vector: number[], limit: number): Promise<{ id: string; score: number }[]>;
}

export interface Retriever {
  retrieve(query: string, limit?: number): Promise<KnowledgeChunk[]>;
}

export interface ReRanker {
  rerank(query: string, chunks: KnowledgeChunk[]): Promise<KnowledgeChunk[]>;
}
