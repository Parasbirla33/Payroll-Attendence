import { site } from "@/content/site";
import { Icon } from "./Icon";
import { Reveal, SectionHeading } from "./Reveal";

export function Contact() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`;
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapQuery)}`;

  return (
    <section id="contact" aria-labelledby="contact-title" className="py-24 sm:py-32">
      <div className="container-lab">
        <SectionHeading id="contact-title" eyebrow="Contact" title="Visit or reach the laboratory." />

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="grid gap-4">
            <address className="not-italic">
              <ul className="grid gap-4">
                <li className="flex gap-4 rounded-2xl border border-line p-5">
                  <Icon name="pin" className="mt-0.5 h-6 w-6 shrink-0 text-blue" />
                  <span>
                    <span className="block font-display font-bold text-ink">{site.name}</span>
                    {site.address.lines.map((l) => (
                      <span key={l} className="block text-ink-soft">
                        {l}
                      </span>
                    ))}
                    <a href={directions} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-blue hover:text-navy">
                      Get directions <Icon name="external" className="h-3.5 w-3.5" />
                    </a>
                  </span>
                </li>
                <li>
                  <a href={site.phone.href} className="flex gap-4 rounded-2xl border border-line p-5 transition hover:border-blue/30 hover:bg-sky/40">
                    <Icon name="phone" className="mt-0.5 h-6 w-6 shrink-0 text-blue" />
                    <span>
                      <span className="block text-sm text-ink-muted">Phone</span>
                      <span className="font-display text-lg font-bold text-ink">{site.phone.display}</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.email}`} className="flex gap-4 rounded-2xl border border-line p-5 transition hover:border-blue/30 hover:bg-sky/40">
                    <Icon name="mail" className="mt-0.5 h-6 w-6 shrink-0 text-blue" />
                    <span className="min-w-0">
                      <span className="block text-sm text-ink-muted">Email</span>
                      <span className="block break-all font-display text-lg font-bold text-ink">{site.email}</span>
                    </span>
                  </a>
                </li>
                <li className="flex gap-4 rounded-2xl border border-line p-5">
                  <Icon name="clock" className="mt-0.5 h-6 w-6 shrink-0 text-blue" />
                  <span className="w-full">
                    <span className="block text-sm text-ink-muted">Working hours</span>
                    <dl className="mt-1 grid gap-1">
                      {site.hours.map((h) => (
                        <div key={h.days} className="flex justify-between gap-4 text-ink">
                          <dt>{h.days}</dt>
                          <dd className="font-semibold">{h.time}</dd>
                        </div>
                      ))}
                    </dl>
                  </span>
                </li>
              </ul>
            </address>
          </Reveal>

          <Reveal delay={0.1} className="relative min-h-[22rem] overflow-hidden rounded-3xl border border-line bg-sky">
            <iframe
              title={`Map showing ${site.name}, ${site.address.lines[0]}`}
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 grayscale-[35%] contrast-[1.05]"
              allowFullScreen
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
