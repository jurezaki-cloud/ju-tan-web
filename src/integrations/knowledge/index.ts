import type { KnowledgeAdapter, DocumentLookup, IntegrationAudit } from "@/src/types/integrations";
import type { KnowledgeChunk } from "@/src/ai/types/rag";
import { stamp } from "../audit";

export class MockKnowledgeAdapter implements KnowledgeAdapter {
  constructor(
    private readonly documents: DocumentLookup,
    private readonly audit: IntegrationAudit,
    private readonly extra: KnowledgeChunk[] = [],
  ) {}

  private corpus(): KnowledgeChunk[] {
    const fromDocs = this.documents.list().map((item) => ({
      id: item.id,
      collection: item.folder.toLowerCase(),
      text: `${item.name} ${item.clientName} ${item.kind}`,
    }));
    return [...fromDocs, ...this.extra];
  }

  search(query: string, collection?: string): KnowledgeChunk[] {
    const q = query.toLowerCase();
    const rows = this.corpus().filter((item) => {
      const inCollection = collection ? item.collection === collection : true;
      return inCollection && (item.text.toLowerCase().includes(q) || q.length === 0);
    });
    this.audit.record(stamp("KnowledgeFetched", { query, count: rows.length }));
    return this.rank(query, rows);
  }

  collect(query: string, collections: string[]): KnowledgeChunk[] {
    if (collections.length === 0) return this.search(query);
    return collections.flatMap((collection) => this.search(query, collection));
  }

  rank(query: string, chunks: KnowledgeChunk[]): KnowledgeChunk[] {
    const q = query.toLowerCase();
    return [...chunks]
      .map((chunk) => ({ ...chunk, score: chunk.text.toLowerCase().includes(q) ? 1 : 0.2 }))
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }

  prepareContext(query: string, collections?: string[]): string {
    const chunks = collections ? this.collect(query, collections) : this.search(query);
    return chunks.map((chunk) => `[${chunk.collection}:${chunk.id}] ${chunk.text}`).join("\n");
  }
}

export class KnowledgeCollector {
  constructor(private readonly knowledge: KnowledgeAdapter) {}

  from(query: string, collections: string[]) {
    return this.knowledge.collect(query, collections);
  }
}

export class KnowledgeContextBuilder {
  constructor(private readonly knowledge: KnowledgeAdapter) {}

  build(query: string, collections?: string[]) {
    return this.knowledge.prepareContext(query, collections);
  }
}

export class KnowledgeRetriever {
  constructor(private readonly knowledge: KnowledgeAdapter) {}

  retrieve(query: string) {
    return this.knowledge.search(query);
  }
}

export class KnowledgeRanker {
  constructor(private readonly knowledge: KnowledgeAdapter) {}

  rank(query: string, chunks: KnowledgeChunk[]) {
    return this.knowledge.rank(query, chunks);
  }
}

export class RagPipeline {
  constructor(private readonly knowledge: KnowledgeAdapter) {}

  run(query: string, collections?: string[]) {
    const retrieved = collections ? this.knowledge.collect(query, collections) : this.knowledge.search(query);
    const ranked = this.knowledge.rank(query, retrieved);
    const merged = ranked.map((chunk) => `[${chunk.collection}:${chunk.id}] ${chunk.text}`).join("\n");
    return { retrieved, ranked, merged };
  }
}
