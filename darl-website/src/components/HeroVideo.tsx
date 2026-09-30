"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

type NetworkInfo = { saveData?: boolean; effectiveType?: string };

/**
 * The DARL brand film. Autoplays muted/looped/inline, but:
 * - does not autoplay for prefers-reduced-motion, Save-Data or 2G connections
 *   (the poster stays up and the viewer can press play);
 * - pauses while scrolled out of view or the tab is hidden;
 * - serves a 480p rendition to small screens via <source media>.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: NetworkInfo }).connection;
    const constrained = !!conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType ?? "");
    if (reduce || constrained) userPaused.current = true;

    const tryPlay = () => {
      if (userPaused.current) return;
      video.play().catch(() => {
        /* Autoplay blocked (e.g. low-power mode): the poster remains. */
      });
    };

    let inView = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) tryPlay();
        else video.pause();
      },
      { threshold: 0.15 },
    );
    io.observe(video);

    const onVisibility = () => {
      if (document.hidden) video.pause();
      else if (inView) tryPlay();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      void video.play();
    } else {
      userPaused.current = true;
      video.pause();
    }
  };

  return (
    <>
      <video
        ref={ref}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
        muted
        loop
        playsInline
        preload="metadata"
        poster="/media/hero-poster.webp"
        aria-hidden="true"
        tabIndex={-1}
        disablePictureInPicture
        onPlaying={() => {
          setReady(true);
          setPlaying(true);
        }}
        onPause={() => setPlaying(false)}
        onLoadedData={() => setReady(true)}
      >
        <source src="/media/hero-480.webm" type="video/webm" media="(max-width: 767px)" />
        <source src="/media/hero-480.mp4" type="video/mp4" media="(max-width: 767px)" />
        <source src="/media/hero-720.webm" type="video/webm" />
        <source src="/media/hero-720.mp4" type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        className="absolute bottom-4 right-4 z-20 grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-navy-night/35 text-white backdrop-blur-md transition hover:bg-navy-night/60"
        aria-label={playing ? "Pause background film" : "Play background film"}
      >
        <Icon name={playing ? "pause" : "play"} className="h-4 w-4" strokeWidth={2.2} />
      </button>
    </>
  );
}
