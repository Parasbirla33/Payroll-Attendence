"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { nav, site } from "@/content/site";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-lab ${
        scrolled || open
          ? "border-b border-line/80 bg-white/95 shadow-[0_8px_30px_-20px_rgb(16_42_67/0.35)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-lab flex h-[4.5rem] items-center justify-between gap-6">
        <a href="#top" aria-label={`${site.name} — home`} className="rounded-lg">
          <Logo />
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="group relative whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-ink-soft transition hover:text-navy"
                >
                  {item.label}
                  <span className="absolute inset-x-3.5 -bottom-0.5 h-px origin-left scale-x-0 bg-navy transition-transform duration-300 ease-lab group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href={site.phone.href} className="hidden items-center gap-2 whitespace-nowrap px-3 text-sm font-semibold text-navy 2xl:flex">
            <Icon name="phone" className="h-4 w-4" />
            {site.phone.display}
          </a>
          <a href="#quote" className="btn-primary hidden whitespace-nowrap !px-5 !py-2.5 sm:inline-flex">
            Request Testing
          </a>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-navy lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-white lg:hidden"
          >
            <ul className="container-lab flex flex-col py-4">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-line/70 py-4 font-display text-lg font-semibold text-ink"
                  >
                    {item.label}
                    <Icon name="arrow" className="h-4 w-4 text-blue" />
                  </a>
                </li>
              ))}
              <li className="mt-5 grid gap-3">
                <a href="#quote" onClick={() => setOpen(false)} className="btn-primary">
                  Request Testing
                </a>
                <a href={site.phone.href} className="btn-ghost">
                  <Icon name="phone" className="h-4 w-4" /> Call {site.phone.display}
                </a>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
