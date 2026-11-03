/** Keep user-authored greeting and QR content out of browser telemetry. */
export function isPrivateToolPath(path: string) {
  let pathname: string;
  try {
    pathname = new URL(path, "https://local.invalid").pathname.replace(
      /\/$/,
      "",
    );
  } catch {
    return false;
  }
  return pathname === "/magic" || pathname === "/free/qr-studio";
}
