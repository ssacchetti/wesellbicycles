"use client";

import { useEffect, useState } from "react";

/**
 * Keep an overlay mounted for `ms` after `open` goes false, so its exit
 * transition can play before it leaves the DOM. Fixed overlays must truly
 * unmount when hidden – iOS 26 Safari samples fixed elements for toolbar
 * tinting even at opacity 0.
 */
export function useMounted(open: boolean, ms: number): boolean {
  const [lingering, setLingering] = useState(false);
  const [prevOpen, setPrevOpen] = useState(open);

  // Adjust state during render (not in an effect) when `open` flips.
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (!open) setLingering(true);
  }

  useEffect(() => {
    if (!lingering) return;
    const t = window.setTimeout(() => setLingering(false), ms);
    return () => window.clearTimeout(t);
  }, [lingering, ms]);

  return open || lingering;
}

/**
 * Mirror `open` one frame late. On first mount a CSS transition has nothing
 * to animate from, so classes keyed off this value fade/slide in properly.
 */
export function useEntered(open: boolean): boolean {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const r = requestAnimationFrame(() => setEntered(open));
    return () => cancelAnimationFrame(r);
  }, [open]);
  return entered;
}

/** Lock body scroll and close on Esc while `open`. */
export function useModal(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
}
