// Black ticker tape – runs beneath the hero like a SALE banner.
// CSS-only, pauses for reduced motion.

const BUY_ITEMS = [
  "Cash on the day",
  "Road bikes",
  "Any condition",
  "Free pickup",
  "Offer in 12 hrs",
  "No haggling",
  "No middlemen",
];

export default function MarqueeStrip({ items = BUY_ITEMS }: { items?: string[] }) {
  // Duplicate the list a few times for seamless loop on wide screens.
  const loop = [...items, ...items, ...items];

  return (
    <section
      aria-hidden="true"
      data-nav-bg="dark"
      className="relative overflow-hidden border-b-[1.5px] border-ink bg-ink text-paper"
    >
      <div className="flex animate-marquee whitespace-nowrap py-3.5 [animation-duration:42s] motion-reduce:animate-none">
        {loop.map((label, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-5 px-5 font-display text-[1.05rem] uppercase sm:text-[1.2rem]"
            style={{ fontVariationSettings: '"wdth" 80, "opsz" 96', fontWeight: 700 }}
          >
            <span className="text-accent">★</span>
            <span>{label}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
