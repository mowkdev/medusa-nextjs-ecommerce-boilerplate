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
    <div className="acct-layout">
      <aside className="acct-side" aria-label="Account navigation">
        <AccountNav countryCode={countryCode} />
      </aside>

      <section className="acct-main">
        <span className="eb">Order #{order.display_id}</span>
        <h1>Order detail</h1>
        <p className="lede">
          Placed {new Date(order.created_at).toLocaleString()}
        </p>

        <OrderSummary order={order} />

        <LocalizedLink href="/account/orders" className="back-link">
          Back to orders
        </LocalizedLink>
      </section>
    </div>
  );
}
