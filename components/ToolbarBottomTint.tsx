"use client";

import { usePathname } from "next/navigation";
import { useOnDark } from "@/lib/use-on-dark";

/**
 * Deterministic anchor for iOS Safari's bottom URL-bar tint.
 *
 * iOS 26 Safari picks the toolbar tint by sampling the background colour
 * of `position: fixed` / `position: sticky` elements near the viewport
 * edge. Without a stable anchor it falls back to body bg, but the
 * sampling timing is loose – the bar can get "stuck" on the last
 * colour after the user scrolls between light and dark sections.
 *
 * This renders a 12px-tall fixed strip pinned to the viewport bottom,
 * with its bg dynamically flipped between paper and ink based on
 * whether any `data-nav-bg="dark"` section is currently overlapping the
 * bottom edge. The strip itself sits at `z-index: -1` so it's hidden
 * behind the body background (invisible to users), but Safari still
 * sees it for sampling.
 *
 * Net effect: the bar visually merges with whatever section is at the
 * bottom of the viewport – looks transparent over both light and dark
 * sections instead of getting stuck.
 *
 * The top toolbar is already deterministic because the Nav itself is
 * `position: sticky` with a paper/ink swap driven by the same
 * `data-nav-bg` convention; Safari samples the Nav directly.
 */
export default function ToolbarBottomTint() {
  const pathname = usePathname();
  const overDark = useOnDark(
    () => [window.innerHeight - 8, window.innerHeight],
    { key: pathname }
  );

  return (
    <div
      aria-hidden="true"
      style={{ zIndex: -1 }}
      className={`pointer-events-none fixed inset-x-0 bottom-0 h-3 transition-colors duration-200 ${
        overDark ? "bg-ink" : "bg-paper"
      }`}
    />
  );
}
