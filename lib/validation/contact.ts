import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Vnesite ime."),
  company: z.string().optional(),
  email: z.email("Neveljaven e-poštni naslov."),
  phone: z.string().optional(),
  service: z.string().min(1, "Izberite storitev."),
  message: z
    .string()
    .min(20, "Sporočilo mora vsebovati vsaj 20 znakov."),
});

export type ContactFormData = z.infer<typeof contactSchema>;