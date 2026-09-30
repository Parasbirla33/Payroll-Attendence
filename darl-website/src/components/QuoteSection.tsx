import { site } from "@/content/site";
import { Icon } from "./Icon";
import { QuoteForm } from "./QuoteForm";
import { Reveal } from "./Reveal";

export function QuoteSection() {
  return (
    <section id="quote" aria-labelledby="quote-title" className="relative isolate overflow-hidden bg-navy py-24 sm:py-32">
      <div className="bg-grid absolute inset-0 -z-10 opacity-40 invert" aria-hidden="true" />
      <div aria-hidden="true" className="absolute -left-48 bottom-0 -z-10 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgb(58_168_216/0.25),transparent_65%)]" />

      <div className="container-lab grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal className="text-white">
          <p className="eyebrow !text-cyan">Request a test / quote</p>
          <h2 id="quote-title" className="section-title mt-4 !text-white">
            Not sure which test you need?
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/70">
            Tell us about your product and why you need it tested. We’ll recommend the right tests and the standard to test
            against — then confirm sample quantity, timelines and cost.
          </p>

          <ul className="mt-10 grid gap-4">
            {[
              "Advice on the applicable standard and tests",
              "Clear sample submission guidance",
              "A professional report at the end",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3 text-white/85">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-cyan">
                  <Icon name="check" className="h-4 w-4" strokeWidth={2.2} />
                </span>
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-12 grid gap-3 border-t border-white/15 pt-8 sm:grid-cols-2 lg:grid-cols-1">
            <a href={site.phone.href} className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
              <Icon name="phone" className="h-5 w-5 text-cyan" />
              <span>
                <span className="block text-xs text-white/55">Call the lab</span>
                <span className="font-display font-bold">{site.phone.display}</span>
              </span>
            </a>
            <a href={`mailto:${site.email}`} className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
              <Icon name="mail" className="h-5 w-5 text-cyan" />
              <span className="min-w-0">
                <span className="block text-xs text-white/55">Email</span>
                <span className="block truncate font-display font-bold">{site.email}</span>
              </span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="shadow-[0_40px_80px_-30px_rgb(0_0_0/0.5)]">
          <QuoteForm />
        </Reveal>
      </div>
    </section>
  );
}
