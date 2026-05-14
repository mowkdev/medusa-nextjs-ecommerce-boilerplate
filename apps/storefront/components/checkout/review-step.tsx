"use client";

import { useState, useTransition } from "react";
import { HttpTypes } from "@medusajs/types";

import { placeOrder } from "@/lib/data/cart";

export function ReviewStep({
  cart,
  countryCode: _countryCode,
  open,
}: {
  cart: HttpTypes.StoreCart;
  countryCode: string;
  open: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const ready =
    !!cart.shipping_address?.address_1 &&
    (cart.shipping_methods?.length ?? 0) > 0 &&
    !!cart.payment_collection?.payment_sessions?.find(
      (s) => s.status === "pending"
    );

  const submit = () => {
    setError(null);
    startTransition(async () => {
      try {
        await placeOrder();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not place order");
      }
    });
  };

  return (
    <section
      style={{
        border: open
          ? "1px solid color-mix(in srgb, var(--ink) 18%, transparent)"
          : "1px solid color-mix(in srgb, var(--ink) 8%, transparent)",
        borderRadius: 6,
        padding: 24,
        background: open ? "var(--paper)" : "transparent",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
          <span
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 12,
              letterSpacing: "0.18em",
              color: open ? "var(--accent-deep)" : "var(--ink-soft)",
            }}
          >
            04
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontSize: 22,
              margin: 0,
            }}
          >
            Review
          </h2>
        </div>
      </div>

      {open && (
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ color: "var(--ink-soft)", fontSize: 13, lineHeight: 1.6 }}>
            Have one last look at the summary on the right. By placing the
            order you agree to Dabasberns' Terms and Privacy policy. Anything
            handmade ships from Kuldīga on Tuesdays.
          </p>
          {!ready && (
            <p style={{ fontSize: 12, color: "var(--accent-deep)" }}>
              Complete the previous steps before placing the order.
            </p>
          )}
          {error && (
            <p style={{ fontSize: 12, color: "var(--accent-deep)" }}>{error}</p>
          )}
          <button
            type="button"
            onClick={submit}
            className="auth-cta"
            disabled={pending || !ready}
          >
            <span>{pending ? "Placing order…" : "Place order"}</span>
            <span>→</span>
          </button>
        </div>
      )}
    </section>
  );
}
