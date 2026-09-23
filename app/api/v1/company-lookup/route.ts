import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VIES_URL = "https://ec.europa.eu/taxation_customs/vies/services/checkVatService";

function normalizeTaxNumber(value: string | null) {
  const normalized = (value ?? "").trim().toUpperCase().replace(/\s+/g, "").replace(/^SI/, "");
  return /^\d{8}$/.test(normalized) ? normalized : null;
}

function xmlValue(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<(?:\\w+:)?${tag}>([\\s\\S]*?)<\\/(?:\\w+:)?${tag}>`, "i"));
  return match?.[1]?.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim() ?? "";
}

function splitAddress(raw: string) {
  const clean = raw.replace(/\\n/g, "\n").trim();
  const lines = clean.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const last = lines.at(-1) ?? "";
  const postal = last.match(/\b(\d{4})\b/);
  const city = postal ? last.replace(postal[0], "").trim().replace(/^[-,\s]+/, "") : "";
  const address = postal && lines.length > 1 ? lines.slice(0, -1).join(", ") : clean;
  return { address, postal_code: postal?.[1] ?? "", city };
}

async function lookupVies(taxNumber: string) {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:ec.europa.eu:taxud:vies:services:checkVat:types">
  <soapenv:Body><urn:checkVat><urn:countryCode>SI</urn:countryCode><urn:vatNumber>${taxNumber}</urn:vatNumber></urn:checkVat></soapenv:Body>
</soapenv:Envelope>`;

  const response = await fetch(VIES_URL, {
    method: "POST",
    headers: { "Content-Type": "text/xml; charset=utf-8", SOAPAction: "" },
    body,
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`VIES HTTP ${response.status}`);
  const xml = await response.text();
  if (xmlValue(xml, "valid").toLowerCase() !== "true") return null;
  const company = xmlValue(xml, "name");
  if (!company || company === "---") return null;
  return { company, ...splitAddress(xmlValue(xml, "address")) };
}

export async function GET(request: NextRequest) {
  const taxNumber = normalizeTaxNumber(request.nextUrl.searchParams.get("tax_number"));
  if (!taxNumber) {
    return NextResponse.json({ ok: false, error: "Vnesite veljavno 8-mestno slovensko davčno številko." }, { status: 400 });
  }

  try {
    const result = await lookupVies(taxNumber);
    if (!result) {
      return NextResponse.json(
        { ok: false, code: "not_in_vies", error: "Podjetja ni bilo mogoče najti v registru VIES. Podatke lahko vnesete ročno." },
        { status: 404 },
      );
    }
    return NextResponse.json({
      ok: true,
      source: "VIES",
      company: { ...result, country: "Slovenija", tax_number: taxNumber },
    });
  } catch (error) {
    console.error("company lookup failed", error);
    return NextResponse.json({ ok: false, error: "Iskanje podjetja trenutno ni na voljo." }, { status: 502 });
  }
}
