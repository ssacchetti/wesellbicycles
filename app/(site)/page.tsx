import HomeHero from "@/components/HomeHero";
import MarqueeStrip from "@/components/MarqueeStrip";
import JustIn from "@/components/JustIn";
import Graded from "@/components/Graded";
import SellBand from "@/components/SellBand";

const SHOP_MARQUEE = [
  "Workshop checked",
  "Road bikes",
  "Parts",
  "Free Melbourne pickup",
  "Ships Australia-wide",
  "Priced straight",
  "One of one",
];

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <MarqueeStrip items={SHOP_MARQUEE} />
      <JustIn />
      <Graded />
      <SellBand />
    </>
  );
}
