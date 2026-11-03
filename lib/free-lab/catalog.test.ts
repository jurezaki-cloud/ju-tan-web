import assert from "node:assert/strict";
import test from "node:test";
import { filterLabTools, getLabTool, labTools } from "./catalog";

test("search accepts Slovenian accents, whitespace and multiple terms", () => {
  assert.equal(filterLabTools("  VOSCILNICE  ", "Vse")[0]?.slug, "voscilnice");
  assert.equal(filterLabTools("zdruzevanje pdf", "Vse")[0]?.slug, "pdf-master");
  assert.equal(filterLabTools("QR", "Dokumenti").length, 0);
  assert.equal(filterLabTools("not-a-tool", "Vse").length, 0);
  assert.equal(filterLabTools(" ", "Vse").length, 6);
});
test("categories compose with search and resetting does not mutate the catalog", () => {
  assert.deepEqual(
    filterLabTools("", "Splet").map((tool) => tool.slug),
    ["qr-studio", "website-doctor"],
  );
  assert.equal(filterLabTools("slike", "Slike in dizajn").length, 2);
  assert.equal(labTools.length, 6);
});
test("routes are unique and only implemented tools are actionable", () => {
  assert.equal(
    new Set(labTools.map((tool) => tool.slug)).size,
    labTools.length,
  );
  assert.equal(getLabTool("unknown"), undefined);
  for (const tool of labTools) {
    assert.match(tool.slug, /^[a-z0-9-]+$/);
    if (tool.release.status === "available")
      assert.ok(
        [
          "/magic",
          "/free/qr-studio",
          "/free/image-magic",
          "/free/kviz-slovenija",
          "/free/pdf-master",
        ].includes(tool.release.href),
      );
  }
  assert.equal(
    labTools.filter((tool) => tool.release.status === "available").length,
    5,
  );
});
