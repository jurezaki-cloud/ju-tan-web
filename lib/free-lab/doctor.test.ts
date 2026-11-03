import assert from "node:assert/strict";
import test from "node:test";
import { inspectHtml } from "./doctor-engine";
import { DOCTOR_EXAMPLE, HTML_MAX_BYTES, doctorReportText } from "./doctor";
import { isPrivateToolPath } from "../private-tool-path";
const wrap = (head: string, body: string) =>
  `<!doctype html><html lang="sl"><head>${head}</head><body>${body}</body></html>`;
const status = (html: string, id: string) =>
  inspectHtml(html).checks.find((check) => check.id === id)?.status;
test("example identifies specific problems and generates a plain-text report", () => {
  const report = inspectHtml(DOCTOR_EXAMPLE);
  assert.equal(report.checks.length, 11);
  assert.deepEqual(
    report.checks
      .filter((check) => check.status === "review")
      .map((check) => check.id),
    ["headings", "alt", "social"],
  );
  assert.equal(report.images, 1);
  assert.equal(report.headings, 2);
  assert.match(doctorReportText(report), /PREVERI: Besedilne alternative slik/);
  assert.doesNotMatch(doctorReportText(report), /delavnica.jpg|<html/);
});
test("complete basic metadata, empty decorative alt and heading levels pass their checks", () => {
  const html = DOCTOR_EXAMPLE.replace("<h3>", "<h2>")
    .replace("</h3>", "</h2>")
    .replace('<img src="delavnica.jpg">', '<img src="delavnica.jpg" alt="">')
    .replace(
      "</head>",
      '<meta property="og:title" content="Naslov"><meta property="og:description" content="Opis"><meta property="og:image" content="https://example.com/a.jpg"></head>',
    );
  assert.ok(inspectHtml(html).checks.every((check) => check.status === "pass"));
  assert.equal(
    status(wrap("<title>A &amp; B</title>", "<h1>A</h1>"), "title"),
    "pass",
  );
  assert.match(
    inspectHtml(wrap("<title>A &amp; B</title>", "<h1>A</h1>")).checks[0]
      .detail,
    /5 znakov/,
  );
});
test("duplicate metadata, zoom restrictions, invalid canonical and intentional noindex require review", () => {
  assert.equal(
    status(wrap("<title>A</title><title>B</title>", ""), "title"),
    "review",
  );
  assert.equal(
    status(
      wrap(
        '<meta name="description" content="A"><meta name="description" content="B">',
        "",
      ),
      "description",
    ),
    "review",
  );
  for (const value of [
    "width=device-width, user-scalable=no",
    "width=device-width, maximum-scale=1",
  ]) {
    assert.equal(
      status(wrap(`<meta name="viewport" content="${value}">`, ""), "viewport"),
      "review",
    );
  }
  for (const href of [
    "/relative",
    "javascript:alert(1)",
    "https://u:secret@example.com/",
  ]) {
    assert.equal(
      status(wrap(`<link rel="canonical" href="${href}">`, ""), "canonical"),
      "review",
    );
  }
  for (const value of ["noindex, follow", "NONE", "max-snippet:10 noindex"]) {
    assert.equal(
      status(wrap(`<meta name="GOOGLEBOT" content="${value}">`, ""), "robots"),
      "review",
    );
  }
});
test("scripts, comments, templates and embedded foreign content cannot forge findings or appear in reports", () => {
  const html = wrap(
    '<title>Safe</title><!-- <meta name="description" content="fake"> --><script>throw new Error("EXECUTED");fetch("https://example.com/private");</script>',
    '<h1>Real</h1><template><h1>Fake</h1><img src="https://example.com/tracker"></template><svg><title>Fake</title><image href="https://example.com/private" /></svg><noscript><h1>Fallback</h1></noscript>',
  );
  const report = inspectHtml(html);
  assert.equal(report.images, 0);
  assert.equal(report.headings, 1);
  assert.equal(
    report.checks.find((check) => check.id === "description")?.status,
    "review",
  );
  assert.doesNotMatch(
    doctorReportText(report),
    /EXECUTED|private|tracker|Fake|fetch/,
  );
});
test("rejects fragments, URLs, oversized UTF-8, excessive depth and node counts", () => {
  for (const input of [
    "",
    "https://example.com",
    "<h1>Fragment</h1>",
    "x".repeat(HTML_MAX_BYTES + 1),
    "č".repeat(HTML_MAX_BYTES / 2 + 1),
  ])
    assert.throws(() => inspectHtml(input));
  assert.throws(
    () => inspectHtml(wrap("", "<div>".repeat(300) + "</div>".repeat(300))),
    /zapleten/,
  );
  assert.throws(() => inspectHtml(wrap("", "<br>".repeat(30_001))), /zapleten/);
  assert.equal(isPrivateToolPath("/free/website-doctor?test=1"), true);
  assert.equal(isPrivateToolPath("/free/website-doctor/"), true);
});
