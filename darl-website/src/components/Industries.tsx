import { industries } from "@/content/site";
import { Icon } from "./Icon";
import { RevealLi, SectionHeading } from "./Reveal";

export function Industries() {
  return (
    <section id="industries" aria-labelledby="industries-title" className="py-24 sm:py-32">
      <div className="container-lab">
        <SectionHeading
          id="industries-title"
          eyebrow="Industries served"
          align="center"
          title="Built for the sectors where quality is non-negotiable."
          lead="Our testing supports producers, processors, manufacturers and buyers across eight industry groups."
        />

        <ul className="mt-14 grid grid-cols-2 overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-4 [&>li]:bg-white" style={{ gap: 1 }}>
          {industries.map((ind, i) => (
            <RevealLi
              key={ind.title}
              delay={(i % 4) * 0.06}
              y={12}
              className="group relative flex min-h-40 flex-col justify-between p-6 transition-colors duration-500 hover:!bg-navy sm:min-h-48 sm:p-8"
            >
              <span className="flex items-center justify-between">
                <Icon name={ind.icon} className="h-8 w-8 text-blue transition-colors duration-500 group-hover:text-cyan" />
                <span className="font-display text-[0.7rem] font-bold tracking-[0.2em] text-ink-muted/60 transition-colors group-hover:text-white/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>
              <span className="mt-8 font-display text-base font-bold text-ink transition-colors duration-500 group-hover:text-white sm:text-lg">
                {ind.title}
              </span>
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-cyan transition-transform duration-700 ease-lab group-hover:scale-x-100"
              />
            </RevealLi>
          ))}
        </ul>
      </div>
    </section>
  );
}
