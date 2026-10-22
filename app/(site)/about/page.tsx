import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { WHATSAPP_NUMBER, INSTAGRAM_URL } from "@/lib/contact";
import { PAUSED } from "@/lib/site-status";

// PLACEHOLDER COPY – written for the mockup. Swap in the real story,
// and confirm the pickup/inspection details, before launch.

export const metadata: Metadata = {
  title: "About & Contact",
  description:
    "We buy used road bikes, fix them properly and sell them on – across Melbourne and Geelong. Shop pickups in Melbourne by appointment, questions on WhatsApp.",
  alternates: { canonical: "/about" },
};

const loop = [
  ["We buy", "Road bikes and parts from riders across Melbourne and Geelong. Fair cash, collected from the door."],
  ["We fix", "Every one goes on the stand. Worn parts replaced, brakes and gears set up, test ridden."],
  ["We sell", "Graded honestly, photographed as-is, priced so it moves – and on to its next rider."],
];

const visit = [
  ["Message us", "Tell us which bike and when suits. WhatsApp is quickest."],
  ["Pick a time", "Pickups and test rides are by appointment – we'll send the address."],
  ["Ride it", "Have a proper go. If it's not right, no hard feelings."],
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b-[1.5px] border-ink bg-paper">
        <div className="mx-auto max-w-page px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:px-12 lg:pb-24">
          <span className="eyebrow">§ About</span>
          <h1 className="display-mega mt-6 max-w-5xl text-[clamp(3rem,10vw,8.5rem)]">
            Bought. Fixed. <span className="highlight">Sold.</span>
          </h1>
          <p className="mt-8 max-w-prose text-[1.1rem] leading-relaxed text-ink/80">
            Good road bikes spend too long hanging in sheds. We buy them, bring
            them back to how they should ride, and pass them on at a price that
            makes sense – for the rider selling and the one buying.
          </p>

          <ol className="mt-14 grid grid-cols-1 border-t-[1.5px] border-ink md:grid-cols-3">
            {loop.map(([t, b], i) => (
              <li
                key={t}
                className={`flex flex-col gap-5 border-b-[1.5px] border-ink py-8 md:py-10 ${
                  i < 2 ? "md:border-r-[1.5px] md:pr-8" : ""
                } ${i > 0 ? "md:pl-8" : ""}`}
              >
                <span className="numeral text-[clamp(3.5rem,7vw,5.5rem)]">0{i + 1}</span>
                <div>
                  <h2
                    className="text-[1.6rem] uppercase leading-none"
                    style={{ fontVariationSettings: '"wdth" 80, "opsz" 48', fontWeight: 800, letterSpacing: "-0.02em" }}
                  >
                    {t}
                  </h2>
                  <p className="mt-3 text-[0.98rem] leading-relaxed text-ink/75">{b}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Service areas */}
      <section data-nav-bg="dark" className="border-b-[1.5px] border-ink bg-ink text-paper">
        <div className="mx-auto max-w-page px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
          <Reveal>
            <header className="reveal-fade mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="font-mono text-[0.7rem] uppercase tracking-cap text-accent">§ Where</span>
                <h2 className="display-mega mt-3 text-[clamp(2.6rem,7.5vw,6rem)]">Two cities.</h2>
              </div>
              <p className="max-w-sm text-[0.98rem] leading-relaxed text-paper/70">
                We buy bikes across both. Shop pickups and test rides are in
                Melbourne, by appointment – everywhere else in Australia, we ship.
              </p>
            </header>
          </Reveal>
          <div className="grid grid-cols-1 border-t-[1.5px] border-paper/25 md:grid-cols-2">
            {[
              ["Melbourne", "We buy across the greater metro – inner north, east, bayside, out to the Peninsula. Shop pickups and test rides happen here."],
              ["Geelong", "We buy and collect across Geelong and the Bellarine."],
            ].map(([city, area], i) => (
              <div
                key={city}
                className={`border-b-[1.5px] border-paper/25 py-10 md:border-b-0 ${
                  i === 0 ? "md:border-r-[1.5px] md:pr-12" : "md:pl-12"
                }`}
              >
                <p className="display-mega text-[clamp(3rem,8vw,6.5rem)] text-accent">{city}</p>
                <p className="mt-4 max-w-sm text-[1rem] leading-relaxed text-paper/75">{area}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit + contact */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-page grid-cols-1 gap-14 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-12 lg:px-12 lg:py-28">
          <div className="lg:col-span-7">
            <span className="eyebrow">§ See one in person</span>
            <h2 className="display-mega mt-3 text-[clamp(2.4rem,6vw,4.6rem)]">Come for a test ride.</h2>
            <ol className="mt-10 border-t-[1.5px] border-ink">
              {visit.map(([t, b], i) => (
                <li key={t} className="grid grid-cols-[3.5rem_1fr] gap-4 border-b-[1.5px] border-ink py-5">
                  <span className="numeral text-[2.4rem] text-ink/25">0{i + 1}</span>
                  <div>
                    <p className="text-[1.25rem] uppercase leading-none" style={{ fontVariationSettings: '"wdth" 80, "opsz" 48', fontWeight: 800 }}>
                      {t}
                    </p>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/70">{b}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <aside className="lg:col-span-5">
            <div className="border-[1.5px] border-ink bg-accent p-7 sm:p-8">
              <p className="field-label">Get in touch</p>
              <p className="display-tight mt-2 text-[clamp(2rem,4vw,2.8rem)]">WhatsApp is quickest.</p>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-ink/80">
                Questions about a bike, booking a test ride, or sending us one
                to buy – it all goes through the same thread.
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-6 w-full"
              >
                Message us on WhatsApp <span aria-hidden="true">→</span>
              </a>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t-[1.5px] border-ink pt-5 text-[0.92rem]">
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="underline decoration-[2px] underline-offset-4">
                  Instagram
                </a>
                <Link href="/shop" className="underline decoration-[2px] underline-offset-4">
                  Browse the shop
                </Link>
                {!PAUSED && (
                  <Link href="/we-buy" className="underline decoration-[2px] underline-offset-4">
                    Sell us a bike
                  </Link>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
