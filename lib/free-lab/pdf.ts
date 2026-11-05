export const PDF_MAX_BYTES = 20 * 1024 * 1024;
export const PDF_MAX_FILES = 10;
export const PDF_MAX_PAGES = 200;
export type PdfInput = { bytes: ArrayBuffer; range: string; rotation: number };
export type PdfJob = { type: "inspect" | "export"; files: PdfInput[] };
export type PdfReply = { pages: number[]; output?: Uint8Array; error?: string };

export function parsePdfRange(value: string, pageCount: number): number[] {
  if (
    !Number.isInteger(pageCount) ||
    pageCount < 1 ||
    pageCount > PDF_MAX_PAGES
  )
    throw new Error("Podprtih je od 1 do 200 strani.");
  if (!value.trim())
    return Array.from({ length: pageCount }, (_, index) => index);
  if (value.length > 1200) throw new Error("Izbor strani je predolg.");
  const pages: number[] = [];
  for (const part of value.split(",")) {
    const match = part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match)
      throw new Error("Uporabi številke in obsege, na primer 1, 3-5 ali 5-3.");
    const start = Number(match[1]),
      end = Number(match[2] ?? match[1]);
    if (start < 1 || end < 1 || start > pageCount || end > pageCount)
      throw new Error(`Izberi strani med 1 in ${pageCount}.`);
    const step = start <= end ? 1 : -1;
    for (let page = start; ; page += step) {
      pages.push(page - 1);
      if (pages.length > PDF_MAX_PAGES)
        throw new Error("Izvoz lahko vsebuje največ 200 strani.");
      if (page === end) break;
    }
  }
  return pages;
}
export function validatePdfFiles(files: readonly PdfInput[]) {
  if (!files.length || files.length > PDF_MAX_FILES)
    throw new Error("Izberi od 1 do 10 dokumentov PDF.");
  if (
    files.reduce((sum, file) => sum + file.bytes.byteLength, 0) > PDF_MAX_BYTES
  )
    throw new Error("Skupna velikost dokumentov je omejena na 20 MB.");
  for (const file of files) {
    const header = new TextDecoder("ascii").decode(file.bytes.slice(0, 1024));
    if (!header.includes("%PDF-"))
      throw new Error("Datoteka ni prepoznana kot PDF.");
    if (![0, 90, 180, 270].includes(file.rotation))
      throw new Error("Neveljaven kot vrtenja.");
  }
}
