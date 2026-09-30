import Image from "next/image";
import { site, services, standards } from "@/content/site";
import { HeroVideo } from "./HeroVideo";
import { HeroCopy } from "./HeroCopy";
import { MoleculeField } from "./MoleculeField";

export function Hero() {
  const stats = [
    { value: String(site.established), label: "Established" },
    { value: String(services.length), label: "Testing domains" },
    { value: `${standards.length}`, label: "IS standards referenced" },
  ];

  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden pb-16 pt-24 sm:pt-32 lg:pb-24 lg:pt-36">
      {/* Backdrop: light-blue wash, measurement grid, molecular network */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_85%_10%,#dcecfb_0%,#eef6ff_40%,#ffffff_75%)]" />
      <div className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(90%_70%_at_60%_30%,#000_30%,transparent_80%)]" />
      <MoleculeField className="absolute inset-0 -z-10 h-full w-full opacity-70" />

      <div className="container-lab grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10 xl:gap-16">
        <HeroCopy stats={stats} />

        {/* The brand film, framed as a specimen window (shown first on small screens) */}
        <div className="relative order-first lg:order-none">
          <div
            aria-hidden="true"
            className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-[conic-gradient(from_200deg_at_60%_40%,#0a4d8c33,#3aa8d826,#eaf5ff00_55%,#0a4d8c26)] blur-2xl"
          />
          <figure className="relative aspect-[16/10] overflow-hidden rounded-[1.75rem] bg-navy-night shadow-film ring-1 ring-navy/10 sm:aspect-video lg:aspect-[16/11]">
            <Image
              src="/media/hero-poster.webp"
              alt=""
              fill
              priority
              fetchPriority="high"
              sizes="(min-width: 1024px) 56vw, 100vw"
              className="object-cover"
            />
            <HeroVideo />
            {/* Readability + integration: soft vignette and a lower gradient for the caption */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_60%,rgb(3_27_54/0.35))]" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-night/60 to-transparent" />
            {/* Viewfinder corners */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-4 sm:inset-5">
              {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "left-0 bottom-0 border-l border-b", "right-0 bottom-0 border-r border-b"].map(
                (c) => (
                  <span key={c} className={`absolute h-5 w-5 border-white/70 ${c}`} />
                ),
              )}
            </div>
            <figcaption className="absolute left-9 top-7 z-10 flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/90 sm:left-11 sm:top-8">
              <span className="h-2 w-2 animate-pulse-dot rounded-full bg-cyan" />
              DARL · New Delhi · Est. {site.established}
            </figcaption>
          </figure>

          {/* Floating evidence card */}
          <div className="absolute -bottom-8 left-4 hidden w-60 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-lift backdrop-blur-md sm:block lg:-left-10 xl:-left-14">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ink-muted">Sample to report</p>
            <svg viewBox="0 0 200 48" className="mt-2 h-12 w-full" aria-hidden="true">
              <path d="M0 40 H200" stroke="#dbe7f3" />
              <path
                className="hero-trace"
                d="M0 40 L30 40 Q38 40 42 30 T52 10 T62 36 L90 38 Q98 38 102 24 T112 18 T122 38 L150 39 Q156 39 159 32 T166 28 T172 39 L200 40"
                fill="none"
                stroke="#0a4d8c"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <div className="mt-2 flex items-center justify-between text-[0.7rem] font-semibold text-navy">
              <span>Sample</span>
              <span className="h-px flex-1 bg-line mx-2" />
              <span>Analysis</span>
              <span className="h-px flex-1 bg-line mx-2" />
              <span>Report</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
