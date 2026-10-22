// Full-bleed yellow band pointing at /we-buy – the buy side of the business,
// one click from anywhere it's dropped. Renders nothing while PAUSED.

import Link from "next/link";
import { PAUSED } from "@/lib/site-status";

export default function SellBand() {
  if (PAUSED) return null;
  return (
    <section className="border-b-[1.5px] border-ink bg-accent text-ink">
      <div className="mx-auto flex max-w-page flex-col gap-8 px-5 py-14 sm:px-8 sm:py-16 md:flex-row md:items-end md:justify-between lg:px-12 lg:py-20">
        <div>
          <span className="font-mono text-[0.7rem] uppercase tracking-cap">
            § We buy, too
          </span>
          <p className="display-mega mt-3 max-w-3xl text-[clamp(2.4rem,6.5vw,5.2rem)]">
            Road bike in the shed? We&apos;ll buy it.
          </p>
          <p className="mt-4 max-w-prose text-[1rem] leading-relaxed text-ink/80">
            Fair cash offer in under 12 hours. We pick up across Melbourne and
            Geelong and pay on the day.
          </p>
        </div>
        <Link href="/we-buy" className="btn-primary shrink-0 self-start md:self-end">
          Get a cash offer
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
