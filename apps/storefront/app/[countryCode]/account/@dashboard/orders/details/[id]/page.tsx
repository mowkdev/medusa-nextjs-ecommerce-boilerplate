import LocalizedLink from "@/components/localized-link";
import { notFound } from "next/navigation";

import { AccountNav } from "@/components/account/account-nav";
import { OrderSummary } from "@/components/order-summary";
import { retrieveOrder } from "@/lib/data/orders";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ countryCode: string; id: string }>;
}) {
  const { countryCode, id } = await params;
  const order = await retrieveOrder(id).catch(() => null);
  if (!order) notFound();

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
          — Order #{order.display_id}
        </span>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 4vw, 52px)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            margin: "12px 0 6px",
            lineHeight: 1,
            fontWeight: 400,
          }}
        >
          Order detail
        </h1>
        <p style={{ color: "var(--ink-soft)", fontSize: 13, margin: "0 0 28px" }}>
          Placed {new Date(order.created_at).toLocaleString()}
        </p>

        <OrderSummary order={order} />

        <div style={{ marginTop: 24 }}>
          <LocalizedLink
            href="/account/orders"
            className="link-mini"
            style={{ color: "var(--ink-soft)" }}
          >
            ← Back to orders
          </LocalizedLink>
        </div>
      </section>
    </div>
  );
}
