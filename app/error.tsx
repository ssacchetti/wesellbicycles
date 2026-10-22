"use client";

import Link from "next/link";
import { PAUSED } from "@/lib/site-status";
import { WHATSAPP_NUMBER } from "@/lib/contact";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center bg-paper px-5 py-20 text-ink">
      <div className="max-w-prose text-center">
        <span className="eyebrow">§ Error – Off the chain</span>
        <h1 className="display-mega mt-4 text-[clamp(3rem,10vw,7rem)]">
          Something broke<span className="text-accent">.</span>
        </h1>
        <p className="mt-6 text-[1.05rem] leading-relaxed text-ink/75">
          {PAUSED ? (
            "Try reloading."
          ) : (
            <>
              Try reloading. If that&apos;s no use,{" "}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-accent decoration-[3px] underline-offset-4 hover:text-accent"
              >
                message us on WhatsApp
              </a>{" "}
              and we&apos;ll sort it.
            </>
          )}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={reset} className="btn-primary">
            Try again
          </button>
          <Link href="/" className="btn-ghost">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
