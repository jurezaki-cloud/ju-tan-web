import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .max(160)
  .optional()
  .transform((value) => value || undefined);

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Vnesite ime.").max(120),
  company: optionalText,
  email: z.email("Neveljaven e-poštni naslov."),
  phone: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((value) => value || undefined),
  service: z.string().trim().min(1, "Izberite storitev.").max(120),
  message: z.string().trim().min(1, "Vnesite sporočilo.").max(5000),
  website: z.string().max(200).optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
