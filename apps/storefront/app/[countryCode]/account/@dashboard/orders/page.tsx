import LocalizedLink from "@/components/localized-link";

import { AccountNav } from "@/components/account/account-nav";
import { listOrders } from "@/lib/data/orders";
import { formatPrice } from "@/lib/prices";

export const metadata = { title: "Orders — Dabasberns" };

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ countryCode: string }>;
}) {
  const { countryCode } = await params;
  const orders = (await listOrders(50).catch(() => [])) ?? [];

  return (
    <div
      style={{
        maxWidth: "var(--container)",
        margin: "0 auto",
        padding: "24px var(--pad) 96px",
        display: "grid",
        gridTemplateColumns: "220px minmax(0, 1fr)",
        gap: 48,
      }}
    >
      <AccountNav countryCode={countryCode} />

      <section>
        <span
          style={{
            fontSize: 11,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--accent-deep)",
          }}
        >
          — Orders
        </span>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(40px, 5vw, 64px)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            margin: "12px 0 24px",
            lineHeight: 1,
            fontWeight: 400,
          }}
        >
          Order history
        </h1>

        {orders.length === 0 ? (
          <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>
            No orders yet.{" "}
            <LocalizedLink href="/products" className="link-mini" style={{ color: "var(--ink)" }}>
              Browse the workshop →
            </LocalizedLink>
          </p>
        ) : (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              borderTop: "1px solid color-mix(in srgb, var(--ink) 12%, transparent)",
            }}
          >
            {orders.map((order) => (
              <li
                key={order.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto auto",
                  alignItems: "center",
                  gap: 20,
                  padding: "20px 0",
                  borderBottom:
                    "1px solid color-mix(in srgb, var(--ink) 12%, transparent)",
                  fontSize: 13,
                }}
              >
                <div
                  style={{
                    fontFamily: "ui-monospace, monospace",
                    fontSize: 11,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--ink-soft)",
                    width: 64,
                  }}
                >
                  #{order.display_id}
                </div>
                <div>
                  <div style={{ color: "var(--ink)" }}>
                    {(order.items ?? [])
                      .slice(0, 3)
                      .map((it) => it.product_title)
                      .join(", ")}
                    {(order.items?.length ?? 0) > 3 ? " …" : ""}
                  </div>
                  <div style={{ color: "var(--ink-soft)", fontSize: 11, marginTop: 2 }}>
                    {new Date(order.created_at).toLocaleDateString()} ·{" "}
                    {(order.items ?? []).reduce((s, it) => s + it.quantity, 0)}{" "}
                    items
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 15,
                    letterSpacing: "0.04em",
                  }}
                >
                  {formatPrice(order.total ?? 0, order.currency_code ?? "eur")}
                </div>
                <LocalizedLink
                  href={`/account/orders/details/${order.id}`}
                  className="link-mini"
                  style={{ color: "var(--ink)" }}
                >
                  Details →
                </LocalizedLink>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
