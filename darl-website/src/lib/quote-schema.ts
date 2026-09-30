import { z } from "zod";
import { REQUIREMENT_OPTIONS } from "./quote-constants";

export { MAX_UPLOAD_BYTES, type QuoteFieldErrors } from "./quote-constants";

// Strips control characters (except newlines/tabs in free text) and trims.
const clean = (multiline = false) =>
  z
    .string()
    .transform((s) => (multiline ? s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "") : s.replace(/[\u0000-\u001F\u007F]/g, " ")).trim());

export const quoteSchema = z.object({
  name: clean().pipe(z.string().min(2, "Please enter your name.").max(100)),
  company: clean().pipe(z.string().max(120)).optional().default(""),
  phone: clean().pipe(z.string().regex(/^\+?[\d\s()-]{8,18}$/, "Please enter a valid phone number.")),
  email: clean().pipe(z.email("Please enter a valid email address.").max(160)),
  product: clean().pipe(z.string().min(2, "Tell us what the sample or product is.").max(150)),
  requirement: z.enum(REQUIREMENT_OPTIONS, { error: "Please choose a testing requirement." }),
  standard: clean().pipe(z.string().max(80)).optional().default(""),
  message: clean(true).pipe(z.string().max(2000, "Please keep the message under 2000 characters.")).optional().default(""),
});

export type QuoteInput = z.infer<typeof quoteSchema>;
