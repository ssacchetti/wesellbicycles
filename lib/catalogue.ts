// MOCK CATALOGUE – stands in for Shopify until the Storefront API is wired
// up (see lib/shop.ts). Prices AUD. Every bike is one-of-a-kind (qty 1);
// some parts carry a few units or size variants.
//
// Photos: Unsplash (Unsplash License), self-hosted in public/products/ in
// COLOUR and shown in colour; only sold items are greyed with CSS
// (ProductCard brings them back to colour on hover). Source photo IDs:
//   specialized-venge-pro-2020 0TPSP3L6RmA · giant-contend-ar-2022 v-lou6eJYWg
//   trek-checkpoint-alr-5 QKxMM74BG-I · surly-steamroller waMJ8EEhs00
//   cinelli-gazzetta JK6lD_y3aDg · fuji-track-classic gvmxJHJRbYw
//   raleigh-sports-1978 VOxdK4HD2ic · acelane-steel-frameset Dt470_BtHWg
//   shimano-105-r7000-groupset INSLq5D1WWc · campagnolo-veloce-groupset nrdPAnacAW8
//   sram-rival-crankset T-N3W0VPpy0 · mavic-aksium-wheelset 9oYHSMxt7tg
//   zipp-service-course-bars JQGGf6OuIdQ · brooks-b17-saddle gAijzx69yoM

import type { Category, Grade, Image, Product } from "@/lib/product";

type Draft = {
  handle: string;
  title: string;
  vendor: string;
  type: Category;
  price: number;
  compareAt?: number;
  grade: Grade;
  year?: number;
  /** One entry per variant. Omit for a single one-size unit. */
  sizes?: { size: string; qty: number }[];
  qty?: number;
  description: string;
  specs: [string, string][];
  workshopNote: string;
  listedAt: string;
  tags?: string[];
  /** Extra gallery shots (handles of other product photos). */
  detail?: string[];
  alt: string;
};

function img(handle: string, alt: string): Image {
  return { url: `/products/${handle}.jpg`, altText: alt, width: 1200, height: 900 };
}

function money(n: number) {
  return { amount: n.toFixed(2), currencyCode: "AUD" as const };
}

function product(d: Draft): Product {
  const featured = img(d.handle, d.alt);
  const sizes = d.sizes ?? [{ size: "", qty: d.qty ?? 1 }];
  return {
    id: `gid://shopify/Product/${d.handle}`,
    handle: d.handle,
    title: d.title,
    vendor: d.vendor,
    productType: d.type,
    tags: d.tags ?? [],
    description: d.description,
    featuredImage: featured,
    images: [featured, ...(d.detail ?? []).map((h) => img(h, `${d.title} – detail`))],
    priceRange: { minVariantPrice: money(d.price) },
    variants: sizes.map((s) => ({
      id: `gid://shopify/ProductVariant/${d.handle}${s.size ? `-${s.size}` : ""}`,
      title: s.size || "Default Title",
      availableForSale: s.qty > 0,
      quantityAvailable: s.qty,
      price: money(d.price),
      compareAtPrice: d.compareAt ? money(d.compareAt) : null,
      selectedOptions: s.size ? [{ name: "Size", value: s.size }] : [],
    })),
    grade: d.grade,
    year: d.year ?? null,
    specs: d.specs,
    workshopNote: d.workshopNote,
    listedAt: d.listedAt,
  };
}

