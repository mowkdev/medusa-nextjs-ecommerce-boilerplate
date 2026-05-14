import LocalizedLink from "@/components/localized-link";

import { AccountNav } from "@/components/account/account-nav";
import { listOrders } from "@/lib/data/orders";
import { retrieveCustomer } from "@/lib/data/customer";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ countryCode: string }>;
}) {
  const { countryCode } = await params;
  const customer = await retrieveCustomer();
  if (!customer) return null;

  const orders = (await listOrders(3).catch(() => [])) ?? [];

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
          — Welcome
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
          {customer.first_name || "Friend"}
        </h1>
        <p style={{ color: "var(--ink-soft)", fontSize: 14, lineHeight: 1.6, maxWidth: "52ch" }}>
          Signed in as <strong style={{ color: "var(--ink)", fontWeight: 500 }}>{customer.email}</strong>.
          From here you can keep your bench in order — profile, addresses,
          orders, and the small details we ask about at checkout.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 16,
            marginTop: 32,
          }}
        >
          <SummaryCard k="Orders" v={String(orders.length)} href={`/${countryCode}/account/orders`} />
          <SummaryCard
            k="Addresses"
            v={String(customer.addresses?.length ?? 0)}
            href={`/${countryCode}/account/addresses`}
          />
        </div>

        <h2
          style={{
            marginTop: 48,
            fontFamily: "var(--font-display)",
            fontSize: 24,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontWeight: 400,
          }}
        >
          Recent orders
        </h2>

        {orders.length === 0 ? (
          <p style={{ color: "var(--ink-soft)", fontSize: 13, marginTop: 12 }}>
            No orders yet. When you place one, it will show here.
          </p>
        ) : (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "16px 0 0",
              borderTop: "1px solid color-mix(in srgb, var(--ink) 12%, transparent)",
            }}
          >
            {orders.map((order) => (
              <li
                key={order.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto",
                  alignItems: "center",
                  padding: "16px 0",
                  borderBottom: "1px solid color-mix(in srgb, var(--ink) 12%, transparent)",
                  gap: 16,
                  fontSize: 13,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "ui-monospace, monospace",
                      fontSize: 11,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "var(--ink-soft)",
                    }}
                  >
                    #{order.display_id}
                  </div>
                  <div style={{ marginTop: 2 }}>
                    {(order.items ?? [])
                      .slice(0, 2)
                      .map((it) => it.product_title)
                      .join(", ")}
                    {(order.items?.length ?? 0) > 2 ? " …" : ""}
                  </div>
                </div>
                <div style={{ color: "var(--ink-soft)" }}>
                  {new Date(order.created_at).toLocaleDateString()}
                </div>
                <LocalizedLink
                  href={`/account/orders/details/${order.id}`}
                  className="link-mini"
                  style={{ color: "var(--ink)" }}
                >
                  View →
                </LocalizedLink>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function SummaryCard({ k, v, href }: { k: string; v: string; href: string }) {
  return (
    <LocalizedLink
      href={href}
      style={{
        background: "var(--paper-2)",
        padding: 20,
        borderRadius: 6,
        textDecoration: "none",
        color: "inherit",
        display: "block",
      }}
    >
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "var(--ink-soft)",
        }}
      >
        {k}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 32,
          letterSpacing: "0.04em",
          marginTop: 4,
        }}
      >
        {v}
      </div>
    </LocalizedLink>
  );
}
