"use client";

import { motion, useReducedMotion } from "motion/react";

// Illustrative detector trace — decorative, carries no measured data.
const trace =
  "M0 150 L40 150 Q52 150 56 132 T66 60 T76 146 L120 148 Q132 148 136 124 T146 96 T156 148 L200 149 Q212 149 216 110 T226 30 T236 147 L290 148 Q300 148 304 128 T314 110 T324 148 L380 149 Q390 149 394 138 T404 126 T414 149 L460 150";

const peaks = [
  { x: 66, y: 60, label: "A" },
  { x: 146, y: 96, label: "B" },
  { x: 226, y: 30, label: "C" },
  { x: 314, y: 110, label: "D" },
];

export function Chromatogram() {
  const reduce = useReducedMotion();
  const draw = reduce
    ? {}
    : {
        initial: { pathLength: 0 },
        whileInView: { pathLength: 1 },
        viewport: { once: true, margin: "-15%" },
        transition: { duration: 2.6, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <svg viewBox="0 0 460 180" className="mt-6 w-full" role="img" aria-label="Illustrative analytical signal trace">
      <defs>
        <linearGradient id="chrom-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#0a4d8c" stopOpacity="0.18" />
          <stop offset="1" stopColor="#0a4d8c" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[30, 70, 110, 150].map((y) => (
        <line key={y} x1="0" x2="460" y1={y} y2={y} stroke="#dbe7f3" strokeDasharray="3 5" />
      ))}
      <motion.path
        d={`${trace} L460 170 L0 170 Z`}
        fill="url(#chrom-fill)"
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 1.4 }}
      />
      <motion.path d={trace} fill="none" stroke="#0a4d8c" strokeWidth="2" strokeLinecap="round" {...draw} />
      {peaks.map((p, i) => (
        <motion.g
          key={p.label}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 + i * 0.35 }}
        >
          <line x1={p.x} x2={p.x} y1={p.y - 6} y2={p.y - 18} stroke="#3aa8d8" />
          <circle cx={p.x} cy={p.y - 24} r="7" fill="#fff" stroke="#3aa8d8" />
          <text x={p.x} y={p.y - 21} textAnchor="middle" fontSize="8" fontWeight="700" fill="#063b73">
            {p.label}
          </text>
        </motion.g>
      ))}
      <line x1="0" x2="460" y1="170" y2="170" stroke="#9fb3c8" />
    </svg>
  );
}
