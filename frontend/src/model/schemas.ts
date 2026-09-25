import { z } from "zod";

export const bookingDetailsSchema = z.object({
  name: z.string().trim().min(2).max(60),
  email: z.string().trim().email().max(120),
  phone: z.string().trim().regex(/^[+0-9 ()-]{7,25}$/),
  notes: z.string().trim().max(500).default(""),
  consent: z.literal(true),
  website: z.string().max(0).optional()
});

export type BookingDetailsInput = z.infer<typeof bookingDetailsSchema>;