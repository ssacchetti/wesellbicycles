"use client";

import Image from "next/image";
import { useState } from "react";
import type { Image as ProductImage } from "@/lib/product";

export default function ProductGallery({
  images,
  sold,
}: {
  images: ProductImage[];
  sold: boolean;
}) {
  const [index, setIndex] = useState(0);
  const current = images[index];

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden border-[1.5px] border-ink bg-ink/5">
        <Image
          key={current.url}
          src={current.url}
          alt={current.altText}
          fill
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
          quality={70}
          className={`object-cover ${sold ? "opacity-45 grayscale" : ""}`}
        />
        {sold && (
          <span
            aria-hidden="true"
            className="display-tight absolute inset-0 flex items-center justify-center text-[clamp(3.5rem,10vw,7rem)]"
          >
            <span className="-rotate-6 border-[4px] border-ink bg-paper px-6 pb-2 pt-4">Sold</span>
          </span>
        )}
        {images.length > 1 && (
          <span className="tabular absolute bottom-3 right-3 bg-ink px-2 py-1 text-[0.7rem] text-paper">
            {index + 1} / {images.length}
          </span>
        )}
      </div>

      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((img, i) => (
            <li key={img.url}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show photo ${i + 1} of ${images.length}`}
                aria-current={i === index}
                className={`relative block aspect-[4/3] w-full overflow-hidden border-[1.5px] transition-shadow ${
                  i === index ? "border-ink shadow-[inset_0_-4px_0_var(--color-accent)]" : "border-ink/25 hover:border-ink"
                }`}
              >
                <Image src={img.url} alt="" fill sizes="10rem" quality={40} className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
