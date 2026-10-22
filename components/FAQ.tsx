"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { useState } from "react";
import Reveal from "@/components/Reveal";
import { faqs } from "@/lib/faqs";
import { PAUSED } from "@/lib/site-status";

export default function FAQ() {
  const [open, setOpen] = useState<string>("");

  return (
    <section
      id="faq"
      className="relative border-b-[1.5px] border-ink bg-paper"
    >
      <div className="mx-auto max-w-page px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        <Reveal>
          <header className="mb-12 flex flex-col gap-5 md:mb-16 md:flex-row md:items-end md:justify-between reveal-fade">
            <div>
              <span className="eyebrow">§ 04 – Questions</span>
              <h2 className="display-mega mt-3 max-w-3xl text-[clamp(2.6rem,7.5vw,6rem)]">
                Common questions.
              </h2>
            </div>
            <p className="max-w-sm text-[0.98rem] leading-relaxed text-ink/70">
              The stuff people ask before sending us a bike. If yours
              isn&apos;t here, put it in the notes when you submit.
            </p>
          </header>
        </Reveal>

        <Accordion.Root
          type="single"
          collapsible
          value={open}
          onValueChange={setOpen}
          className="border-t-[1.5px] border-ink"
        >
          {faqs.map((item, i) => {
            const v = `item-${i}`;
            return (
              <Accordion.Item
                key={v}
                value={v}
                className="border-b-[1.5px] border-ink"
              >
                <Accordion.Header asChild>
                  <h3 className="m-0">
                    <Accordion.Trigger
                      // Grid columns: fixed number col · question · plus icon.
                      // The fixed first column means the question text starts
                      // at a known x-offset (col-1 width + gap), which we mirror
                      // as the answer's left padding below so they align.
                      className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-7 text-left transition-colors hover:bg-accent/15 data-[state=open]:bg-accent/15"
                      aria-label={item.q}
                    >
                      <span
                        aria-hidden="true"
                        className="font-mono text-[0.78rem] uppercase tracking-cap text-muted"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="text-[1.35rem] uppercase leading-[1.1] sm:text-[1.6rem]"
                        style={{
                          fontVariationSettings: '"wdth" 80, "opsz" 48',
                          fontWeight: 700,
                          letterSpacing: "-0.025em",
                        }}
                      >
                        {item.q}
                      </span>
                      <Plus className="shrink-0 transition-transform duration-[420ms] [transition-timing-function:cubic-bezier(.34,1.56,.64,1)] group-data-[state=open]:rotate-45" />
                    </Accordion.Trigger>
                  </h3>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=open]:animate-acc-open data-[state=closed]:animate-acc-close">
                  {/* pl-[3.5rem] = 2.5rem number col + 1rem grid gap →
                      aligns with the question text in the trigger above */}
                  <p className="max-w-prose pb-7 pl-[3.5rem] pr-10 text-[1rem] leading-relaxed text-ink/75">
                    {item.a}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
            );
          })}
        </Accordion.Root>

        {/* Final nudge */}
        {!PAUSED && (
          <div className="mt-14 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p
              className="text-[1.5rem] uppercase leading-tight sm:text-[1.9rem]"
              style={{
                fontVariationSettings: '"wdth" 80, "opsz" 48',
                fontWeight: 700,
                letterSpacing: "-0.025em",
              }}
            >
              Still wondering if it&apos;s worth our time?
            </p>
            <a href="#sell" className="btn-yellow">
              Send it anyway
              <Arrow />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 20 20"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <path d="M10 4v12M4 10h12" />
    </svg>
  );
}

function Arrow() {
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
