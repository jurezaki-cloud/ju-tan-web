export type DocumentFolder = "Pogodbe" | "Ponudbe" | "PDF" | "Specifikacije";

export type DocumentKind = "PDF" | "DOCX";

export interface Document {
  id: string;
  name: string;
  folder: DocumentFolder;
  clientId: string;
  clientName: string;
  updated: string;
  kind: DocumentKind;
}
