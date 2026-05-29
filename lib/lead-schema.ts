import { z } from "zod";

/**
 * Lead form schema (build-prompt §8).
 *
 * Shared between the client form (M3) and the server `/api/lead` route
 * handler (M6). The honeypot field `website` must be empty, any value
 * causes the API to silently drop the submission.
 */
export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name (min 2 characters).")
    .max(80, "Name is too long (max 80 characters)."),
  phone: z
    .string()
    .trim()
    .regex(
      /^(\+?91[\s\-]?)?[6-9]\d{9}$/,
      "Please enter a valid Indian mobile number.",
    ),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address."),
  message: z
    .string()
    .trim()
    .min(10, "A few sentences please (min 10 characters).")
    .max(2000, "Message is too long (max 2000 characters)."),
  /** Honeypot, must be empty. Real users never see this field. */
  website: z.string().max(0).optional().default(""),
});

export type LeadInput = z.infer<typeof leadSchema>;
