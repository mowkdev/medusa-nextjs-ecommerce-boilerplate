import { CheckoutFooter, CheckoutHeader } from "@/components/checkout-chrome";

export default function CheckoutFlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="checkout-shell">
      <CheckoutHeader />
      <div className="checkout-shell-body">{children}</div>
      <CheckoutFooter />
    </div>
  );
}
