import { HttpTypes } from "@medusajs/types";

import { formatPrice } from "@/lib/prices";

export function OrderSummary({ order }: { order: HttpTypes.StoreOrder }) {
  const currency = order.currency_code ?? "eur";
  const ship = order.shipping_address;
  const items = order.items ?? [];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.4fr) minmax(280px, 1fr)",
        gap: 48,
        alignItems: "start",
      }}
    >
      <div>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            borderTop: "1px solid color-mix(in srgb, var(--ink) 12%, transparent)",
          }}
        >
          {items.map((item) => (
            <li
              key={item.id}
              style={{
                display: "grid",
                gridTemplateColumns: "72px 1fr auto",
                gap: 16,
                padding: "18px 0",
                borderBottom:
                  "1px solid color-mix(in srgb, var(--ink) 12%, transparent)",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  background: "var(--paper-2)",
                  borderRadius: 6,
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
              <div>
                <div style={{ fontSize: 14 }}>{item.product_title}</div>
                <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 2 }}>
                  {item.variant_title && item.variant_title !== "Default"
                    ? `${item.variant_title} · `
                    : ""}
                  × {item.quantity}
                </div>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 14,
                  letterSpacing: "0.04em",
                  textAlign: "right",
                }}
              >
                {formatPrice(
                  item.total ?? (item.unit_price ?? 0) * item.quantity,
                  currency
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <aside
        style={{
          background: "var(--paper-2)",
          padding: 24,
          borderRadius: 6,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          fontSize: 13,
        }}
      >
        <SubRow k="Subtotal" v={formatPrice(order.item_subtotal ?? 0, currency)} />
        <SubRow k="Shipping" v={formatPrice(order.shipping_total ?? 0, currency)} />
        {!!order.discount_total && order.discount_total > 0 && (
          <SubRow k="Discount" v={`− ${formatPrice(order.discount_total, currency)}`} />
        )}
        {!!order.tax_total && order.tax_total > 0 && (
          <SubRow k="Tax" v={formatPrice(order.tax_total, currency)} />
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
          <span style={{ fontSize: 12 }}>Total</span>
          <span style={{ fontSize: 20 }}>
            {formatPrice(order.total ?? 0, currency)}
          </span>
        </div>

        {ship && (
          <>
            <div
              style={{
                height: 1,
                background: "color-mix(in srgb, var(--ink) 12%, transparent)",
                marginTop: 4,
              }}
            />
            <div>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "var(--ink-soft)",
                  marginBottom: 6,
                }}
              >
                Shipping to
              </div>
              <div style={{ lineHeight: 1.5 }}>
                {ship.first_name} {ship.last_name}
                <br />
                {ship.address_1}
                <br />
                {ship.postal_code} {ship.city}
                {ship.country_code ? `, ${ship.country_code.toUpperCase()}` : ""}
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function SubRow({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ color: "var(--ink-soft)" }}>{k}</span>
      <span>{v}</span>
    </div>
  );
}
