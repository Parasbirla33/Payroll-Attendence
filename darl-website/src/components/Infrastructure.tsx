import Image from "next/image";
import { Icon, type IconName } from "./Icon";
import { Reveal, RevealLi, SectionHeading } from "./Reveal";

const capabilities: { icon: IconName; title: string; text: string }[] = [
  { icon: "barcode", title: "Sample receipt & coding", text: "Every sample is logged and coded on arrival so it can be traced from receipt to report." },
  { icon: "thermo", title: "Controlled handling", text: "Samples are stored and handled to protect their integrity until testing." },
  { icon: "microscope", title: "Analytical instrumentation", text: "Instrumental and wet-chemistry techniques selected to suit the sample and the requirement." },
  { icon: "pipe", title: "Physical & mechanical testing", text: "Dedicated set-ups for testing plastic pipes, fittings and industrial materials." },
  { icon: "chart", title: "Data review", text: "Results are checked and reviewed before a report is released." },
  { icon: "archive", title: "Records & reporting", text: "Organised records and professional reports that stand up to scrutiny." },
];

/*
 * Imagery: stills from the DARL brand film. Replace with photographs of the
 * actual laboratory (equipment, benches, sample room) as they become available.
 */
const gallery = [
  { src: "/media/hero-poster.webp", alt: "Visualisation of a sample chamber from the DARL brand film", caption: "Sample analysis", span: "sm:col-span-2 sm:row-span-2" },
  { src: "/media/molecules.webp", alt: "Visualisation of molecular structures from the DARL brand film", caption: "Chemical analysis", span: "" },
  { src: "/media/pipes.webp", alt: "Visualisation of plastic pipe testing from the DARL brand film", caption: "Pipe testing", span: "" },
];

export function Infrastructure() {
  return (
    <section id="infrastructure" aria-labelledby="infra-title" className="relative bg-sky/50 py-24 sm:py-32">
      <div className="container-lab">
        <SectionHeading
          id="infra-title"
          eyebrow="Laboratory infrastructure"
          title={
            <>
              Where samples become <span className="text-blue">evidence.</span>
            </>
          }
          lead="A laboratory organised around traceable sample handling, appropriate instrumentation and careful review."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-3 sm:grid-rows-2">
          {gallery.map((g, i) => (
            <Reveal key={g.src} delay={i * 0.08} className={`${g.span}`}>
              <figure className="group relative h-full min-h-56 overflow-hidden rounded-3xl bg-navy-night">
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  sizes={i === 0 ? "(min-width: 640px) 66vw, 100vw" : "(min-width: 640px) 33vw, 100vw"}
                  className="object-cover transition-transform duration-[1.4s] ease-lab group-hover:scale-105"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-night/70 via-transparent to-transparent" />
                <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-cyan/0 via-cyan/15 to-cyan/0 opacity-0 group-hover:animate-scan group-hover:opacity-100" />
                <figcaption className="absolute bottom-5 left-5 font-display text-sm font-bold text-white">{g.caption}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-muted">Images: visualisations from the DARL brand film.</p>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c, i) => (
            <RevealLi key={c.title} delay={(i % 3) * 0.06} y={12} className="flex gap-4 bg-white p-6 sm:p-7">
              <Icon name={c.icon} className="mt-0.5 h-6 w-6 shrink-0 text-blue" />
              <span>
                <span className="block font-display font-bold text-ink">{c.title}</span>
                <span className="mt-1.5 block text-[0.95rem] leading-relaxed text-ink-soft">{c.text}</span>
              </span>
            </RevealLi>
          ))}
        </ul>
      </div>
    </section>
  );
}
