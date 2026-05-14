import LocalizedLink from "@/components/localized-link";
import { redirect } from "next/navigation";

import { CheckoutSummary } from "@/components/checkout/checkout-summary";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { retrieveCart } from "@/lib/data/cart";
import { retrieveCustomer } from "@/lib/data/customer";
import { listCartShippingMethods } from "@/lib/data/fulfillment";
import { listCartPaymentMethods } from "@/lib/data/payment";

export const metadata = {
  title: "Checkout — Dabasberns",
};

type CheckoutStep = "address" | "delivery" | "payment" | "review";

function inferStep(cart: Awaited<ReturnType<typeof retrieveCart>>): CheckoutStep {
  if (!cart) return "address";
  if (!cart.shipping_address?.address_1) return "address";
  if (!cart.shipping_methods || cart.shipping_methods.length === 0)
    return "delivery";
  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  );
  if (!session) return "payment";
  return "review";
}

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ countryCode: string }>;
  searchParams: Promise<{ step?: CheckoutStep }>;
}) {
  const { countryCode } = await params;
  const { step: stepParam } = await searchParams;

  const cart = await retrieveCart();
  if (!cart || (cart.items ?? []).length === 0) {
    redirect(`/${countryCode}/cart`);
  }

  const customer = await retrieveCustomer();
  const shipping = (await listCartShippingMethods(cart.id)) ?? [];
  const payment = cart.region?.id
    ? (await listCartPaymentMethods(cart.region.id)) ?? []
    : [];

  const step = stepParam ?? inferStep(cart);

  return (
    <main className="shop" data-screen-label="Checkout">
      <div className="crumb">
        <LocalizedLink href="/">Dabasberns</LocalizedLink>
        <span className="sep">/</span>
        <LocalizedLink href="/cart">Cart</LocalizedLink>
        <span className="sep">/</span>
        <span className="now">Checkout</span>
      </div>

      <div
        className="pdp"
        style={{
          padding: "16px var(--pad) 96px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.3fr) minmax(340px, 1fr)",
            gap: 56,
            alignItems: "start",
          }}
        >
          <CheckoutForm
            cart={cart}
            customer={customer}
            shippingMethods={shipping}
            paymentProviders={payment}
            step={step}
            countryCode={countryCode}
          />
          <CheckoutSummary cart={cart} />
        </div>
      </div>
    </main>
  );
}
