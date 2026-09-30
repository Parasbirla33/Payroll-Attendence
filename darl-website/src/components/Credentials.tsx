import { credentials, site } from "@/content/site";
import { Icon } from "./Icon";
import { Reveal, RevealLi } from "./Reveal";

export function Credentials() {
  return (
    <section id="accreditations" aria-labelledby="credentials-title" className="relative isolate overflow-hidden bg-navy-deep py-24 text-white sm:py-32">
      <div className="bg-grid absolute inset-0 -z-10 opacity-40 invert" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute -right-40 -top-40 -z-10 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgb(58_168_216/0.22),transparent_65%)]"
      />
      <div className="container-lab">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <Reveal>
            <p className="eyebrow !text-cyan">Accreditations & compliance</p>
            <h2 id="credentials-title" className="section-title mt-4 !text-white">
              Credentials you can check — not just read.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-white/70">
              Recognition from regulators and accreditation bodies matters in testing, so we treat it with care. We publish a
              credential only with its certificate number and scope, and invite you to verify it with the issuing body. For
              anything not listed as verified, ask us for current certificates before you commission testing.
            </p>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {credentials.map((c, i) => (
            <RevealLi
              key={c.id}
              delay={(i % 3) * 0.08}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition-colors duration-500 hover:border-white/25 hover:bg-white/[0.07]"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="font-display text-3xl font-extrabold tracking-tight">{c.acronym}</span>
                {c.verified ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                    <Icon name="shield" className="h-3.5 w-3.5" /> Verified
                  </span>
                ) : (
                  <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-white/60">
                    Details on request
                  </span>
                )}
              </div>
              <p className="mt-4 text-sm font-semibold text-white/85">{c.body}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{c.about}</p>

              {c.verified && (c.certificateNo || c.validUntil) ? (
                <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-5 text-sm">
                  {c.certificateNo && (
                    <div>
                      <dt className="text-xs text-white/50">Certificate no.</dt>
                      <dd className="font-semibold">{c.certificateNo}</dd>
                    </div>
                  )}
                  {c.validUntil && (
                    <div>
                      <dt className="text-xs text-white/50">Valid until</dt>
                      <dd className="font-semibold">{c.validUntil}</dd>
                    </div>
                  )}
                </dl>
              ) : null}

              <div className="mt-auto pt-6">
                {c.verified && c.scopeUrl ? (
                  <a href={c.scopeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan hover:text-white">
                    View scope <Icon name="external" className="h-4 w-4" />
                  </a>
                ) : (
                  <a
                    href={`mailto:${site.email}?subject=${encodeURIComponent(`${c.acronym} certificate and scope`)}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-cyan hover:text-white"
                  >
                    Request certificate & scope <Icon name="arrow" className="h-4 w-4" />
                  </a>
                )}
              </div>
            </RevealLi>
          ))}
        </ul>
      </div>
    </section>
  );
}
