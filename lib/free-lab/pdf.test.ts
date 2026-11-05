import assert from "node:assert/strict";
import test from "node:test";
import { PDFDocument, degrees, PDFName } from "pdf-lib";
import { parsePdfRange, validatePdfFiles, PDF_MAX_BYTES } from "./pdf";
import { processPdfJob } from "./pdf-engine";
import { isPrivateToolPath } from "../private-tool-path";
const buffer = (value: Uint8Array) => Uint8Array.from(value).buffer;
async function fixture(widths = [100, 200, 300]) {
  const doc = await PDFDocument.create();
  widths.forEach((width) => doc.addPage([width, 400]));
  doc.getPage(0).setRotation(degrees(90));
  return buffer(await doc.save());
}
test("PDF ranges preserve deliberate order, descending spans and duplicates", () => {
  assert.deepEqual(parsePdfRange("3, 1, 5-3, 1", 5), [2, 0, 4, 3, 2, 0]);
  assert.deepEqual(parsePdfRange("", 3), [0, 1, 2]);
  for (const text of ["0", "4", "1,", "-1", "1.5", "1e2", "1;2"])
    assert.throws(() => parsePdfRange(text, 3));
  assert.throws(() => parsePdfRange(Array(201).fill("1").join(","), 3));
});
test("merge, selection, existing rotations and repeated pages survive reloading", async () => {
  const a = await fixture(),
    b = await fixture([500]);
  const inputs = [
    { bytes: a, range: "3,1,1", rotation: 90 },
    { bytes: b, range: "", rotation: 270 },
  ];
  assert.deepEqual(
    (await processPdfJob({ type: "inspect", files: inputs })).pages,
    [3, 1],
  );
  const result = await processPdfJob({ type: "export", files: inputs });
  const out = await PDFDocument.load(result.output!);
  assert.deepEqual(
    out.getPages().map((p) => p.getWidth()),
    [300, 100, 100, 500],
  );
  assert.deepEqual(
    out.getPages().map((p) => p.getRotation().angle),
    [90, 180, 180, 0],
  );
  const original = await PDFDocument.load(a);
  assert.equal(original.getPageCount(), 3);
  assert.equal(original.getPage(0).getRotation().angle, 90);
});
test("invalid, encrypted, form and oversized documents are rejected", async () => {
  assert.throws(() => validatePdfFiles([]));
  assert.throws(() =>
    validatePdfFiles([
      { bytes: new ArrayBuffer(PDF_MAX_BYTES + 1), range: "", rotation: 0 },
    ]),
  );
  await assert.rejects(
    processPdfJob({
      type: "inspect",
      files: [
        {
          bytes: buffer(new TextEncoder().encode("%PDF-broken")),
          range: "",
          rotation: 0,
        },
      ],
    }),
  );
  const form = await PDFDocument.create();
  form.addPage();
  form.getForm().createTextField("name");
  await assert.rejects(
    processPdfJob({
      type: "inspect",
      files: [{ bytes: buffer(await form.save()), range: "", rotation: 0 }],
    }),
    /Obrazci/,
  );
  const encrypted = await PDFDocument.create();
  encrypted.addPage();
  encrypted.context.trailerInfo.Encrypt = encrypted.context.register(
    encrypted.context.obj({ Filter: PDFName.of("Standard") }),
  );
  await assert.rejects(
    processPdfJob({
      type: "inspect",
      files: [
        { bytes: buffer(await encrypted.save()), range: "", rotation: 0 },
      ],
    }),
    /Zaščiteni/,
  );
});
test("PDF export limits and private routes are enforced", async () => {
  const bytes = await fixture([100]);
  await assert.rejects(
    processPdfJob({
      type: "export",
      files: [{ bytes, range: "2", rotation: 0 }],
    }),
  );
  await assert.rejects(
    processPdfJob({
      type: "export",
      files: [{ bytes, range: "", rotation: 45 }],
    }),
  );
  assert.ok(isPrivateToolPath("/free/pdf-master/"));
  assert.equal(isPrivateToolPath("/free/pdf-master-other"), false);
});
