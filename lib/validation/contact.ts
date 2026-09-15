import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .max(160)
  .optional()
  .transform((value) => value || undefined);

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Vnesite ime in priimek.").max(120),
  company: optionalText,
  email: z.email("Vnesite veljaven e-poštni naslov."),
  phone: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((value) => value || undefined),
  service: z.string().trim().min(1, "Izberite storitev.").max(120),
  message: z.string().trim().min(1, "Vnesite sporočilo.").max(5000),
  consent: z.literal(true, {
    error: "Potrdite soglasje za obdelavo osebnih podatkov.",
  }),
  consentAt: z
    .string()
    .trim()
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Manjka veljaven čas soglasja.",
    }),
  website: z.string().max(200).optional(),
});

export type ContactPayload = z.infer<typeof contactSchema>;

export type ContactFieldKey =
  | "name"
  | "company"
  | "email"
  | "phone"
  | "service"
  | "message"
  | "consent"
  | "consentAt";

export function flattenContactErrors(
  error: z.ZodError,
): Partial<Record<ContactFieldKey | "form", string>> {
  const map: Partial<Record<ContactFieldKey | "form", string>> = {};

  for (const issue of error.issues) {
    const key = (issue.path[0] as ContactFieldKey | undefined) ?? "form";
    if (!map[key]) {
      map[key] = issue.message;
    }
  }

  return map;
}
