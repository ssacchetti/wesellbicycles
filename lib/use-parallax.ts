"use client";

import { useEffect, useRef } from "react";

/**
 * Two-layer poster parallax shared by the home and /we-buy heroes:
 *   - image lags scroll (~0.30×), drifting *with* the page
 *   - headline leads scroll (~0.10×), drifting *against* the page
 * rAF-throttled; does nothing under prefers-reduced-motion. Attach the
 * returned refs to the section, the image wrapper and the headline.
 */
export function useParallax() {
  const section = useRef<HTMLElement>(null);
  const image = useRef<HTMLDivElement>(null);
  const headline = useRef<HTMLHeadingElement & HTMLParagraphElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const apply = () => {
      const s = section.current;
      const i = image.current;
      const h = headline.current;
      if (!s || !i || !h) return;

      const rect = s.getBoundingClientRect();
      // Skip when the section is comfortably off-screen
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;

      i.style.transform = `translate3d(0, ${-rect.top * 0.3}px, 0)`;
      h.style.transform = `translate3d(0, ${rect.top * 0.1}px, 0)`;
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return { section, image, headline };
}
