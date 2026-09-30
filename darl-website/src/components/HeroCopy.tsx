"use client";

import { motion, useReducedMotion } from "motion/react";
import { site } from "@/content/site";
import { Icon } from "./Icon";

const ease = [0.22, 1, 0.36, 1] as const;

function Words({ text, delay, className }: { text: string; delay: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={`block ${className ?? ""}`}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: "105%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: delay + i * 0.07, ease }}
          >
            {word}
            {" "}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function HeroCopy({ stats }: { stats: { value: string; label: string }[] }) {
  const reduce = useReducedMotion();
  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease },
  });

  return (
    <div className="relative">
      <motion.p {...fade(0)} className="eyebrow">
        {site.name}
      </motion.p>

      <h1
        id="hero-title"
        className="mt-6 font-display text-[2.5rem] font-extrabold leading-[1.04] tracking-[-0.03em] sm:text-6xl lg:text-[3.4rem] xl:text-[4rem] 2xl:text-[4.4rem]"
      >
        <Words text="Testing Beyond Standards." delay={0.1} />
        <Words
          text="Trust Beyond Reports."
          delay={0.35}
          className="text-blue"
        />
      </h1>

      <motion.p {...fade(0.6)} className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
        {site.description}
      </motion.p>

      <motion.div {...fade(0.75)} className="mt-9 flex flex-wrap gap-3">
        <a href="#quote" className="btn-primary group">
          Request Testing
          <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
        </a>
        <a href="#services" className="btn-ghost">
          Explore Services
        </a>
      </motion.div>

      <motion.dl {...fade(0.9)} className="mt-12 grid max-w-lg grid-cols-3 divide-x divide-line border-t border-line pt-6">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col px-4 first:pl-0">
            <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">{s.label}</dt>
            <dd className="order-first font-display text-2xl font-extrabold text-navy sm:text-3xl">{s.value}</dd>
          </div>
        ))}
      </motion.dl>
    </div>
  );
}
