import "server-only";
import { createCipheriv, createDecipheriv, randomBytes, createHash } from "node:crypto";
import { get, put, list } from "@vercel/blob";
import type { InboxStore } from "./contact-inbox-core";

export function inboxConfigHash() {
  return createHash("sha256").update(JSON.stringify(["contact-v1", process.env.EMAIL_FROM || process.env.FROM_EMAIL, process.env.CONTACT_EMAIL_TO])).digest("hex");
}
export function privateInbox(): InboxStore {
  const token = process.env.CONTACT_INBOX_BLOB_TOKEN;
  const encoded = process.env.CONTACT_INBOX_ENCRYPTION_KEY;
  if (!token || !encoded || !/^[a-f0-9]{64}$/i.test(encoded)) throw new Error("contact-inbox-unconfigured");
  if (token === process.env.BLOB_READ_WRITE_TOKEN) throw new Error("contact-inbox-must-use-independent-store");
  const key = Buffer.from(encoded, "hex");
  const prefix = "contact-inbox-v1/";
  const read = async <T>(path: string): Promise<T | null> => {
    const response = await get(prefix + path, { access: "private", token, useCache: false });
    if (!response) return null;
    if (response.statusCode !== 200 || !response.stream) throw new Error("inbox-read-unconfirmed");
    const envelope = JSON.parse(await new Response(response.stream).text()) as { iv: string; tag: string; data: string };
    const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(envelope.iv, "base64"));
    decipher.setAAD(Buffer.from(prefix + path));
    decipher.setAuthTag(Buffer.from(envelope.tag, "base64"));
    const plain = Buffer.concat([decipher.update(Buffer.from(envelope.data, "base64")), decipher.final()]);
    return JSON.parse(plain.toString("utf8")) as T;
  };
  return {
    read,
    async create<T>(path: string, value: T): Promise<T> {
      const iv = randomBytes(12);
      const cipher = createCipheriv("aes-256-gcm", key, iv);
      cipher.setAAD(Buffer.from(prefix + path));
      const data = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
      const envelope = JSON.stringify({ iv: iv.toString("base64"), tag: cipher.getAuthTag().toString("base64"), data: data.toString("base64") });
      try {
        await put(prefix + path, envelope, { access: "private", token, addRandomSuffix: false, allowOverwrite: false, contentType: "application/json" });
      } catch (error) {
        const existing = await read<T>(path);
        if (existing === null) throw error;
        return existing;
      }
      return value;
    },
    async paths(namespace = "intents/") {
      if (!/^(intents\/|daily\/|runs\/)[a-zA-Z0-9/_.-]*$/.test(namespace) || namespace.includes("..")) throw new Error("invalid-inbox-namespace");
      const paths: string[] = [];
      let cursor: string | undefined;
      do {
        const page = await list({ token, prefix: prefix + namespace, cursor, limit: 1000 });
        paths.push(...page.blobs.map(blob => blob.pathname.slice(prefix.length)));
        cursor = page.hasMore ? page.cursor : undefined;
      } while (cursor);
      return paths;
    },
  };
}
