"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { services, type Service } from "@/content/site";
import { Icon } from "./Icon";
import { RevealLi, SectionHeading } from "./Reveal";
import { PREFILL_EVENT } from "@/lib/quote-constants";

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const [open, setOpen] = useState(false);
  const panelId = `service-${service.id}-details`;

  return (
    <RevealLi
      delay={(index % 3) * 0.08}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white p-7 transition-[border-color,box-shadow,transform] duration-500 ease-lab hover:-translate-y-1 hover:border-blue/25 hover:shadow-lift"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {/* Pointer-following light, like a lens sweeping the bench */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(320px circle at var(--mx, 50%) var(--my, 0%), rgb(234 245 255 / 0.95), transparent 70%)" }}
      />

      <div className="relative flex items-start justify-between">
        <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-sky text-navy transition-colors duration-500 group-hover:bg-navy group-hover:text-white">
          <svg viewBox="0 0 56 56" className="absolute inset-0 h-full w-full text-blue/40 transition-transform duration-[1.6s] ease-lab group-hover:rotate-180" aria-hidden="true">
            <circle cx="28" cy="28" r="26.5" fill="none" stroke="currentColor" strokeDasharray="2 5" />
          </svg>
          <Icon name={service.icon} className="h-6 w-6" />
        </span>
        <span className="font-display text-xs font-bold tracking-[0.2em] text-ink-muted/70">{String(index + 1).padStart(2, "0")}</span>
      </div>

      <h3 className="relative mt-7 text-xl font-bold">{service.title}</h3>
      <p className="relative mt-3 leading-relaxed text-ink-soft">{service.summary}</p>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden"
          >
            <div className="pt-5">
              <p className="text-[0.95rem] leading-relaxed text-ink-soft">{service.detail}</p>
              <p className="mt-5 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-ink-muted">Typical sample types</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {service.sampleTypes.map((t) => (
                  <li key={t} className="rounded-full border border-line bg-sky/60 px-3 py-1 text-xs font-medium text-navy">
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-ink-muted">
                Exact parameters, methods and sample quantity are confirmed with you before testing.
              </p>
              <a
                href="#quote"
                onClick={() => window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: service.title }))}
                className="mt-5 inline-flex items-center gap-2 font-display text-sm font-bold text-blue hover:text-navy"
              >
                Request {service.title.toLowerCase()} <Icon name="arrow" className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative mt-auto pt-7">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between border-t border-line pt-5 text-left font-display text-sm font-bold text-navy"
        >
          {open ? "Show less" : "What we test"}
          <span className={`grid h-8 w-8 place-items-center rounded-full border border-line transition-transform duration-500 ease-lab ${open ? "rotate-45 bg-navy text-white" : ""}`}>
            <Icon name="plus" className="h-4 w-4" strokeWidth={2} />
          </span>
        </button>
      </div>
    </RevealLi>
  );
}

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="relative bg-sky/50 py-24 sm:py-32">
      <div className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,#000,transparent_70%)]" aria-hidden="true" />
      <div className="container-lab relative">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            id="services-title"
            eyebrow="Testing services"
            title={
              <>
                Six testing domains. <span className="text-blue">One standard of rigour.</span>
              </>
            }
            lead="From a single ingredient to a finished industrial product, we plan each test around the requirement you need to meet."
          />
          <a href="#quote" className="btn-ghost shrink-0 self-start lg:self-auto">
            Discuss your requirement <Icon name="arrow" className="h-4 w-4" />
          </a>
        </div>

        <ul className="mt-14 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
