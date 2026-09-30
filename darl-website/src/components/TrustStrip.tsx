import { trustItems } from "@/content/site";

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {trustItems.map((item) => (
        <li key={item} className="flex items-center gap-10 pr-10 font-display text-sm font-semibold uppercase tracking-[0.16em] text-white/85 sm:text-[0.9rem]">
          {item}
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-cyan" aria-hidden="true">
            <path d="M6 0 7.4 4.6 12 6 7.4 7.4 6 12 4.6 7.4 0 6 4.6 4.6Z" fill="currentColor" />
          </svg>
        </li>
      ))}
    </ul>
  );
}

export function TrustStrip() {
  return (
    <section aria-label="At a glance" className="relative overflow-hidden bg-navy py-5">
      <div className="bg-grid absolute inset-0 opacity-30 invert" aria-hidden="true" />
      {/* Static, wrapped list on reduced motion; a slow marquee otherwise. */}
      <div className="relative flex w-max animate-marquee motion-reduce:w-full motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center">
        <Row />
        <div className="contents motion-reduce:hidden">
          <Row hidden />
        </div>
      </div>
    </section>
  );
}
