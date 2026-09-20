import { NextResponse } from "next/server";
import { LicensingError } from "./service";

const messages: Record<LicensingError["code"], string> = {
  invalid_license: "Licenčni ključ ni veljaven.",
  blocked: "Licenca je blokirana.",
  expired: "Licenca je potekla.",
  device_limit: "Doseženo je največje dovoljeno število naprav.",
  invalid_activation: "Aktivacija ni veljavna.",
};

export function licensingErrorResponse(error: unknown) {
  if (error instanceof LicensingError) {
    return NextResponse.json(
      { ok: false, code: error.code, error: messages[error.code] },
      { status: error.status },
    );
  }
  console.error("Licensing API failure", error);
  return NextResponse.json(
    {
      ok: false,
      code: "service_unavailable",
      error: "Licenčna storitev trenutno ni dosegljiva.",
    },
    { status: 503 },
  );
}
