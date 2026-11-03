import { PDFDocument, degrees, EncryptedPDFError } from "pdf-lib";
import {
  PDF_MAX_PAGES,
  parsePdfRange,
  validatePdfFiles,
  type PdfJob,
  type PdfReply,
} from "./pdf";

export async function processPdfJob(job: PdfJob): Promise<PdfReply> {
  validatePdfFiles(job.files);
  const documents: PDFDocument[] = [];
  let sourcePages = 0;
  for (const input of job.files) {
    let document: PDFDocument;
    try {
      document = await PDFDocument.load(input.bytes, {
        updateMetadata: false,
        throwOnInvalidObject: true,
      });
    } catch (error) {
      // pdf-lib's ES5 Error subclass does not preserve instanceof in all runtimes.
      if (error instanceof Error && error.message === new EncryptedPDFError().message)
        throw new Error(
          "Zaščiteni PDF-ji niso podprti. Uporabi nezaščiten izvod, za katerega imaš dovoljenje.",
        );
      throw new Error(
        "PDF-ja ni mogoče prebrati. Datoteka je morda poškodovana ali nepodprta.",
      );
    }
    if (document.getForm().getFields().length)
      throw new Error(
        "Obrazci in digitalno podpisani obrazci niso podprti. Uporabi običajen PDF brez obrazcev.",
      );
    const count = document.getPageCount();
    sourcePages += count;
    if (count < 1 || sourcePages > PDF_MAX_PAGES)
      throw new Error(
        "Izbrani dokumenti lahko skupaj vsebujejo največ 200 strani.",
      );
    documents.push(document);
  }
  const pages = documents.map((document) => document.getPageCount());
  if (job.type === "inspect") return { pages };
  const output = await PDFDocument.create();
  let total = 0;
  for (let index = 0; index < documents.length; index++) {
    const selected = parsePdfRange(job.files[index].range, pages[index]);
    total += selected.length;
    if (total > PDF_MAX_PAGES)
      throw new Error("Izvoz lahko vsebuje največ 200 strani.");
    const copied = await output.copyPages(documents[index], selected);
    for (const [pageIndex, page] of copied.entries()) {
      const originalRotation = documents[index]
        .getPage(selected[pageIndex])
        .getRotation().angle;
      page.setRotation(
        degrees((originalRotation + job.files[index].rotation) % 360),
      );
      output.addPage(page);
    }
  }
  output.setCreator("JU-TAN PDF Master");
  return { pages, output: await output.save() };
}
