import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeTaxNumber(value: string | null) {
  const normalized = (value ?? "").trim().toUpperCase().replace(/\s+/g, "").replace(/^SI/, "");
  return /^\d{8}$/.test(normalized) ? normalized : null;
}

export async function GET(request: NextRequest) {
  const taxNumber = normalizeTaxNumber(request.nextUrl.searchParams.get("tax_number"));
  if (!taxNumber) {
    return NextResponse.json(
      { ok: false, error: "Vnesite veljavno 8-mestno slovensko davčno številko." },
      { status: 400 },
    );
  }

  const upstream = process.env.COMPANY_LOOKUP_API_URL?.trim();
  if (!upstream) {
    return NextResponse.json(
      { ok: false, code: "lookup_not_configured", error: "Iskanje podjetij še ni konfigurirano." },
      { status: 503 },
    );
  }

  try {
    const url = new URL(upstream);
    url.searchParams.set("tax_number", taxNumber);

    const headers: HeadersInit = { Accept: "application/json" };
    const token = process.env.COMPANY_LOOKUP_API_TOKEN?.trim();
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (response.status === 404) {
      return NextResponse.json({ ok: false, error: "Podjetja ni bilo mogoče najti." }, { status: 404 });
    }
    if (!response.ok) {
      console.error("company lookup upstream failed", response.status);
      return NextResponse.json({ ok: false, error: "Iskanje podjetja trenutno ni na voljo." }, { status: 502 });
    }

    const payload = await response.json();
    const source = payload?.company ?? payload;
    const company = String(source?.company ?? source?.name ?? source?.naziv ?? "").trim();
    if (!company) {
      return NextResponse.json({ ok: false, error: "Podjetja ni bilo mogoče najti." }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      company: {
        company,
        address: String(source?.address ?? source?.naslov ?? "").trim(),
        postal_code: String(source?.postal_code ?? source?.postna_stevilka ?? "").trim(),
        city: String(source?.city ?? source?.kraj ?? "").trim(),
        country: String(source?.country ?? source?.drzava ?? "Slovenija").trim() || "Slovenija",
        tax_number: taxNumber,
      },
    });
  } catch (error) {
    console.error("company lookup failed", error);
    return NextResponse.json({ ok: false, error: "Iskanje podjetja trenutno ni na voljo." }, { status: 502 });
  }
}
