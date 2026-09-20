import { NextResponse } from "next/server";
import { OFFICE_DOWNLOAD_NO_STORE } from "./constants";

export function officeJson(
  body: Record<string, unknown>,
  status: number,
  extraHeaders?: HeadersInit,
) {
  return NextResponse.json(body, {
    status,
    headers: {
      ...OFFICE_DOWNLOAD_NO_STORE,
      ...extraHeaders,
    },
  });
}
