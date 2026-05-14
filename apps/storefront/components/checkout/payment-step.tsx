"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { HttpTypes } from "@medusajs/types";

import { initiatePaymentSession } from "@/lib/data/cart";

export function PaymentStep({
  cart,
  providers,
  countryCode,
  open,
}: {
  cart: HttpTypes.StoreCart;
  providers: HttpTypes.StorePaymentProvider[];
  countryCode: string;
  open: boolean;
}) {
  const router = useRouter();
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  );
  const [selected, setSelected] = useState<string | null>(
    activeSession?.provider_id ?? providers[0]?.id ?? null
  );
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (!selected) return;
    setError(null);
    startTransition(async () => {
      try {
        await initiatePaymentSession(cart, { provider_id: selected });
        router.push(`/${countryCode}/checkout?step=review`);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not init payment");
      }
    });
  };

  return (
    <section style={panelStyle(open)}>
      <Header
        step={3}
        title="Payment"
        open={open}
        editHref={`/${countryCode}/checkout?step=payment`}
        completed={!!activeSession}
      />
      {open ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
          {providers.length === 0 && (
            <p style={{ color: "var(--ink-soft)", fontSize: 13 }}>
              No payment providers available for this region.
            </p>
          )}
          {providers.map((p) => {
            const isOn = selected === p.id;
            return (
              <label
                key={p.id}
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
                  name="payment_provider"
                  value={p.id}
                  checked={isOn}
                  onChange={() => setSelected(p.id)}
                  style={{ accentColor: "var(--ink)" }}
                />
                <div style={{ flex: 1, fontSize: 14 }}>
                  {prettyProviderName(p.id)}
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
            <span>{pending ? "Preparing…" : "Continue to review"}</span>
            <span>→</span>
          </button>
        </div>
      ) : activeSession ? (
        <SummaryRows>
          <Row k="Pay with">{prettyProviderName(activeSession.provider_id)}</Row>
        </SummaryRows>
      ) : null}
    </section>
  );
}

function prettyProviderName(id: string) {
  return id
    .replace(/^pp_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
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
