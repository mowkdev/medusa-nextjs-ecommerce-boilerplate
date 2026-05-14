"use client";

import { useRouter } from "next/navigation";
import { HttpTypes } from "@medusajs/types";

import LocalizedLink from "@/components/localized-link";
import { PromoForm } from "@/components/promo-form";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/prices";

export function CartView({
  countryCode,
  customerEmail,
}: {
  countryCode: string;
  customerEmail: string | null;
}) {
  const router = useRouter();
  const { cart, currencyCode, subtotal, updateItem, removeItem } = useCart();

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="auth-shell" style={{ maxWidth: 560, textAlign: "center" }}>
        <div className="auth-head">
          <span className="eyebrow">Quiet shore</span>
          <h1>Empty bench</h1>
          <p className="sub">
            Nothing on the bench just yet. Browse the rods, reels and quieter
            things from the workshop.
          </p>
        </div>
        <LocalizedLink
          href="/products"
          className="auth-cta"
          style={{ display: "inline-flex", textDecoration: "none" }}
        >
          <span>Browse the workshop</span>
          <span>→</span>
        </LocalizedLink>
      </div>
    );
  }

  const goToCheckout = () => router.push(`/${countryCode}/checkout`);

  return (
    <div className="pdp" style={{ padding: "16px var(--pad) 96px" }}>
      <div
        className="grid items-start"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.4fr) minmax(320px, 1fr)",
          gap: 56,
        }}
      >
        <section>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(40px, 5vw, 64px)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              lineHeight: 1,
              margin: "8px 0 24px",
            }}
          >
            Your bench
          </h1>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              borderTop: "1px solid color-mix(in srgb, var(--ink) 12%, transparent)",
            }}
          >
            {items.map((item) => (
              <LineRow
                key={item.id}
                item={item}
                currencyCode={currencyCode}
                onIncrease={() => updateItem(item.id, item.quantity + 1)}
                onDecrease={() =>
                  item.quantity <= 1
                    ? removeItem(item.id)
                    : updateItem(item.id, item.quantity - 1)
                }
                onRemove={() => removeItem(item.id)}
              />
            ))}
          </ul>

          <div style={{ marginTop: 28 }}>
            <LocalizedLink
              href="/products"
              className="link-mini"
              style={{ color: "var(--ink-soft)" }}
            >
              ← Keep browsing
            </LocalizedLink>
          </div>
        </section>

        <aside
          style={{
            position: "sticky",
            top: 96,
            background: "var(--paper-2)",
            padding: 28,
            borderRadius: 6,
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
            — Summary
          </span>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginTop: 18,
              paddingBottom: 18,
              borderBottom:
                "1px solid color-mix(in srgb, var(--ink) 12%, transparent)",
            }}
          >
            <Row k="Subtotal" v={subtotal} />
            <Row k="Shipping" v="Calculated next" muted />
            {!!cart?.discount_total && cart.discount_total > 0 && (
              <Row
                k="Discount"
                v={`− ${formatPrice(cart.discount_total, currencyCode)}`}
              />
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              padding: "18px 0",
              fontFamily: "var(--font-display)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            <span style={{ fontSize: 13 }}>Total</span>
            <span style={{ fontSize: 22 }}>
              {formatPrice(cart?.total ?? cart?.item_subtotal ?? 0, currencyCode)}
            </span>
          </div>

          <PromoForm currentCodes={(cart?.promotions ?? []).map((p) => p.code ?? "")} />

          <button
            type="button"
            className="auth-cta"
            style={{ width: "100%", marginTop: 18 }}
            onClick={goToCheckout}
          >
            <span>Go to checkout</span>
            <span>→</span>
          </button>

          <p
            style={{
              marginTop: 12,
              fontSize: 11,
              color: "var(--ink-soft)",
              lineHeight: 1.55,
            }}
          >
            {customerEmail ? (
              <>Signed in as {customerEmail}.</>
            ) : (
              <>
                Have an account?{" "}
                <LocalizedLink
                  href="/sign-in"
                  className="link-mini"
                  style={{ color: "var(--ink)" }}
                >
                  Sign in
                </LocalizedLink>{" "}
                to use saved addresses.
              </>
            )}
          </p>
        </aside>
      </div>
    </div>
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

function LineRow({
  item,
  currencyCode,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  item: HttpTypes.StoreCartLineItem;
  currencyCode: string;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}) {
  const title = item.product_title ?? item.title ?? "Product";
  const variantTitle =
    item.variant_title && item.variant_title !== "Default"
      ? item.variant_title
      : null;
  const lineTotal = formatPrice(
    item.total ?? (item.unit_price ?? 0) * item.quantity,
    currencyCode
  );

  return (
    <li
      style={{
        display: "grid",
        gridTemplateColumns: "120px 1fr auto",
        gap: 20,
        padding: "22px 0",
        borderBottom:
          "1px solid color-mix(in srgb, var(--ink) 12%, transparent)",
        alignItems: "center",
      }}
    >
      <LocalizedLink
        href={`/products/${item.product_handle ?? "#"}`}
        style={{
          width: 120,
          height: 120,
          background: "var(--paper-2)",
          borderRadius: 6,
          overflow: "hidden",
          display: "block",
          position: "relative",
        }}
        aria-label={title}
      >
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%" }} />
        )}
      </LocalizedLink>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <LocalizedLink
          href={`/products/${item.product_handle ?? "#"}`}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 18,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "var(--ink)",
            textDecoration: "none",
            lineHeight: 1.1,
          }}
        >
          {title}
        </LocalizedLink>
        {variantTitle && (
          <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>
            {variantTitle}
          </span>
        )}
        {item.variant_sku && (
          <span
            style={{
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--ink-soft)",
            }}
          >
            SKU · {item.variant_sku}
          </span>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
          <div className="qty-mini">
            <button type="button" aria-label="Decrease" onClick={onDecrease}>
              −
            </button>
            <span className="v">{item.quantity}</span>
            <button type="button" aria-label="Increase" onClick={onIncrease}>
              +
            </button>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="link-mini"
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              color: "var(--ink-soft)",
            }}
          >
            Remove
          </button>
        </div>
      </div>

      <div
        style={{
          textAlign: "right",
          fontFamily: "var(--font-display)",
          fontSize: 16,
          letterSpacing: "0.04em",
        }}
      >
        {lineTotal}
      </div>
    </li>
  );
}
