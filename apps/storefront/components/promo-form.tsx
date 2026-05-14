"use client";

import { useState, useTransition } from "react";

import { applyPromotions } from "@/lib/data/cart";
import { useCart } from "@/components/cart-provider";
import { Input } from "@/components/ui/input";

export function PromoForm({ currentCodes }: { currentCodes: string[] }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const { refreshCart } = useCart();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setError(null);
    startTransition(async () => {
      try {
        await applyPromotions([...currentCodes.filter(Boolean), code.trim()]);
        await refreshCart();
        setCode("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not apply code");
      }
    });
  };

  const remove = (toRemove: string) => {
    startTransition(async () => {
      try {
        await applyPromotions(currentCodes.filter((c) => c !== toRemove));
        await refreshCart();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not remove code");
      }
    });
  };

  return (
    <div style={{ marginTop: 18 }}>
      <span
        style={{
          fontSize: 11,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "var(--ink-soft)",
        }}
      >
        Promo code
      </span>
      <form onSubmit={submit} style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <Input
          type="text"
          placeholder="ENTER CODE"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          disabled={pending}
        />
        <button
          type="submit"
          disabled={pending || !code.trim()}
          style={{
            height: 52,
            padding: "0 18px",
            background: "transparent",
            color: "var(--ink)",
            border: "1px solid color-mix(in srgb, var(--ink) 18%, transparent)",
            borderRadius: 4,
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          {pending ? "…" : "Apply"}
        </button>
      </form>
      {error && (
        <p style={{ marginTop: 8, fontSize: 12, color: "var(--accent-deep)" }}>
          {error}
        </p>
      )}
      {currentCodes.filter(Boolean).length > 0 && (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "12px 0 0",
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          {currentCodes.filter(Boolean).map((c) => (
            <li
              key={c}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "6px 10px",
                border: "1px solid color-mix(in srgb, var(--ink) 18%, transparent)",
                borderRadius: 999,
                color: "var(--ink)",
              }}
            >
              {c}
              <button
                type="button"
                onClick={() => remove(c)}
                aria-label={`Remove ${c}`}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--ink-soft)",
                  cursor: "pointer",
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
