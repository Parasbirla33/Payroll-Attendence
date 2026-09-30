import { services } from "@/content/site";

// Shared by the client form and the server schema. Kept free of zod so the
// client bundle stays small.
export const REQUIREMENT_OPTIONS = [...services.map((s) => s.title), "Not sure — need advice", "Other"] as const;
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
export const ACCEPTED_UPLOADS = ".pdf,.jpg,.jpeg,.png";
export const PREFILL_EVENT = "darl:prefill-service";

export type QuoteFieldName = "name" | "company" | "phone" | "email" | "product" | "requirement" | "standard" | "message" | "document";
export type QuoteFieldErrors = Partial<Record<QuoteFieldName, string>>;
