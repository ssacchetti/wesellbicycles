import type { Metadata } from "next";
import CartView from "@/components/CartView";

export const metadata: Metadata = {
  title: "Cart",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-page px-5 pb-20 pt-12 sm:px-8 sm:pb-24 sm:pt-16 lg:px-12 lg:pb-32">
        <header className="mb-10">
          <span className="eyebrow">§ Cart</span>
          <h1 className="display-mega mt-3 text-[clamp(3rem,10vw,7rem)]">Your cart.</h1>
        </header>
        <CartView />
      </div>
    </section>
  );
}
