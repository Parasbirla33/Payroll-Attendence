import { MAX_UPLOAD_BYTES } from "./quote-constants";

type Kind = { ext: string[]; mime: string; magic: (b: Uint8Array) => boolean };

// The declared MIME type and file name are client-controlled, so the file's
// leading bytes are checked too. Only inert document/image formats are allowed.
const KINDS: Kind[] = [
  { ext: ["pdf"], mime: "application/pdf", magic: (b) => b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46 },
  { ext: ["png"], mime: "image/png", magic: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  { ext: ["jpg", "jpeg"], mime: "image/jpeg", magic: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
];

export type SafeUpload = { filename: string; content: Buffer; contentType: string };

export async function validateUpload(file: File): Promise<{ ok: true; file: SafeUpload } | { ok: false; error: string }> {
  if (file.size === 0) return { ok: false, error: "The attached file is empty." };
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, error: "Attachments must be 5 MB or smaller." };

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const kind = KINDS.find((k) => k.ext.includes(ext));
  if (!kind) return { ok: false, error: "Please attach a PDF, JPG or PNG file." };

  const content = Buffer.from(await file.arrayBuffer());
  if (!kind.magic(content)) return { ok: false, error: "The attachment does not look like a valid PDF, JPG or PNG file." };

  const base = file.name
    .replace(/\.[^.]+$/, "")
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "_")
    .replace(/^[._]+/, "")
    .slice(0, 60);

  return { ok: true, file: { filename: `${base || "document"}.${kind.ext[0]}`, content, contentType: kind.mime } };
}
