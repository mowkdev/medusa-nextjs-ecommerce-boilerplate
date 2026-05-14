"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { HttpTypes } from "@medusajs/types";

import { setShippingMethod } from "@/lib/data/cart";
import { formatPrice } from "@/lib/prices";

export function DeliveryStep({
  cart,
  methods,
  countryCode,
  open,
}: {
  cart: HttpTypes.StoreCart;
  methods: HttpTypes.StoreCartShippingOption[];
  countryCode: string;
  open: boolean;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(
    cart.shipping_methods?.[0]?.shipping_option_id ?? methods[0]?.id ?? null
  );
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (!selected) return;
    setError(null);
    startTransition(async () => {
      try {
        await setShippingMethod({
          cartId: cart.id,
          shippingMethodId: selected,
        });
        router.push(`/${countryCode}/checkout?step=payment`);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not set shipping");
      }
    });
  };

  const currency = cart.currency_code ?? "eur";
  const chosenMethod = cart.shipping_methods?.[0];

  return (
    <section style={panelStyle(open)}>
      <Header
        step={2}
        title="Delivery"
        open={open}
        editHref={`/${countryCode}/checkout?step=delivery`}
        completed={!!chosenMethod}
      />

      {open ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
          {methods.length === 0 && (
            <p style={{ color: "var(--ink-soft)", fontSize: 13 }}>
              No shipping methods available for this region.
            </p>
          )}
          {methods.map((m) => {
            const price =
              typeof m.amount === "number"
                ? formatPrice(m.amount, currency)
                : "—";
            const isOn = selected === m.id;
            return (
              <label
                key={m.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 16px",
                  borderRadius: 6,
                  border: `1px solid color-mix(in srgb, var(--ink) ${
                    isOn ? "32%" : "12%"
                  }, transparent)`,
                  background: isOn
                    ? "color-mix(in srgb, var(--accent) 6%, var(--paper))"
                    : "transparent",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="shipping_option"
                  value={m.id}
                  checked={isOn}
                  onChange={() => setSelected(m.id)}
                  style={{ accentColor: "var(--ink)" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14 }}>{m.name}</div>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 14,
                    letterSpacing: "0.04em",
                  }}
                >
                  {price}
                </div>
              </label>
            );
          })}
          {error && (
            <p style={{ fontSize: 12, color: "var(--accent-deep)" }}>{error}</p>
          )}
          <button
            type="button"
            onClick={submit}
            className="auth-cta"
            disabled={pending || !selected}
            style={{ marginTop: 6 }}
          >
            <span>{pending ? "Saving…" : "Continue to payment"}</span>
            <span>→</span>
          </button>
        </div>
      ) : chosenMethod ? (
        <SummaryRows>
          <Row k="Shipping">
            {chosenMethod.name} ·{" "}
            {formatPrice(chosenMethod.total ?? chosenMethod.amount ?? 0, currency)}
          </Row>
        </SummaryRows>
      ) : null}
    </section>
  );
}

function Header({
  step,
  title,
  open,
  editHref,
  completed,
}: {
  step: number;
  title: string;
  open: boolean;
  editHref: string;
  completed: boolean;
}) {
  return (
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
          {String(step).padStart(2, "0")}
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
          {title}
        </h2>
      </div>
      {!open && completed && (
        <a className="link-mini" href={editHref}>
          Edit
        </a>
      )}
    </div>
  );
}

function SummaryRows({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 14, fontSize: 13, color: "var(--ink-soft)" }}>
      {children}
    </div>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "var(--ink-soft)",
          marginBottom: 4,
        }}
      >
        {k}
      </div>
      <div style={{ color: "var(--ink)" }}>{children}</div>
    </div>
  );
}

function panelStyle(open: boolean): React.CSSProperties {
  return {
    border: open
      ? "1px solid color-mix(in srgb, var(--ink) 18%, transparent)"
      : "1px solid color-mix(in srgb, var(--ink) 8%, transparent)",
    borderRadius: 6,
    padding: 24,
    background: open ? "var(--paper)" : "transparent",
  };
}
