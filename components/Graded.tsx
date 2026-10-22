// Home: the dark "how we check every bike" section. The grade letters are
// real structure – they're the same A/B/C that appears on every product
// card and spec sheet – so they get the huge numerals treatment.

import Link from "next/link";
import Reveal from "@/components/Reveal";
import { GRADES, type Grade } from "@/lib/product";

const checks = [
  "Frame and fork inspected for cracks, dents and alignment",
  "Drivetrain measured for wear – chains, cassettes, rings",
  "Brakes bled or re-cabled, pads replaced if under half",
  "Wheels trued and tensioned, hubs and headset checked",
  "Test ridden before it's listed. Every time.",
];

export default function Graded() {
  return (
    <section
      data-nav-bg="dark"
      className="relative border-b-[1.5px] border-ink bg-ink text-paper"
    >
      <div className="mx-auto max-w-page px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        <Reveal>
          <header className="reveal-fade mb-14 flex flex-col gap-5 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="font-mono text-[0.7rem] uppercase tracking-cap text-accent">
                § 02 – Workshop
              </span>
              <h2 className="display-mega mt-3 max-w-3xl text-[clamp(2.6rem,7.5vw,6rem)]">
                Checked. Graded. Honest.
              </h2>
            </div>
            <p className="max-w-sm text-[0.98rem] leading-relaxed text-paper/70">
              Nothing goes up for sale until it&apos;s been on the stand. Then
              we grade it plainly, so the photos and the price line up with
              what turns up.
            </p>
          </header>
        </Reveal>

        <div className="grid grid-cols-1 border-t-[1.5px] border-paper/25 lg:grid-cols-12">
          {/* Checklist */}
          <div className="border-b-[1.5px] border-paper/25 py-10 lg:col-span-5 lg:border-b-0 lg:border-r-[1.5px] lg:py-12 lg:pr-12">
            <p className="field-label text-accent">On the stand</p>
            <ul className="mt-5 space-y-4">
              {checks.map((c) => (
                <li key={c} className="flex gap-4 text-[1rem] leading-relaxed sm:text-[1.05rem]">
                  <span aria-hidden="true" className="mt-[0.55em] h-[0.5em] w-[0.5em] shrink-0 bg-accent" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Grades */}
          <dl className="grid grid-cols-1 sm:grid-cols-3 lg:col-span-7">
            {(Object.keys(GRADES) as Grade[]).map((g, i) => (
              <div
                key={g}
                className={`flex flex-col gap-4 border-b-[1.5px] border-paper/25 py-10 sm:border-b-0 sm:px-6 lg:py-12 ${
                  i < 2 ? "sm:border-r-[1.5px]" : ""
                } ${i === 0 ? "sm:pl-0 lg:pl-12" : ""}`}
              >
                <dt>
                  <span className="numeral block text-[clamp(5rem,9vw,7.5rem)] text-accent">{g}</span>
                  <span
                    className="mt-3 block text-[1.35rem] uppercase leading-[1.05]"
                    style={{ fontVariationSettings: '"wdth" 80, "opsz" 48', fontWeight: 700 }}
                  >
                    {GRADES[g].label}
                  </span>
                </dt>
                <dd className="text-[0.95rem] leading-relaxed text-paper/70">{GRADES[g].blurb}</dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="mt-12 max-w-2xl border-t-[1.5px] border-paper/25 pt-8 text-[1rem] leading-relaxed text-paper/75 sm:text-[1.05rem]">
          Want to see it in person first?{" "}
          <Link
            href="/about"
            className="underline decoration-accent decoration-[3px] underline-offset-4 transition-colors hover:text-accent"
          >
            Book a look in Melbourne
          </Link>
          . No obligation.
        </p>
      </div>
    </section>
  );
}
