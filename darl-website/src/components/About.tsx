import { evidenceChain, site } from "@/content/site";
import { Reveal, RevealLi } from "./Reveal";
import { Chromatogram } from "./Chromatogram";
import { Icon } from "./Icon";

const pillars = [
  { icon: "flask", title: "Analytical depth", text: "Testing across food, water, environment, pharmaceuticals, plastics and industrial materials under one roof." },
  { icon: "shield", title: "Quality & compliance", text: "Work planned around the standard or specification your product is expected to meet." },
  { icon: "report", title: "Reports you can use", text: "Clear, professional test reports that support decisions, audits and submissions." },
] as const;

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative py-24 sm:py-32">
      <div className="container-lab grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <p className="eyebrow">About DARL</p>
            <h2 id="about-title" className="section-title mt-4">
              An analytical partner for products that have to <span className="text-blue">prove themselves.</span>
            </h2>
            <p className="section-lead">
              Since {site.established}, {site.name} has supported manufacturers, suppliers and businesses from
              its laboratory in {site.address.lines[0]}, New Delhi — turning samples into dependable data on quality
              and compliance.
            </p>
            <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
              Our approach is captured in a simple line we live by: <em className="font-semibold not-italic text-navy">“{site.tagline}.”</em>{" "}
              Understand the product and the requirement first — then test with precision.
            </p>
          </Reveal>

          <ul className="mt-12 grid gap-4">
            {pillars.map((p, i) => (
              <RevealLi
                key={p.title}
                delay={i * 0.08}
                className="group flex gap-5 rounded-2xl border border-line bg-white p-5 transition-[border-color,box-shadow] duration-500 ease-lab hover:border-blue/30 hover:shadow-card"
              >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-sky text-navy transition group-hover:bg-navy group-hover:text-white">
                    <Icon name={p.icon} className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="block font-display text-lg font-bold text-ink">{p.title}</span>
                    <span className="mt-1 block leading-relaxed text-ink-soft">{p.text}</span>
                  </span>
              </RevealLi>
            ))}
          </ul>
        </div>

        <Reveal delay={0.1} className="lg:pt-10">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-line bg-gradient-to-b from-sky to-white p-6 shadow-card sm:p-8">
            <div className="bg-grid absolute inset-0 opacity-60" aria-hidden="true" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-ink-muted">From sample to confidence</p>
                <span className="flex items-center gap-2 text-[0.7rem] font-semibold text-blue">
                  <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-cyan" /> Method
                </span>
              </div>
              <Chromatogram />
              <ol className="mt-8 grid grid-cols-5 gap-2">
                {evidenceChain.map((step, i) => (
                  <li key={step} className="relative text-center">
                    <span className="mx-auto grid h-9 w-9 place-items-center rounded-full border border-blue/25 bg-white font-display text-xs font-bold text-navy shadow-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {i < evidenceChain.length - 1 && (
                      <span aria-hidden="true" className="absolute left-[calc(50%+1.25rem)] right-[calc(-50%+1.25rem)] top-[1.1rem] h-px bg-gradient-to-r from-blue/40 to-blue/10" />
                    )}
                    <span className="mt-3 block font-display text-[0.7rem] font-bold text-ink sm:text-sm">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
