"use client";

import { useEffect, useState } from "react";

/**
 * True while any `data-nav-bg="dark"` section overlaps a horizontal band
 * of the viewport. The site's only cross-component coordination: Nav,
 * StickyMobileCTA, ToolbarBottomTint and StickyAddToCart all read it to
 * flip their own light/dark treatment (see the iOS 26 notes in each).
 *
 * `band` returns the [top, bottom] of the band in viewport px; it's called
 * on every rAF-throttled scroll/resize, so it may read window.innerHeight.
 * `onCompute` lets a caller piggy-back other per-scroll work on the same
 * listener (StickyMobileCTA uses it for its show/hide check). Components
 * that persist across route changes (Nav, ToolbarBottomTint) pass the
 * pathname as `key` so the new page gets measured straight away.
 */
export function useOnDark(
  band: () => [number, number],
  { onCompute, key }: { onCompute?: () => void; key?: string } = {}
): boolean {
  const [onDark, setOnDark] = useState(false);

  useEffect(() => {
    const compute = () => {
      const [top, bottom] = band();
      let dark = false;
      document.querySelectorAll('[data-nav-bg="dark"]').forEach((sec) => {
        const r = sec.getBoundingClientRect();
        if (r.top < bottom && r.bottom > top) dark = true;
      });
      setOnDark(dark);
      onCompute?.();
    };

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };

    // First read on the next frame, so route changes measure the new page.
    raf = requestAnimationFrame(compute);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
    // Callers pass inline closures; rebinding is only needed per page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return onDark;
}
