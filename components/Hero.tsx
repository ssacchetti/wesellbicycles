"use client";

/* eslint-disable react/no-unescaped-entities */
// Type-led poster hero with a treated photo ghost behind the lock-up
// and a parallax separation between the two layers on scroll:
//   - Image lags scroll (~0.30×), drifting *with* the page
//   - Headline leads scroll (~0.10×), drifting *against* the page
// rAF-throttled, prefers-reduced-motion honoured.
//
// PLACEHOLDER PHOTO: an Unsplash image, self-hosted at public/hero.jpg.
// Swap by replacing that file or editing HERO_IMAGE.

import Image from "next/image";
import { useParallax } from "@/lib/use-parallax";
import { PAUSED } from "@/lib/site-status";

const HERO_IMAGE = {
  src: "/hero.jpg",
  alt: "A used road bicycle",
};

export default function Hero() {
  // Paused swaps the <h1> poster for a <p>; only one is ever mounted, so
  // both take the same headline ref.
  const { section: sectionRef, image: imageRef, headline: headlineRef } = useParallax();

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden border-b-[1.5px] border-ink bg-paper"
    >
      {/* Photo ghost – extended bounds so the parallax translate doesn't
          expose the section edges. Treated to high-contrast grayscale at
          low opacity so the type stays the dominant element. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-[25%] -top-[25%] -z-10"
      >
        <div ref={imageRef} className="relative h-full w-full will-change-transform">
          <Image
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            fill
            priority
            sizes="100vw"
            // Shown faded and greyscale behind the type, so a lower quality
            // than next/image's default 75 isn't visible and saves ~35%.
            quality={50}
            className="object-cover object-[center_30%] opacity-40"
            style={{ filter: "grayscale(1) contrast(1.35) brightness(0.92)" }}
          />
        </div>
      </div>

      {/* Bottom fade – locked to the section, does NOT translate, so the
          CTA strap always sits on a clean field of paper. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-paper to-transparent"
      />

      <div className="relative mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-page flex-col px-5 pb-10 pt-8 sm:px-8 sm:pb-14 sm:pt-12 lg:min-h-[820px] lg:px-12">
        {PAUSED ? (
          <>
            {/* Paused: the whole first screen is the notice. The brand and
                keywords stay in the <h1> on the strap below. */}
            <div className="flex items-start justify-end gap-4">
              <PausedPill />
            </div>

            <div className="flex flex-1 flex-col justify-center py-8 sm:py-12">
              {/* "Back soon." is much shorter than "We Buy Bicycles", so it
                  can run bigger on phones (26vw) and sit centred there.
                  Desktop still hits the same 11rem cap as the normal hero. */}
              <p
                ref={headlineRef}
                className="display-mega text-center text-[clamp(3.4rem,26vw,11rem)] will-change-transform sm:text-left"
              >
                <span className="block animate-fade-up opacity-0 [animation-delay:500ms]">
                  Back
                </span>
                <span className="block animate-fade-up opacity-0 [animation-delay:700ms]">
                  <span className="highlight">Soon</span>
                  <span className="text-ink">.</span>
                </span>
              </p>
            </div>

            <div className="mt-auto border-t-[1.5px] border-ink pt-6 sm:pt-8">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-12 sm:gap-6">
                <div className="sm:col-span-7 lg:col-span-7">
                  <h1 className="display-tight text-[clamp(1.4rem,3vw,2.1rem)] text-ink">
                    <span className="whitespace-nowrap">We Buy Bicycles</span> <Dot />{" "}
                    <span className="whitespace-nowrap">Road bikes</span> <Dot />{" "}
                    <span className="whitespace-nowrap">Melbourne &amp; Geelong</span>
                  </h1>
                  <p className="mt-4 max-w-prose text-[1rem] leading-[1.55] text-ink/75">
                    We're not buying bikes right now, but we'll be back soon.
                    Check in again shortly.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-3 sm:col-span-5 sm:justify-end lg:col-span-5">
                  <a href="#how-it-works" className="btn-ghost">
                    How it works
                    <ArrowDown />
                  </a>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Top strip – status pill only */}
            <div className="flex items-start justify-end gap-4">
              <NowBuyingPill />
            </div>

            {/* The poster – spacer above pushes lock-up toward middle */}
            <div className="flex flex-1 flex-col justify-center py-8 sm:py-12">
              <h1
                ref={headlineRef}
                className="display-mega text-[clamp(3.4rem,15vw,11rem)] will-change-transform"
              >
                <span className="block animate-fade-up opacity-0 [animation-delay:500ms]">
                  We&nbsp;Buy
                </span>
                <span className="block animate-fade-up opacity-0 [animation-delay:700ms]">
                  <span className="highlight">Bicycles</span>
                  <span className="text-ink">.</span>
                </span>
              </h1>
            </div>

            {/* Bottom – strap of three scopes + CTA cluster */}
            <div className="mt-auto border-t-[1.5px] border-ink pt-6 sm:pt-8">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-12 sm:gap-6">
                {/* Scope strap */}
                <div className="sm:col-span-7 lg:col-span-7">
                  <p className="display-tight text-[clamp(1.4rem,3vw,2.1rem)] text-ink">
                    <span className="whitespace-nowrap">Road bikes</span> <Dot />{" "}
                    <span className="whitespace-nowrap">Any era</span> <Dot />{" "}
                    <span className="whitespace-nowrap">Any condition</span>
                  </p>
                  <p className="mt-4 max-w-prose text-[1rem] leading-[1.55] text-ink/75">
                    Got an old road bike going to waste? Sell it for cash – we'll
                    make you a fair offer, come to you across Melbourne or Geelong,
                    and pay on the day. No haggling, no consignment.
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-3 sm:col-span-5 sm:justify-end lg:col-span-5">
                  <a href="#sell" className="btn-yellow">
                    Talk to us
                    <ArrowRight />
                  </a>
                  <a href="#how-it-works" className="btn-ghost">
                    How it works
                    <ArrowDown />
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function Dot() {
  return (
    <span
      aria-hidden="true"
      className="mx-3 inline-block h-[0.45em] w-[0.45em] translate-y-[-0.18em] bg-accent"
    />
  );
}

function NowBuyingPill() {
  return (
    <span
      aria-label="Now buying"
      className="inline-flex items-center gap-2 border-[1.5px] border-ink bg-accent px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-cap text-ink"
    >
      <span className="inline-block h-[0.42rem] w-[0.42rem] animate-ticker-pulse rounded-full bg-ink" />
      Now buying
    </span>
  );
}

function PausedPill() {
  return (
    <span
      aria-label="Temporarily paused"
      className="inline-flex items-center gap-2 border-[1.5px] border-ink bg-accent px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-cap text-ink"
    >
      <span className="inline-block h-[0.42rem] w-[0.42rem] animate-ticker-pulse rounded-full bg-ink" />
      Temporarily paused
    </span>
  );
}

function ArrowRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 7h9M7.5 3l4 4-4 4" />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 2.5v9M3 7.5l4 4 4-4" />
    </svg>
  );
}
