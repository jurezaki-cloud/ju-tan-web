export const qrKinds = [
  {
    id: "url",
    label: "Povezava",
    hint: "Za spletno stran, cenik, obrazec ali meni.",
  },
  {
    id: "wifi",
    label: "Wi-Fi",
    hint: "Povezava z omrežjem brez prepisovanja gesla.",
  },
  {
    id: "email",
    label: "E-pošta",
    hint: "Pripravi prejemnika, zadevo in sporočilo.",
  },
  {
    id: "phone",
    label: "Telefon",
    hint: "Telefonska številka, pripravljena za klic.",
  },
  {
    id: "sms",
    label: "SMS",
    hint: "Pripravi sporočilo. Pošiljanje potrdi prejemnik kode.",
  },
  {
    id: "contact",
    label: "Kontakt",
    hint: "Vizitka, ki jo lahko shraniš med stike.",
  },
] as const;
export type QrKind = (typeof qrKinds)[number]["id"];
export const initialFields = {
  url: "https://ju-tan.com",
  ssid: "",
  password: "",
  security: "WPA",
  hidden: "false",
  email: "",
  subject: "",
  message: "",
  phone: "",
  firstName: "",
  lastName: "",
  organization: "",
  website: "",
};
export type QrFields = typeof initialFields;
export type QrField = keyof QrFields;
export type PayloadResult =
  { ok: true; data: string } | { ok: false; field: QrField; error: string };
export const MAX_QR_BYTES = 1000;
const bytes = (value: string) => new TextEncoder().encode(value).length;
const fail = (field: QrField, error: string): PayloadResult => ({
  ok: false,
  field,
  error,
});
const hasControl = (value: string) => /[\u0000-\u001f\u007f]/.test(value);
const emailValid = (value: string) =>
  /^[^\s@<>:;,?]+@[^\s@<>:;,?]+\.[^\s@<>:;,?]+$/.test(value);

function webUrl(value: string): string | null {
  const input = value.trim();
  if (!input || /\s/.test(input) || hasControl(value)) return null;
  try {
    const candidate = /^[a-z][a-z0-9+.-]*:/i.test(input)
      ? input
      : `https://${input}`;
    const url = new URL(candidate);
    if (
      !["https:", "http:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      !url.hostname.includes(".")
    )
      return null;
    return url.href;
  } catch {
    return null;
  }
}

function phoneNumber(value: string) {
  if (hasControl(value)) return null;
  const phone = value.replace(/[ ()-]/g, "");
  return /^\+?\d{3,15}$/.test(phone) ? phone : null;
}

const escapeWifi = (value: string) => value.replace(/[\\;,:\"]/g, "\\$&");
const escapeVcard = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/[,;]/g, "\\$&");

// vCard 3.0 folds at UTF-8 boundaries; continuation spaces count toward the line length.
function foldVcard(line: string) {
  let result = "",
    length = 0;
  for (const character of line) {
    const size = bytes(character);
    if (length + size > 75) {
      result += "\r\n ";
      length = 1;
    }
    result += character;
    length += size;
  }
  return result;
}

export function buildQrPayload(kind: QrKind, fields: QrFields): PayloadResult {
  let data: string;
  let primary: QrField;
  if (kind === "url") {
    const url = webUrl(fields.url);
    if (!url)
      return fail(
        "url",
        "Vnesi veljaven javni naslov HTTP ali HTTPS, brez uporabniškega imena in gesla.",
      );
    data = url;
    primary = "url";
  } else if (kind === "wifi") {
    if (!fields.ssid || bytes(fields.ssid) > 32 || hasControl(fields.ssid))
      return fail(
        "ssid",
        "Ime omrežja mora imeti od 1 do 32 bajtov in biti brez prelomov vrstic.",
      );
    if (!["WPA", "nopass"].includes(fields.security))
      return fail("security", "Izberi WPA/WPA2 ali odprto omrežje.");
    if (
      fields.security === "WPA" &&
      !(
        /^[\x20-\x7e]{8,63}$/.test(fields.password) ||
        /^[a-f\d]{64}$/i.test(fields.password)
      )
    )
      return fail(
        "password",
        "Vnesi geslo WPA/WPA2: 8–63 znakov ASCII ali 64 šestnajstiških znakov.",
      );
    data = `WIFI:T:${fields.security};S:${escapeWifi(fields.ssid)};${fields.security === "WPA" ? `P:${escapeWifi(fields.password)};` : ""}H:${fields.hidden === "true" ? "true" : "false"};;`;
    primary = "ssid";
  } else if (kind === "email") {
    const address = fields.email.trim();
    if (!emailValid(address) || hasControl(fields.email))
      return fail("email", "Vnesi veljaven e-poštni naslov.");
    if (hasControl(fields.subject))
      return fail("subject", "Zadeva naj bo v eni vrstici.");
    data = `mailto:${encodeURIComponent(address)}?subject=${encodeURIComponent(fields.subject)}&body=${encodeURIComponent(fields.message)}`;
    primary = "message";
  } else if (kind === "phone" || kind === "sms") {
    const phone = phoneNumber(fields.phone);
    if (!phone)
      return fail(
        "phone",
        "Vnesi od 3 do 15 številk. Priporočamo mednarodno obliko, npr. +386 40 123 456.",
      );
    data =
      kind === "phone"
        ? `tel:${phone}`
        : `sms:${phone}?body=${encodeURIComponent(fields.message)}`;
    primary = kind === "phone" ? "phone" : "message";
  } else {
    const first = fields.firstName.trim(),
      last = fields.lastName.trim();
    if (!first && !last)
      return fail("firstName", "Vnesi ime ali priimek kontakta.");
    for (const field of [
      "firstName",
      "lastName",
      "organization",
      "email",
      "phone",
      "website",
    ] as const) {
      if (hasControl(fields[field]))
        return fail(field, "To polje naj bo v eni vrstici.");
    }
    const email = fields.email.trim();
    if (email && !emailValid(email))
      return fail(
        "email",
        "Vnesi veljaven e-poštni naslov ali pusti polje prazno.",
      );
    const phone = fields.phone.trim() ? phoneNumber(fields.phone) : null;
    if (fields.phone.trim() && !phone)
      return fail(
        "phone",
        "Preveri telefonsko številko ali pusti polje prazno.",
      );
    const website = fields.website.trim() ? webUrl(fields.website) : null;
    if (fields.website.trim() && !website)
      return fail(
        "website",
        "Vnesi veljaven naslov HTTP/HTTPS ali pusti polje prazno.",
      );
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${escapeVcard(last)};${escapeVcard(first)};;;`,
      `FN:${escapeVcard([first, last].filter(Boolean).join(" "))}`,
    ];
    if (fields.organization.trim())
      lines.push(`ORG:${escapeVcard(fields.organization.trim())}`);
    if (email) lines.push(`EMAIL:${escapeVcard(email)}`);
    if (phone) lines.push(`TEL:${phone}`);
    if (website) lines.push(`URL:${escapeVcard(website)}`);
    data = [...lines.map(foldVcard), "END:VCARD"].join("\r\n");
    primary = "organization";
  }
  if (bytes(data) > MAX_QR_BYTES)
    return fail(
      primary,
      "Vsebina je predolga za to kodo. Skrajšaj besedilo ali povezavo (največ 1000 bajtov kodirane vsebine).",
    );
  return { ok: true, data };
}
