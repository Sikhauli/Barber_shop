import { z } from "zod";

export const bookingDetailsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Please enter your name (at least 2 characters)." })
    .max(60, { message: "Name must be 60 characters or fewer." }),

  email: z
    .string()
    .trim()
    .min(1, { message: "Please enter your email address." })
    .email({ message: "That doesn't look like a valid email address." })
    .max(120, { message: "Email must be 120 characters or fewer." }),

  phone: z
    .string()
    .trim()
    .min(1, { message: "Please enter your phone number." })
    .regex(/^[+0-9 ()\-]{7,25}$/, {
      message: "Enter a valid phone number (7–25 digits, spaces, +, (), or -).",
    }),

  notes: z
    .string()
    .trim()
    .max(500, { message: "Notes must be 500 characters or fewer." })
    .optional()
    .default(""),

  consent: z
    .preprocess(
      (v) => v === true || v === "true" || v === "on",
      z.boolean()
    )
    .refine((v) => v === true, {
      message: "Please tick the box to accept the booking terms.",
    }),

  // Honeypot — must stay empty
  website: z.string().max(0, { message: "Bot detected." }).optional(),
});

export type BookingDetailsInput = z.infer<typeof bookingDetailsSchema>;