export const HTML_MAX_BYTES = 500 * 1024;
export type DoctorCheck = {
  id: string;
  title: string;
  status: "pass" | "review";
  detail: string;
  action: string;
};
export type DoctorReport = {
  checks: DoctorCheck[];
  bytes: number;
  images: number;
  headings: number;
};
export type DoctorReply =
  { report: DoctorReport; error?: never } | { error: string; report?: never };
export const DOCTOR_EXAMPLE = `<!doctype html>
<html lang="sl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Moja ustvarjalna delavnica</title>
  <meta name="description" content="Odkrij ročno izdelane izdelke in ustvarjalne delavnice za vse generacije.">
  <link rel="canonical" href="https://example.com/">
</head>
<body>
  <main>
    <h1>Ustvarimo nekaj lepega.</h1>
    <h3>Naše delavnice</h3>
    <img src="delavnica.jpg">
  </main>
</body>
</html>`;

export function doctorReportText(report: DoctorReport) {
  return [
    "JU-TAN Website Doctor — pregled prilepljenega HTML-ja",
    "To ni meritev hitrosti, preverjanje žive strani ali potrdilo dostopnosti.",
    `Velikost: ${report.bytes} bajtov · slike: ${report.images} · naslovi: ${report.headings}`,
    ...report.checks.map(
      (check) =>
        `\n${check.status === "pass" ? "NAJDENO" : "PREVERI"}: ${check.title}\n${check.detail}\n${check.action}`,
    ),
    "\nRočno preveri tipkovnico, bralnik zaslona, kontrast, mobilni prikaz in vsebino po izvajanju JavaScripta. Hitrost izmeri s PageSpeed Insights.",
  ].join("\n");
}
