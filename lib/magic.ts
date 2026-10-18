import { z } from "zod";

export const magicSchema = z
  .object({
    v: z.literal(1),
    kind: z.enum(["card", "secret", "gift", "invite"]),
    theme: z.enum(["mint", "rose", "gold"]),
    to: z.string().trim().min(1).max(50),
    from: z.string().trim().min(1).max(50),
    title: z.string().trim().min(1).max(80),
    message: z.string().trim().min(1).max(600),
    date: z
      .string()
      .max(16)
      .refine(
        (value) => !value || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value),
      ),
    place: z.string().trim().max(100),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.kind === "invite" && (!value.date || !value.place)) {
      ctx.addIssue({ code: "custom", message: "Dodaj datum in kraj vabila." });
    }
  });
export type Magic = z.infer<typeof magicSchema>;
export const initialMagic: Magic = {
  v: 1,
  kind: "card",
  theme: "mint",
  to: "",
  from: "",
  title: "Danes je tvoj dan.",
  message:
    "Naj bo poln majhnih čudežev, velikih nasmehov in ljudi, ki te imajo radi. ✨",
  date: "",
  place: "",
};
export const MAX_TOKEN_LENGTH = 8000;
export function encodeMagic(value: Magic): string {
  const bytes = new TextEncoder().encode(
    JSON.stringify(magicSchema.parse(value)),
  );
  const token = btoa(
    Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""),
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  if (token.length > MAX_TOKEN_LENGTH)
    throw new Error("Sporočilo je predolgo.");
  return token;
}
export function decodeMagic(token: string): Magic {
  if (
    !token ||
    token.length > MAX_TOKEN_LENGTH ||
    !/^[A-Za-z0-9_-]+$/.test(token)
  )
    throw new Error("Neveljavna povezava.");
  const bytes = Uint8Array.from(
    atob(token.replace(/-/g, "+").replace(/_/g, "/")),
    (char) => char.charCodeAt(0),
  );
  return magicSchema.parse(
    JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)),
  );
}
