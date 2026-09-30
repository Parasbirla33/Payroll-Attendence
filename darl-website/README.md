# DARL — Delhi Analytical Research Laboratory website

Marketing site for DARL, built with **Next.js (App Router) + TypeScript + Tailwind CSS v4 + Motion**.
The DARL brand film is the hero visual.

```bash
cd darl-website
npm install
cp .env.example .env.local   # fill in SMTP settings + site URL
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

## Structure

| Path | Purpose |
| --- | --- |
| `src/content/site.ts` | **All copy and business data**: contact details, services, industries, standards, credentials, process |
| `src/components/*` | One component per section (`Hero`, `Services`, `Standards`, `Credentials`, `QuoteForm`, …) |
| `src/app/api/quote/route.ts` | Enquiry endpoint (validation, rate limiting, uploads, email) |
| `src/lib/*` | Server helpers: zod schema, rate limiter, upload checks, mailer |
| `public/media/*` | Encoded hero film, poster, stills, Open Graph image |
| `source-media/hero-original.mp4` | Master copy of the brand film (not served) |
| `scripts/encode-hero-video.sh` | Re-creates everything in `public/media` from the master |

## Hero video

The original 3.1 MB film (1280×720, 6 s, with audio) is encoded into:

| File | Size | Served to |
| --- | --- | --- |
| `hero-720.webm` (VP9) | ~1.0 MB | desktop, modern browsers |
| `hero-720.mp4` (H.264, faststart) | ~1.5 MB | desktop fallback (Safari/older) |
| `hero-480.webm` / `hero-480.mp4` | ~0.6 MB | screens ≤ 767px via `<source media>` |
| `hero-poster.webp` | 33 KB | first frame; preloaded as the LCP image |

Audio is stripped since the video always plays muted. The component (`HeroVideo.tsx`) plays `muted loop playsInline` with `preload="metadata"`, fades in over the poster once frames are ready, pauses when off-screen or the tab is hidden, and has a visible pause/play button. It does **not** autoplay when the visitor prefers reduced motion, has Save-Data on, or is on 2G; the poster stays up and the play button works.

If you update the film, replace `source-media/hero-original.mp4` and run `npm run encode-video` (needs `ffmpeg`). Rename the output files if they're already cached in production. `/media` is cached for 30 days.

## Enquiry form security

- Validation on the server with zod, using only whitelisted fields, length limits and control-character stripping. The native HTML constraints on the client are just for UX.
- Same-origin check on `Origin` to block cross-site posts.
- Rate limit of 5 submissions per IP per 15 minutes. The limiter lives in memory (`src/lib/rate-limit.ts`), which is fine on a single server. **On serverless or multi-instance hosting, back it with Redis/Upstash/Vercel KV.**
- Body size is capped before parsing. Uploads are optional, limited to 5 MB, and restricted to PDF/JPG/PNG. The server checks the extension **and the file's magic bytes**, cleans up the filename, and never writes the file to disk. It is only attached to the email.
- Spam protection uses a honeypot field plus a minimum fill time.
- Emails are plain text, so user input is never rendered as HTML. `replyTo` is set to the validated address.
- SMTP credentials exist only as server env vars (`SMTP_*`, `QUOTE_*`). Nothing secret uses the `NEXT_PUBLIC_` prefix. `src/lib/mailer.ts` is marked `server-only`.
- When SMTP isn't configured, enquiries are logged in development. In production the endpoint returns 503 and a message pointing to phone/email, so it never pretends a submission went through.

Security headers (CSP, HSTS, `X-Frame-Options`, `nosniff`, Referrer and Permissions policy) are set in `next.config.ts`.

## SEO and performance

- Metadata, Open Graph/Twitter cards, canonical URL, `sitemap.xml`, `robots.txt`, and `ProfessionalService` JSON-LD. Set `NEXT_PUBLIC_SITE_URL`.
- The page is statically prerendered. Fonts are self-hosted through `next/font`. Images go through `next/image`. The map iframe is lazy-loaded.
- Motion comes from `motion/react` plus CSS. Everything respects `prefers-reduced-motion`: reveals, marquee, chromatogram, canvas particles (drawn as one static frame) and the video.
- Accessibility: skip link, landmarks, labelled form fields with `aria-invalid` and error descriptions, `aria-live` status messages, keyboard-operable accordions and filters, and visible focus rings.

## Content to confirm before launch (`TODO(DARL)` in `src/content/site.ts`)

The site doesn't invent facts. These items need input from DARL:

1. **Accreditations.** Every credential ships with `verified: false`, which renders as "Details on request" with a link to ask for the certificate. The site never claims to hold one. Only after checking a certificate against the issuing body's register should you set `verified: true` and add `certificateNo`, `validUntil` and `scopeUrl`.
2. **Standards.** Short titles for IS 17425 and IS 16647 still need confirming. Please also check the other short titles against the current BIS editions. The page says listing a standard is not a claim of accreditation for it.
3. **Address.** Add the plot/building number and PIN code.
4. **Working hours.** The current values are placeholders.
5. **Laboratory photos.** The Infrastructure section uses stills from the brand film, captioned as such. Swap in real photos of the facility (`gallery` in `Infrastructure.tsx`).
6. **Service details.** These are deliberately general (sample types, not parameters). Add specific parameters only where DARL's scope covers them.
