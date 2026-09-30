"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { processSteps } from "@/content/site";
import { Icon, type IconName } from "./Icon";
import { SectionHeading } from "./Reveal";

const icons: IconName[] = ["report", "barcode", "flask", "chart", "shield"];

export function Process() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });
  const scale = useTransform(progress, [0, 1], [0, 1]);

  return (
    <section id="process" aria-labelledby="process-title" className="relative py-24 sm:py-32">
      <div className="container-lab">
        <SectionHeading
          id="process-title"
          eyebrow="How it works"
          align="center"
          title="From your requirement to a report you can rely on."
          lead="Five clear stages, with one point of contact from enquiry to report."
        />

        <ol ref={ref} className="relative mt-16 grid gap-10 lg:mt-20 lg:grid-cols-5 lg:gap-6">
          {/* Rail: vertical on mobile, horizontal on desktop; fills with scroll */}
          <span aria-hidden="true" className="absolute bottom-8 left-7 top-8 w-px bg-line lg:inset-x-[10%] lg:bottom-auto lg:left-[10%] lg:top-7 lg:h-px lg:w-auto" />
          <motion.span
            aria-hidden="true"
            style={reduce ? undefined : { scaleY: scale }}
            className="absolute bottom-8 left-7 top-8 w-px origin-top bg-gradient-to-b from-navy to-cyan lg:hidden"
          />
          <motion.span
            aria-hidden="true"
            style={reduce ? undefined : { scaleX: scale }}
            className="absolute left-[10%] right-[10%] top-7 hidden h-px origin-left bg-gradient-to-r from-navy to-cyan lg:block"
          />

          {processSteps.map((step, i) => (
            <motion.li
              key={step.title}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex gap-6 lg:flex-col lg:items-center lg:gap-0 lg:text-center"
            >
              <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-line bg-white text-navy shadow-card">
                <Icon name={icons[i]} className="h-6 w-6" />
                <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-navy font-display text-[0.65rem] font-bold text-white">
                  {i + 1}
                </span>
              </span>
              <span className="lg:mt-7">
                <span className="block font-display text-lg font-bold text-ink">{step.title}</span>
                <span className="mt-2 block text-[0.95rem] leading-relaxed text-ink-soft lg:px-2">{step.text}</span>
              </span>
            </motion.li>
          ))}
        </ol>

        <div className="mt-16 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
          <p className="text-ink-soft">Ready to start with step one?</p>
          <a href="#quote" className="inline-flex items-center gap-2 font-display font-bold text-blue hover:text-navy">
            Share your requirement <Icon name="arrow" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
