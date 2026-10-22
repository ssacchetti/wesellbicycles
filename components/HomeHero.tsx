"use client";

// Home poster. Deliberately the mirror of the /we-buy hero ("We Buy
// Bicycles.") – same lock-up, same photo-ghost parallax – so the two sides
// of the business read as one brand.
//
// PLACEHOLDER PHOTO: Unsplash 0TPSP3L6RmA, greyscale, public/home-hero.jpg.

import Image from "next/image";
import Link from "next/link";
import { useParallax } from "@/lib/use-parallax";
import { PAUSED } from "@/lib/site-status";

const HERO_IMAGE = {
  src: "/home-hero.jpg",
  alt: "A carbon road bike with deep-section wheels",
};

export default function HomeHero() {
  const { section: sectionRef, image: imageRef, headline: headlineRef } = useParallax();

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden border-b-[1.5px] border-ink bg-paper"
    >
      <div aria-hidden="true" className="absolute inset-x-0 -bottom-[25%] -top-[25%] -z-10">
        <div ref={imageRef} className="relative h-full w-full will-change-transform">
          <Image
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            fill
            priority
            sizes="100vw"
            quality={50}
            className="object-cover object-[center_60%] opacity-40"
            style={{ filter: "grayscale(1) contrast(1.35) brightness(0.92)" }}
          />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-paper to-transparent"
      />

      <div className="relative mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-page flex-col px-5 pb-10 pt-8 sm:px-8 sm:pb-14 sm:pt-12 lg:min-h-[820px] lg:px-12">
        <div className="flex items-start justify-end gap-4">
          <InStockPill />
        </div>

        <div className="flex flex-1 flex-col justify-center py-8 sm:py-12">
          <h1
            ref={headlineRef}
            className="display-mega text-[clamp(3.4rem,15vw,11rem)] will-change-transform"
          >
            <span className="block animate-fade-up opacity-0 [animation-delay:500ms]">
              We&nbsp;Sell
            </span>
            <span className="block animate-fade-up opacity-0 [animation-delay:700ms]">
              <span className="highlight">Bicycles</span>
              <span className="text-ink">.</span>
            </span>
          </h1>
        </div>

        <div className="mt-auto border-t-[1.5px] border-ink pt-6 sm:pt-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-12 sm:gap-6">
            <div className="sm:col-span-7">
              <p className="display-tight text-[clamp(1.4rem,3vw,2.1rem)] text-ink">
                <span className="whitespace-nowrap">Road bikes</span> <Dot />{" "}
                <span className="whitespace-nowrap">Parts</span> <Dot />{" "}
                <span className="whitespace-nowrap">Workshop checked</span>
              </p>
              <p className="mt-4 max-w-prose text-[1rem] leading-[1.55] text-ink/75">
                Used road bikes and the bits that go on them – every one gone
                over in the workshop and priced straight. Pick up in Melbourne,
                or we&apos;ll ship it anywhere in Australia.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 sm:col-span-5 sm:justify-end">
              <Link href="/shop" className="btn-yellow">
                Shop the bikes
                <ArrowRight />
              </Link>
              {!PAUSED && (
                <Link href="/we-buy" className="btn-ghost">
                  Sell us yours
                  <ArrowRight />
                </Link>
              )}
            </div>
          </div>
        </div>
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

function InStockPill() {
  return (
    <span className="inline-flex items-center gap-2 border-[1.5px] border-ink bg-accent px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-cap text-ink">
      <span className="inline-block h-[0.42rem] w-[0.42rem] animate-ticker-pulse rounded-full bg-ink" />
      New stock weekly
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
