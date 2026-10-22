import type { Metadata } from "next";
import OrderConfirmation from "@/components/OrderConfirmation";

export const metadata: Metadata = {
  title: "Order placed",
  robots: { index: false, follow: false },
};

export default function ConfirmationPage() {
  return <OrderConfirmation />;
}
