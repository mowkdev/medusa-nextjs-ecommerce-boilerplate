import { HttpTypes } from "@medusajs/types";

import { formatPrice } from "@/lib/prices";

export function CheckoutSummary({ cart }: { cart: HttpTypes.StoreCart }) {
  const currency = cart.currency_code ?? "eur";
  const items = cart.items ?? [];

  return (
    <aside
      style={{
        position: "sticky",
        top: 96,
        background: "var(--paper-2)",
        padding: 28,
        borderRadius: 6,
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <span
        style={{
          fontSize: 11,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "var(--accent-deep)",
        }}
      >
        — Your bench
      </span>

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map((item) => (
          <li
            key={item.id}
            style={{
              display: "grid",
              gridTemplateColumns: "56px 1fr auto",
              gap: 12,
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                background: "var(--paper-3)",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              {item.thumbnail && (
                <img
                  src={item.thumbnail}
                  alt={item.product_title ?? ""}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 13 }}>{item.product_title}</span>
              <span style={{ fontSize: 11, color: "var(--ink-soft)" }}>
                {item.variant_title && item.variant_title !== "Default" ? `${item.variant_title} · ` : ""}
                × {item.quantity}
              </span>
            </div>
            <span style={{ fontSize: 13, fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>
              {formatPrice(item.total ?? (item.unit_price ?? 0) * item.quantity, currency)}
            </span>
          </li>
        ))}
      </ul>

      <div
        style={{
          height: 1,
          background: "color-mix(in srgb, var(--ink) 12%, transparent)",
        }}
      />

      <Row k="Subtotal" v={formatPrice(cart.item_subtotal ?? 0, currency)} />
      <Row
        k="Shipping"
        v={
          cart.shipping_total
            ? formatPrice(cart.shipping_total, currency)
            : "Calculated next"
        }
        muted={!cart.shipping_total}
      />
      {!!cart.discount_total && cart.discount_total > 0 && (
        <Row k="Discount" v={`− ${formatPrice(cart.discount_total, currency)}`} />
      )}
      {!!cart.tax_total && cart.tax_total > 0 && (
        <Row k="Tax" v={formatPrice(cart.tax_total, currency)} />
      )}

      <div
        style={{
          height: 1,
          background: "color-mix(in srgb, var(--ink) 12%, transparent)",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          fontFamily: "var(--font-display)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        <span style={{ fontSize: 13 }}>Total</span>
        <span style={{ fontSize: 22 }}>
          {formatPrice(cart.total ?? cart.item_subtotal ?? 0, currency)}
        </span>
      </div>
    </aside>
  );
}

function Row({ k, v, muted }: { k: string; v: string; muted?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: 13,
        color: muted ? "var(--ink-soft)" : "var(--ink)",
      }}
    >
      <span>{k}</span>
      <span>{v}</span>
    </div>
  );
}
