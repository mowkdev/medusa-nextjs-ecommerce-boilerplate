import { HttpTypes } from "@medusajs/types";

import { AddressesStep } from "@/components/checkout/addresses-step";
import { DeliveryStep } from "@/components/checkout/delivery-step";
import { PaymentStep } from "@/components/checkout/payment-step";
import { ReviewStep } from "@/components/checkout/review-step";

type Step = "address" | "delivery" | "payment" | "review";

export function CheckoutForm({
  cart,
  customer,
  shippingMethods,
  paymentProviders,
  step,
  countryCode,
}: {
  cart: HttpTypes.StoreCart;
  customer: HttpTypes.StoreCustomer | null;
  shippingMethods: HttpTypes.StoreCartShippingOption[];
  paymentProviders: HttpTypes.StorePaymentProvider[];
  step: Step;
  countryCode: string;
}) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontSize: "clamp(40px, 5vw, 64px)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          lineHeight: 1,
          margin: "8px 0 8px",
        }}
      >
        Checkout
      </h1>

      <Stepper current={step} countryCode={countryCode} cart={cart} />

      <AddressesStep
        cart={cart}
        customer={customer}
        countryCode={countryCode}
        open={step === "address"}
      />
      <DeliveryStep
        cart={cart}
        methods={shippingMethods}
        countryCode={countryCode}
        open={step === "delivery"}
      />
      <PaymentStep
        cart={cart}
        providers={paymentProviders}
        countryCode={countryCode}
        open={step === "payment"}
      />
      <ReviewStep cart={cart} countryCode={countryCode} open={step === "review"} />
    </section>
  );
}

function Stepper({
  current,
  countryCode,
  cart,
}: {
  current: Step;
  countryCode: string;
  cart: HttpTypes.StoreCart;
}) {
  const steps: { id: Step; label: string }[] = [
    { id: "address", label: "Address" },
    { id: "delivery", label: "Delivery" },
    { id: "payment", label: "Payment" },
    { id: "review", label: "Review" },
  ];
  const idx = steps.findIndex((s) => s.id === current);

  return (
    <ol
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        gap: 24,
        fontSize: 11,
        letterSpacing: "0.24em",
        textTransform: "uppercase",
        color: "var(--ink-soft)",
      }}
    >
      {steps.map((s, i) => {
        const active = s.id === current;
        const done = i < idx;
        const reachable = done || active;
        const href = `/${countryCode}/checkout?step=${s.id}`;
        const labelEl = (
          <span
            style={{
              color: active ? "var(--ink)" : done ? "var(--accent-deep)" : "var(--ink-soft)",
              fontWeight: active ? 500 : 400,
            }}
          >
            <span style={{ fontFamily: "ui-monospace, monospace" }}>
              {String(i + 1).padStart(2, "0")}
            </span>{" "}
            · {s.label}
          </span>
        );
        return (
          <li key={s.id}>
            {reachable && cart ? (
              <a
                href={href}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                {labelEl}
              </a>
            ) : (
              labelEl
            )}
          </li>
        );
      })}
    </ol>
  );
}
