export type ArtifactFormat =
  | "PDF"
  | "DOCX"
  | "MD"
  | "JSON"
  | "SQL"
  | "API"
  | "Diagram";

export type ArtifactRecord = {
  id: string;
  format: ArtifactFormat;
  title: string;
  mime: string;
  content: string;
};
