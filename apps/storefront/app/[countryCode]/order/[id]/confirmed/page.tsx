import LocalizedLink from "@/components/localized-link";
import { notFound } from "next/navigation";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { OrderSummary } from "@/components/order-summary";
import { retrieveOrder } from "@/lib/data/orders";

export const metadata = {
  title: "Order confirmed — Dabasberns",
};

export default async function OrderConfirmedPage({
  params,
}: {
  params: Promise<{ countryCode: string; id: string }>;
}) {
  const { id } = await params;
  const order = await retrieveOrder(id).catch(() => null);
  if (!order) notFound();

  return (
    <>
      <Header solid />
      <main className="shop" data-screen-label="Order confirmed">
        <div className="crumb">
          <LocalizedLink href="/">Dabasberns</LocalizedLink>
          <span className="sep">/</span>
          <span className="now">Order confirmed</span>
        </div>

        <div
          style={{
            maxWidth: "var(--container)",
            margin: "0 auto",
            padding: "16px var(--pad) 96px",
          }}
        >
          <header style={{ textAlign: "center", margin: "32px 0 40px" }}>
            <span
              style={{
                fontSize: 11,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "var(--accent-deep)",
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 1,
                  background: "currentColor",
                }}
              />
              Thank you · No. {order.display_id}
              <span
                style={{
                  width: 24,
                  height: 1,
                  background: "currentColor",
                }}
              />
            </span>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px, 5vw, 64px)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                lineHeight: 1,
                margin: "14px 0 12px",
                fontWeight: 400,
              }}
            >
              Your bench is on its way
            </h1>
            <p
              style={{
                color: "var(--ink-soft)",
                fontSize: 14,
                lineHeight: 1.6,
                maxWidth: "52ch",
                margin: "0 auto",
              }}
            >
              We&apos;ve sent a confirmation to{" "}
              <strong style={{ color: "var(--ink)", fontWeight: 500 }}>
                {order.email}
              </strong>
              . Anything handmade ships from Kuldīga on the next Tuesday — we
              cast each rod off the dock before it leaves.
            </p>
          </header>

          <OrderSummary order={order} />

          <div style={{ display: "flex", gap: 18, marginTop: 40, justifyContent: "center" }}>
            <LocalizedLink
              href="/account/orders"
              className="auth-cta"
              style={{ textDecoration: "none" }}
            >
              <span>See all orders</span>
              <span>→</span>
            </LocalizedLink>
            <LocalizedLink
              href="/products"
              className="link-mini"
              style={{
                alignSelf: "center",
                color: "var(--ink-soft)",
              }}
            >
              Keep browsing
            </LocalizedLink>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
