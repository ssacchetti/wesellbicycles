import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Off the map",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center bg-paper px-5 py-20 text-ink">
      <div className="max-w-prose text-center">
        <span className="eyebrow">§ 404 – Detour</span>
        <h1 className="display-mega mt-4 text-[clamp(3rem,10vw,7rem)]">
          Off the map<span className="text-accent">.</span>
        </h1>
        <p className="mt-6 text-[1.05rem] leading-relaxed text-ink/75">
          This page doesn&apos;t exist. Probably never did. Head back and
          we&apos;ll point you at the right bit.
        </p>
        <Link href="/shop" className="btn-primary mt-10">
          Back to the shop
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </main>
  );
}
