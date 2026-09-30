"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { standards, type StandardCategory } from "@/content/site";
import { Icon } from "./Icon";
import { SectionHeading } from "./Reveal";

const categories = ["All", ...Array.from(new Set(standards.map((s) => s.category)))] as const;
type Filter = "All" | StandardCategory;

const normalise = (s: string) => s.toLowerCase().replace(/\s+/g, "");

export function Standards() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const q = useDeferredValue(query);

  const results = useMemo(() => {
    const needle = normalise(q);
    return standards
      .filter((s) => filter === "All" || s.category === filter)
      .filter((s) => !needle || normalise(`${s.code} ${s.title ?? ""} ${s.category}`).includes(needle))
      .sort((a, b) => Number(a.code.replace(/\D/g, "")) - Number(b.code.replace(/\D/g, "")));
  }, [q, filter]);

  return (
    <section id="standards" aria-labelledby="standards-title" className="relative overflow-hidden bg-sky/50 py-24 sm:py-32">
      <div className="container-lab">
        <SectionHeading
          id="standards-title"
          eyebrow="Standards & testing"
          title={
            <>
              Tested against the <span className="text-blue">Indian Standards</span> your product is specified to.
            </>
          }
          lead="Search the standards we reference for plastic pipe and fitting testing. Tell us the standard and clause you need — we confirm the applicable tests before work begins."
        />

        <div className="mt-12 rounded-3xl border border-line bg-white p-4 shadow-card sm:p-6">
          <div className="flex flex-col gap-4">
            <label className="relative block w-full max-w-md">
              <span className="sr-only">Search standards</span>
              <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search e.g. IS 4985, CPVC, irrigation"
                className="field !rounded-full !pl-12"
                aria-controls="standards-results"
              />
            </label>
            <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={filter === c}
                  onClick={() => setFilter(c)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition duration-300 ${
                    filter === c ? "border-navy bg-navy text-white" : "border-line bg-white text-ink-soft hover:border-blue/40 hover:text-navy"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-5 text-sm text-ink-muted" aria-live="polite">
            Showing {results.length} of {standards.length} standards
          </p>

          <ul id="standards-results" className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {results.map((s) => (
                <motion.li
                  layout
                  key={s.code}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="group flex gap-4 rounded-2xl border border-line bg-white p-4 transition-colors hover:border-blue/30 hover:bg-sky/40"
                >
                  <span className="grid h-12 min-w-[5.5rem] shrink-0 place-items-center whitespace-nowrap rounded-xl bg-navy px-2.5 font-display text-sm font-extrabold tracking-wide text-white">
                    {s.code}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.95rem] font-semibold leading-snug text-ink">
                      {s.title ?? "Indian Standard — refer to BIS for the current title"}
                    </span>
                    <span className="mt-1 block text-xs font-medium text-ink-muted">{s.category}</span>
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {results.length === 0 && (
            <div className="rounded-2xl border border-dashed border-line p-8 text-center">
              <p className="font-display font-bold text-ink">No listed standard matches “{query}”.</p>
              <p className="mt-1 text-sm text-ink-soft">
                Ask us — share the standard in your enquiry and we will confirm whether we can test to it.
              </p>
              <a href="#quote" className="btn-primary mt-5 !py-2.5">
                Ask about a standard
              </a>
            </div>
          )}
        </div>

        <p className="mt-5 max-w-3xl text-xs leading-relaxed text-ink-muted">
          Titles are abbreviated; the current edition published by the Bureau of Indian Standards is authoritative. Listing a
          standard here does not by itself indicate accreditation for it — the applicable scope for your sample is confirmed at
          enquiry.
        </p>
      </div>
    </section>
  );
}
