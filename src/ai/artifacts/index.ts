import { ValidationError } from "@/src/ai/types/errors";
import type { ArtifactFormat, ArtifactRecord } from "@/src/ai/types/artifact";

const mime: Record<ArtifactFormat, string> = {
  PDF: "application/pdf",
  DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  MD: "text/markdown",
  JSON: "application/json",
  SQL: "application/sql",
  API: "application/json",
  Diagram: "text/plain",
};

function serialize(format: ArtifactFormat, payload: unknown): string {
  if (typeof payload === "string") return payload;
  if (format === "JSON" || format === "API") return JSON.stringify(payload, null, 2);
  return String(payload);
}

const formats = new Set<ArtifactFormat>(["PDF", "DOCX", "MD", "JSON", "SQL", "API", "Diagram"]);

export class ArtifactFactory {
  create(format: ArtifactFormat, title: string, payload: unknown): ArtifactRecord {
    if (!formats.has(format)) {
      throw new ValidationError("Nepodprt format artefakta.", "format");
    }
    return {
      id: `art-${format.toLowerCase()}`,
      format,
      title,
      mime: mime[format],
      content: serialize(format, payload),
    };
  }
}

export function parseArtifactFormat(kind: string): ArtifactFormat {
  const map: Record<string, ArtifactFormat> = {
    PDF: "PDF",
    DOCX: "DOCX",
    Word: "DOCX",
    MD: "MD",
    Markdown: "MD",
    JSON: "JSON",
    SQL: "SQL",
    API: "API",
    "API Spec": "API",
    Diagram: "Diagram",
  };
  const format = map[kind];
  if (!format) throw new ValidationError("Nepodprt format artefakta.", "kind");
  return format;
}