export const catalogue: Product[] = [
  product({
    handle: "specialized-venge-pro-2020",
    title: "Venge Pro",
    vendor: "Specialized",
    type: "Bikes",
    price: 5400,
    compareAt: 6200,
    grade: "A",
    year: 2020,
    sizes: [{ size: "56cm", qty: 1 }],
    description:
      "One owner, garage kept, mostly weekend bunch rides. Aero frame, Ultegra Di2, deep DT Swiss carbon hoops. It's quick and it looks it.",
    specs: [
      ["Frame", "FACT 11r carbon, aero"],
      ["Size", "56cm"],
      ["Groupset", "Shimano Ultegra Di2 R8070, 2×11"],
      ["Brakes", "Hydraulic disc"],
      ["Wheels", "DT Swiss ARC 1400 Dicut 62"],
      ["Weight", "7.6kg (as listed)"],
    ],
    workshopNote: "New chain and cassette, brakes bled, Di2 firmware updated.",
    listedAt: "2026-10-20",
    tags: ["carbon", "disc", "electronic"],
    detail: ["shimano-105-r7000-groupset", "mavic-aksium-wheelset"],
    alt: "Black aero road bike with deep-section carbon wheels",
  }),
  product({
    handle: "giant-contend-ar-2022",
    title: "Contend AR 2",
    vendor: "Giant",
    type: "Bikes",
    price: 1450,
    grade: "B",
    year: 2022,
    sizes: [{ size: "54cm", qty: 1 }],
    description:
      "Endurance geometry, wide tyres, disc brakes. The bike you actually ride every day – commutes, coffee loops, the odd gravel shortcut.",
    specs: [
      ["Frame", "ALUXX aluminium"],
      ["Size", "54cm (M)"],
      ["Groupset", "Shimano Tiagra, 2×10"],
      ["Brakes", "Mechanical disc"],
      ["Tyres", "Giant Gavia AC, 32mm"],
    ],
    workshopNote: "Full service, new bar tape, true and tension both wheels.",
    listedAt: "2026-10-18",
    tags: ["aluminium", "disc", "endurance"],
    detail: ["sram-rival-crankset"],
    alt: "Black endurance road bike against a concrete wall",
  }),
  product({
    handle: "trek-checkpoint-alr-5",
    title: "Checkpoint ALR 5",
    vendor: "Trek",
    type: "Bikes",
    price: 2100,
    grade: "B",
    year: 2021,
    sizes: [{ size: "56cm", qty: 1 }],
    description:
      "Gravel bike that's just as happy on the Beach Road bunch. Racks and mudguard mounts everywhere, GRX gearing for the hills.",
    specs: [
      ["Frame", "Alpha 300 aluminium"],
      ["Size", "56cm"],
      ["Groupset", "Shimano GRX 600/800, 2×11"],
      ["Brakes", "Hydraulic disc"],
      ["Tyres", "Bontrager GR1, 40mm, tubeless"],
    ],
    workshopNote: "Fresh sealant, new brake pads, rear derailleur hanger aligned.",
    listedAt: "2026-10-15",
    tags: ["gravel", "disc"],
    alt: "Gravel bike leaning on a stone bridge rail",
  }),
  product({
    handle: "surly-steamroller",
    title: "Steamroller",
    vendor: "Surly",
    type: "Bikes",
    price: 890,
    grade: "B",
    year: 2017,
    sizes: [{ size: "54cm", qty: 1 }],
    description:
      "Steel fixed/free with drop bars and white rims. Bulletproof, simple, and nothing to service except the chain.",
    specs: [
      ["Frame", "4130 CroMoly steel"],
      ["Size", "54cm"],
      ["Drivetrain", "Single speed, flip-flop hub, 42×17"],
      ["Brakes", "Front caliper"],
      ["Wheels", "Alloy, white"],
    ],
    workshopNote: "New chain and cog, headset regreased.",
    listedAt: "2026-10-12",
    tags: ["steel", "single-speed"],
    alt: "Steel single-speed with white rims locked to a rack",
  }),
  product({
    handle: "cinelli-gazzetta",
    title: "Gazzetta della Strada",
    vendor: "Cinelli",
    type: "Bikes",
    price: 780,
    grade: "C",
    year: 2018,
    sizes: [{ size: "55cm", qty: 1 }],
    description:
      "Columbus steel, single speed, set up for the city. Some paint chips on the top tube; rides like it's brand new.",
    specs: [
      ["Frame", "Columbus Cromor steel"],
      ["Size", "55cm"],
      ["Drivetrain", "Single speed, 46×16"],
      ["Brakes", "Dual-pivot calipers"],
      ["Tyres", "Vittoria Zaffiro, 28mm"],
    ],
    workshopNote: "Touched-up chips, new tyres and cables.",
    listedAt: "2026-10-02",
    tags: ["steel", "single-speed"],
    alt: "Black steel city bike with white-wall tyres",
  }),
  product({
    handle: "fuji-track-classic",
    title: "Track Classic",
    vendor: "Fuji",
    type: "Bikes",
    price: 620,
    grade: "B",
    year: 2019,
    sizes: [{ size: "54cm", qty: 0 }],
    description: "Hi-ten steel track frame with a flip-flop hub. Already gone to a good home.",
    specs: [
      ["Frame", "Hi-ten steel, track geometry"],
      ["Size", "54cm"],
      ["Drivetrain", "Fixed / free, 46×16"],
      ["Brakes", "Front caliper"],
    ],
    workshopNote: "Full strip and rebuild.",
    listedAt: "2026-09-21",
    tags: ["steel", "fixed"],
    alt: "Silver track bike against a white wall",
  }),
  product({
    handle: "raleigh-sports-1978",
    title: "Sports '78",
    vendor: "Raleigh",
    type: "Bikes",
    price: 340,
    grade: "C",
    year: 1978,
    sizes: [{ size: "23in", qty: 1 }],
    description:
      "A proper old English three-speed. Patina everywhere, Sturmey-Archer hub still clicking through the gears after 48 years.",
    specs: [
      ["Frame", "Lugged steel"],
      ["Size", "23in"],
      ["Drivetrain", "Sturmey-Archer AW 3-speed hub"],
      ["Brakes", "Rod-free side-pulls"],
    ],
    workshopNote: "Hub overhauled, new tubes, rust treated.",
    listedAt: "2026-09-30",
    tags: ["steel", "vintage"],
    alt: "Vintage roadster leaning against a weathered wall",
  }),
  product({
    handle: "acelane-steel-frameset",
    title: "Steel Disc Frameset",
    vendor: "Acelane",
    type: "Framesets",
    price: 890,
    grade: "A",
    year: 2025,
    sizes: [{ size: "54cm", qty: 1 }],
    description:
      "Frame, fork and headset. Built up once, ridden twice, stripped back down. Your build starts here.",
    specs: [
      ["Material", "Reynolds 853 steel, carbon fork"],
      ["Size", "54cm"],
      ["Axles", "12mm thru-axle front and rear"],
      ["Brake mount", "Flat mount disc"],
      ["Included", "Frame, fork, headset, seatpost clamp"],
    ],
    workshopNote: "Frame alignment checked, BB shell faced.",
    listedAt: "2026-10-19",
    tags: ["steel", "disc"],
    alt: "Bare steel road frameset against a concrete wall",
  }),
  product({
    handle: "shimano-105-r7000-groupset",
    title: "105 R7000 Groupset",
    vendor: "Shimano",
    type: "Groupsets",
    price: 520,
    grade: "B",
    description:
      "Complete 11-speed rim-brake groupset off a low-kilometre build. Shifters, mechs, brakes, 52/36 crank and 11–30 cassette.",
    specs: [
      ["Speeds", "2×11"],
      ["Crank", "172.5mm, 52/36"],
      ["Cassette", "11–30"],
      ["Brakes", "Rim calipers"],
      ["Includes", "Shifters, derailleurs, brakes, crank, cassette, chain"],
    ],
    workshopNote: "Cleaned, measured for wear – chain at 0.25%.",
    listedAt: "2026-10-16",
    alt: "Rear derailleur and cassette close up",
  }),
  product({
    handle: "campagnolo-veloce-groupset",
    title: "Veloce Groupset (vintage)",
    vendor: "Campagnolo",
    type: "Groupsets",
    price: 260,
    grade: "C",
    year: 2004,
    description: "Silver 10-speed Veloce. Polished-up, all working, perfect for a retro steel build.",
    specs: [
      ["Speeds", "2×10"],
      ["Crank", "170mm, 53/39"],
      ["Finish", "Silver alloy"],
      ["Includes", "Ergopower levers, mechs, crank, brakes"],
    ],
    workshopNote: "Ergo levers rebuilt with new springs.",
    listedAt: "2026-09-26",
    tags: ["vintage"],
    alt: "Silver crankset and front derailleur close up",
  }),
  product({
    handle: "sram-rival-crankset",
    title: "Rival 1 Crankset",
    vendor: "SRAM",
    type: "Parts",
    price: 210,
    grade: "A",
    qty: 2,
    description: "1× crankset with a 42T narrow-wide ring. Takes a GXP bottom bracket.",
    specs: [
      ["Length", "172.5mm"],
      ["Chainring", "42T X-Sync"],
      ["Spindle", "GXP 24mm"],
    ],
    workshopNote: "Ring wear checked – nearly new.",
    listedAt: "2026-10-10",
    alt: "Crankset and bottom bracket close up",
  }),
  product({
    handle: "mavic-aksium-wheelset",
    title: "Aksium Wheelset",
    vendor: "Mavic",
    type: "Wheels",
    price: 280,
    grade: "B",
    description: "The tough-as-nails alloy training wheelset. Rim brake, 11-speed Shimano freehub, straight and true.",
    specs: [
      ["Brake", "Rim"],
      ["Freehub", "Shimano HG 11s"],
      ["Rim", "Alloy, 24mm deep"],
      ["Weight", "1,895g pair"],
    ],
    workshopNote: "Trued, hubs regreased, new rim tape.",
    listedAt: "2026-10-08",
    alt: "Close up of a bicycle wheel's spokes",
  }),
  product({
    handle: "zipp-service-course-bars",
    title: "Service Course SL-70 Bars",
    vendor: "Zipp",
    type: "Parts",
    price: 95,
    grade: "A",
    sizes: [
      { size: "40cm", qty: 1 },
      { size: "42cm", qty: 2 },
      { size: "44cm", qty: 0 },
    ],
    description: "Alloy compact drop bars, 70mm reach. Pulled off new builds before they ever saw a road.",
    specs: [
      ["Material", "7075 alloy"],
      ["Reach / drop", "70 / 128mm"],
      ["Clamp", "31.8mm"],
    ],
    workshopNote: "No scoring at the clamp area.",
    listedAt: "2026-10-05",
    alt: "Drop handlebars with black bar tape",
  }),
  product({
    handle: "brooks-b17-saddle",
    title: "B17 Leather Saddle",
    vendor: "Brooks",
    type: "Parts",
    price: 130,
    grade: "B",
    qty: 3,
    description: "Already broken in by someone else – which is the hard bit. Proofided and ready.",
    specs: [
      ["Material", "Leather, steel rails"],
      ["Width", "175mm"],
      ["Colour", "Brown"],
    ],
    workshopNote: "Cleaned and treated with Proofide.",
    listedAt: "2026-09-28",
    alt: "Brown leather Brooks saddle close up",
  }),
];
