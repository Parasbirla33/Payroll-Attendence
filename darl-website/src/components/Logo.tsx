export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="11" fill="currentColor" />
      <path
        d="M16 9h8M18 9v8.5L11.3 29a2.4 2.4 0 0 0 2.1 3.6h13.2a2.4 2.4 0 0 0 2.1-3.6L22 17.5V9"
        fill="none"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="17.5" cy="26.5" r="1.9" fill="#3aa8d8" />
      <circle cx="23" cy="24" r="1.3" fill="#3aa8d8" />
    </svg>
  );
}

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const light = tone === "light";
  return (
    <span className="flex items-center gap-3">
      <LogoMark className={`h-10 w-10 shrink-0 ${light ? "text-white/10" : "text-navy"}`} />
      <span className="leading-none">
        <span className={`block font-display text-lg font-extrabold tracking-[0.08em] ${light ? "text-white" : "text-navy"}`}>
          DARL
        </span>
        <span
          className={`mt-1 hidden whitespace-nowrap text-[0.58rem] sm:block font-semibold uppercase tracking-[0.14em] ${
            light ? "text-white/60" : "text-ink-muted"
          }`}
        >
          Delhi Analytical Research Laboratory
        </span>
      </span>
    </span>
  );
}
