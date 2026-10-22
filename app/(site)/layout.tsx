import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ToolbarBottomTint from "@/components/ToolbarBottomTint";

// Everything except checkout: full nav, footer, the cart drawer, and the
// iOS 26 bottom-toolbar tint anchor.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main id="top" className="relative overflow-clip">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <ToolbarBottomTint />
    </>
  );
}
