import { nav, services, site } from "@/content/site";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative isolate overflow-hidden bg-navy-night text-white">
      <div className="bg-grid absolute inset-0 -z-10 opacity-25 invert" aria-hidden="true" />
      <div className="container-lab py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <Logo tone="light" />
            <p className="mt-6 max-w-sm leading-relaxed text-white/60">{site.description}</p>
            <p className="mt-6 font-display text-sm font-semibold italic text-cyan">“{site.tagline}”</p>
          </div>

          <nav aria-label="Services">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] !text-white/45">Services</h2>
            <ul className="mt-5 grid gap-3">
              {services.map((s) => (
                <li key={s.id}>
                  <a href="#services" className="text-white/75 transition hover:text-white">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] !text-white/45">Explore</h2>
            <ul className="mt-5 grid gap-3">
              {[...nav, { href: "#accreditations", label: "Accreditations" }, { href: "#quote", label: "Request a Test" }].map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-white/75 transition hover:text-white">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] !text-white/45">Contact</h2>
            <ul className="mt-5 grid gap-4 text-white/75">
              <li className="flex gap-3">
                <Icon name="pin" className="mt-1 h-4 w-4 shrink-0 text-cyan" />
                <span>{site.address.lines.join(", ")}</span>
              </li>
              <li>
                <a href={site.phone.href} className="flex gap-3 hover:text-white">
                  <Icon name="phone" className="mt-1 h-4 w-4 shrink-0 text-cyan" /> {site.phone.display}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="flex gap-3 break-all hover:text-white">
                  <Icon name="mail" className="mt-1 h-4 w-4 shrink-0 text-cyan" /> {site.email}
                </a>
              </li>
            </ul>
            <a href="#quote" className="btn-primary mt-7 !bg-white !text-navy hover:!bg-sky">
              Request Testing <Icon name="arrow" className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p>Established {site.established} · New Delhi, India</p>
        </div>
      </div>
    </footer>
  );
}
