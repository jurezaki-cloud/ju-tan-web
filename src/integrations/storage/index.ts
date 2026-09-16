import type {
  FileMetadata,
  SignedArtifactRef,
  StorageAdapter,
  IntegrationAudit,
} from "@/src/types/integrations";
import { stamp } from "../audit";
import type { IntegrationPolicy } from "../policies";

export class MockStorageAdapter implements StorageAdapter {
  constructor(
    private readonly files = new Map<string, { meta: FileMetadata; content: string }>(),
    private seq = 0,
  ) {}

  put(name: string, content: string, mime: string): FileMetadata {
    const id = `file-${++this.seq}`;
    const meta: FileMetadata = {
      id,
      name,
      mime,
      size: content.length,
      storedAt: new Date().toISOString(),
    };
    this.files.set(id, { meta, content });
    return { ...meta };
  }

  get(id: string) {
    const row = this.files.get(id);
    return row ? { meta: { ...row.meta }, content: row.content } : undefined;
  }
}

export class FileResolver {
  constructor(private readonly storage: StorageAdapter) {}

  resolve(id: string) {
    return this.storage.get(id);
  }
}

export class FileLinkService {
  constructor(
    private readonly storage: StorageAdapter,
    private readonly audit: IntegrationAudit,
    private readonly policy: IntegrationPolicy,
  ) {}

  linkArtifact(name: string, content: string, mime: string, actionId?: string) {
    const meta = this.storage.put(name, content, mime);
    this.audit.record(stamp("ArtifactStored", { fileId: meta.id, actionId }));
    return meta;
  }

  delete(): never {
    throw new Error(this.policy.allowFileDelete() ? "Brisanje ni na voljo." : "AI ne sme brisati datotek.");
  }
}

export class SignedArtifactService {
  sign(fileId: string, ttlMs = 15 * 60 * 1000): SignedArtifactRef {
    const expiresAt = new Date(Date.now() + ttlMs).toISOString();
    return { fileId, token: `mock-sign.${fileId}.${Date.parse(expiresAt)}`, expiresAt };
  }
}

export type FutureObjectStore = "s3" | "azure-blob" | "minio";

export interface ObjectStoreAdapter extends StorageAdapter {
  readonly provider: FutureObjectStore;
}
