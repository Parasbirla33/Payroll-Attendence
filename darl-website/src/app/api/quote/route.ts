import { NextResponse, type NextRequest } from "next/server";
import { MAX_UPLOAD_BYTES, quoteSchema, type QuoteFieldErrors } from "@/lib/quote-schema";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { validateUpload, type SafeUpload } from "@/lib/upload";
import { mailerConfigured, sendEnquiry } from "@/lib/mailer";
import { site } from "@/content/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = MAX_UPLOAD_BYTES + 64 * 1024; // file + form fields
const MIN_FILL_MS = 3000; // humans take longer than this to fill the form

const json = (status: number, body: Record<string, unknown>, headers?: HeadersInit) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

function sameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === (req.headers.get("x-forwarded-host") ?? req.headers.get("host"));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  // 1. Cross-site form posts are rejected (CSRF / drive-by spam).
  if (!sameOrigin(req)) return json(403, { error: "Forbidden." });

  // 2. Rate limit: 5 enquiries per IP per 15 minutes.
  const limit = rateLimit(`quote:${clientIp(req.headers)}`, 5, 15 * 60 * 1000);
  if (!limit.ok) {
    return json(
      429,
      { error: `Too many requests. Please try again later or call us on ${site.phone.display}.` },
      { "Retry-After": String(limit.retryAfter) },
    );
  }

  // 3. Size cap before the body is buffered.
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (!declared || declared > MAX_BODY_BYTES) return json(413, { error: "The submission is too large." });
  if (!req.headers.get("content-type")?.startsWith("multipart/form-data")) return json(415, { error: "Unsupported request." });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return json(400, { error: "Could not read the form. Please try again." });
  }

  // 4. Bot traps: hidden honeypot field and a minimum fill time. Bots get a
  //    generic success so they learn nothing.
  const startedAt = Number(form.get("startedAt"));
  if (String(form.get("website") ?? "") !== "" || !startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return json(200, { ok: true });
  }

  // 5. Schema validation (whitelisted fields only).
  const field = (k: string) => {
    const v = form.get(k);
    return typeof v === "string" ? v : undefined;
  };
  const parsed = quoteSchema.safeParse({
    name: field("name") ?? "",
    company: field("company"),
    phone: field("phone") ?? "",
    email: field("email") ?? "",
    product: field("product") ?? "",
    requirement: field("requirement") ?? "",
    standard: field("standard"),
    message: field("message"),
  });

  const errors: QuoteFieldErrors = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof QuoteFieldErrors;
      errors[key] ??= issue.message;
    }
  }

  // 6. Optional attachment: type, size and content-signature checks.
  let attachment: SafeUpload | undefined;
  const doc = form.get("document");
  if (doc instanceof File && doc.size > 0) {
    const result = await validateUpload(doc);
    if (result.ok) attachment = result.file;
    else errors.document = result.error;
  }

  if (!parsed.success || Object.keys(errors).length) {
    return json(422, { error: "Please check the highlighted fields.", fields: errors });
  }

  const d = parsed.data;
  const text = [
    `New testing enquiry from the website`,
    ``,
    `Name:        ${d.name}`,
    `Company:     ${d.company || "—"}`,
    `Phone:       ${d.phone}`,
    `Email:       ${d.email}`,
    `Product:     ${d.product}`,
    `Requirement: ${d.requirement}`,
    `Standard:    ${d.standard || "—"}`,
    `Attachment:  ${attachment ? attachment.filename : "—"}`,
    ``,
    `Message:`,
    d.message || "—",
  ].join("\n");

  if (!mailerConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[quote] SMTP not configured — enquiry logged instead of emailed:\n" + text);
      return json(200, { ok: true });
    }
    console.error("[quote] SMTP is not configured; enquiry could not be delivered.");
    return json(503, { error: `We couldn't send your enquiry just now. Please email ${site.email} or call ${site.phone.display}.` });
  }

  try {
    await sendEnquiry({ subject: `Testing enquiry: ${d.requirement} — ${d.name}`, text, replyTo: d.email, attachment });
  } catch (err) {
    console.error("[quote] Failed to send enquiry", err instanceof Error ? err.message : err);
    return json(502, { error: `We couldn't send your enquiry just now. Please email ${site.email} or call ${site.phone.display}.` });
  }

  return json(200, { ok: true });
}
