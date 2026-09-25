import { z } from "zod";

export const bookingDetailsSchema = z.object({
  name: z.string().trim().min(2).max(60),
  email: z.string().trim().email().max(120),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9 ()\-]{7,25}$/, {
      message: "Enter a valid phone number (7–25 characters).",
    }),
  notes: z.string().trim().max(500).default(""),
  consent: z
    .union([z.boolean(), z.literal("true"), z.literal("on")])
    .transform((v) => v === true || v === "true" || v === "on")
    .refine((v) => v === true, { message: "You must accept the booking terms." }),
  website: z.string().max(0).optional(),
});

export type BookingDetailsInput = z.infer<typeof bookingDetailsSchema>;