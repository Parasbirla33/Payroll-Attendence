import "server-only";
import nodemailer from "nodemailer";
import type { SafeUpload } from "./upload";

// Credentials are read from server-side environment variables only.
function transport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  const port = Number(SMTP_PORT || 465);
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export function mailerConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendEnquiry(opts: { subject: string; text: string; replyTo: string; attachment?: SafeUpload }) {
  const t = transport();
  if (!t) throw new Error("SMTP is not configured");
  const to = process.env.QUOTE_TO_EMAIL || "darltesting@gmail.com";
  const from = process.env.QUOTE_FROM_EMAIL || process.env.SMTP_USER!;
  // Plain-text body only: user input is never rendered as HTML.
  await t.sendMail({
    to,
    from,
    replyTo: opts.replyTo,
    subject: opts.subject,
    text: opts.text,
    attachments: opts.attachment
      ? [{ filename: opts.attachment.filename, content: opts.attachment.content, contentType: opts.attachment.contentType }]
      : undefined,
  });
}
