import type {
  EmbeddingProvider,
  KnowledgeChunk,
  KnowledgeProvider,
  ReRanker,
  Retriever,
  VectorStore,
} from "@/src/ai/types/rag";
import type { KnowledgeMemory } from "@/src/ai/types/memory";

export class MockEmbeddingProvider implements EmbeddingProvider {
  async embed(texts: string[]): Promise<number[][]> {
    return texts.map((text) =>
      Array.from({ length: 8 }, (_, index) => ((text.charCodeAt(index % Math.max(text.length, 1)) || 0) % 13) / 13),
    );
  }
}

export class MockVectorStore implements VectorStore {
  constructor(private readonly rows = new Map<string, { vector: number[]; metadata: Record<string, unknown> }>()) {}

  async upsert(id: string, vector: number[], metadata: Record<string, unknown>): Promise<void> {
    this.rows.set(id, { vector, metadata });
  }

  async query(vector: number[], limit: number): Promise<{ id: string; score: number }[]> {
    const scored = [...this.rows.entries()].map(([id, row]) => {
      const score = row.vector.reduce((sum, value, index) => sum + value * (vector[index] ?? 0), 0);
      return { id, score };
    });
    return scored.sort((a, b) => b.score - a.score).slice(0, limit);
  }
}

export class MockRetriever implements Retriever {
  constructor(private readonly knowledge: KnowledgeMemory) {}

  async retrieve(query: string, limit = 5): Promise<KnowledgeChunk[]> {
    const collections = ["docs", "crm", "erp", "api"];
    const items: KnowledgeChunk[] = [];
    for (const collection of collections) {
      const listed = await this.knowledge.list(collection);
      for (const item of listed) {
        if (item.text.toLowerCase().includes(query.toLowerCase()) || query.length === 0) {
          items.push({ id: item.id, collection, text: item.text });
        }
      }
    }
    return items.slice(0, limit);
  }
}

export class MockReRanker implements ReRanker {
  async rerank(query: string, chunks: KnowledgeChunk[]): Promise<KnowledgeChunk[]> {
    const q = query.toLowerCase();
    return [...chunks]
      .map((chunk) => ({
        ...chunk,
        score: chunk.text.toLowerCase().includes(q) ? 1 : 0.1,
      }))
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }
}

export class DefaultKnowledgeProvider implements KnowledgeProvider {
  constructor(
    private readonly retriever: Retriever,
    private readonly reranker: ReRanker,
    private readonly knowledge: KnowledgeMemory,
  ) {}

  async search(query: string, collection?: string): Promise<KnowledgeChunk[]> {
    const chunks = await this.retriever.retrieve(query, 12);
    const filtered = collection ? chunks.filter((chunk) => chunk.collection === collection) : chunks;
    return this.rank(query, filtered);
  }

  async retrieve(id: string): Promise<KnowledgeChunk | undefined> {
    for (const collection of ["docs", "crm", "erp", "api"]) {
      const listed = await this.knowledge.list(collection);
      const hit = listed.find((item) => item.id === id);
      if (hit) return { id: hit.id, collection, text: hit.text };
    }
    return undefined;
  }

  async rank(query: string, chunks: KnowledgeChunk[]): Promise<KnowledgeChunk[]> {
    return this.reranker.rerank(query, chunks);
  }

  async prepareContext(query: string, collection?: string): Promise<string> {
    const chunks = await this.search(query, collection);
    if (chunks.length === 0) return "";
    return chunks.map((chunk) => `[${chunk.collection}:${chunk.id}] ${chunk.text}`).join("\n");
  }
}
