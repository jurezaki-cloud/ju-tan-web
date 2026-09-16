import type { ArtifactLink, ArtifactRef, ArtifactReference, IntegrationAudit } from "@/src/types/integrations";
import { stamp } from "../audit";

export class ArtifactRegistry {
  constructor(
    private readonly links: ArtifactLink[] = [],
    private readonly refs = new Map<string, ArtifactRef>(),
  ) {}

  link(link: ArtifactLink): ArtifactLink {
    this.links.push({ ...link });
    return { ...link };
  }

  resolve(artifactId: string): ArtifactLink[] {
    return this.links.filter((item) => item.artifactId === artifactId).map((item) => ({ ...item }));
  }

  resolveBy(filter: Partial<ArtifactLink>): ArtifactLink[] {
    return this.links.filter((item) => {
      return (Object.keys(filter) as (keyof ArtifactLink)[]).every((key) => !filter[key] || item[key] === filter[key]);
    });
  }

  store(ref: ArtifactRef): ArtifactRef {
    this.refs.set(ref.id, { ...ref });
    return { ...ref };
  }

  get(id: string): ArtifactRef | undefined {
    const row = this.refs.get(id);
    return row ? { ...row } : undefined;
  }

  list(): ArtifactRef[] {
    return [...this.refs.values()].map((item) => ({ ...item }));
  }

  reference(artifactId: string): ArtifactReference | undefined {
    const ref = this.get(artifactId);
    if (!ref) return undefined;
    return { ...ref, links: this.resolve(artifactId) };
  }
}

export class ArtifactResolver {
  constructor(private readonly registry: ArtifactRegistry) {}

  byArtifact(id: string) {
    return this.registry.resolve(id);
  }

  byClient(clientId: string) {
    return this.registry.resolveBy({ clientId });
  }

  byDocument(documentId: string) {
    return this.registry.resolveBy({ documentId });
  }

  reference(id: string) {
    return this.registry.reference(id);
  }
}

export class AuditedArtifactRegistry {
  constructor(
    private readonly registry: ArtifactRegistry,
    private readonly audit: IntegrationAudit,
  ) {}

  link(link: ArtifactLink) {
    const saved = this.registry.link(link);
    this.audit.record(stamp("ArtifactLinked", { artifactId: link.artifactId, documentId: link.documentId, actionId: link.actionId }));
    return saved;
  }

  resolve(artifactId: string) {
    return this.registry.resolve(artifactId);
  }

  store(ref: ArtifactRef) {
    const saved = this.registry.store(ref);
    this.audit.record(stamp("ArtifactStored", { id: ref.id }));
    return saved;
  }

  reference(artifactId: string) {
    return this.registry.reference(artifactId);
  }

  list() {
    return this.registry.list();
  }
}
