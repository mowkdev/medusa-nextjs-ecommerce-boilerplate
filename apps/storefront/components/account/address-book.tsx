"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { HttpTypes } from "@medusajs/types";

import { Input } from "@/components/ui/input";
import {
  addCustomerAddress,
  deleteCustomerAddress,
} from "@/lib/data/customer";

export function AddressBook({
  addresses,
  countryCode,
}: {
  addresses: HttpTypes.StoreCustomerAddress[];
  countryCode: string;
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await addCustomerAddress({}, fd);
      if (!result.success) {
        setError(result.error ?? "Could not save address");
        return;
      }
      setAdding(false);
      router.refresh();
    });
  };

  const remove = (id: string) => {
    setError(null);
    startTransition(async () => {
      const result = await deleteCustomerAddress(id);
      if (!result.success) {
        setError(result.error ?? "Could not delete address");
        return;
      }
      router.refresh();
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {addresses.length === 0 && !adding && (
        <p style={{ color: "var(--ink-soft)", fontSize: 13 }}>
          No saved addresses yet.
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 12,
        }}
      >
        {addresses.map((a) => (
          <article
            key={a.id}
            style={{
              border: "1px solid color-mix(in srgb, var(--ink) 12%, transparent)",
              borderRadius: 6,
              padding: 18,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              fontSize: 13,
              background: "var(--paper)",
            }}
          >
            <header
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 8,
              }}
            >
              <strong
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 15,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  fontWeight: 400,
                }}
              >
                {a.first_name} {a.last_name}
              </strong>
              {(a.is_default_shipping || a.is_default_billing) && (
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--accent-deep)",
                  }}
                >
                  {a.is_default_shipping ? "Default" : "Billing"}
                </span>
              )}
            </header>
            <div style={{ color: "var(--ink-soft)", lineHeight: 1.55 }}>
              {a.address_1}
              {a.address_2 ? `, ${a.address_2}` : ""}
              <br />
              {a.postal_code} {a.city}
              {a.country_code ? `, ${a.country_code.toUpperCase()}` : ""}
              {a.phone && (
                <>
                  <br />
                  {a.phone}
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => remove(a.id)}
              disabled={pending}
              className="link-mini"
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                textAlign: "left",
                color: "var(--ink-soft)",
                marginTop: 4,
              }}
            >
              Remove
            </button>
          </article>
        ))}
      </div>

      {error && (
        <p style={{ fontSize: 12, color: "var(--accent-deep)" }}>{error}</p>
      )}

      {adding ? (
        <form
          onSubmit={submit}
          style={{
            border: "1px solid color-mix(in srgb, var(--ink) 18%, transparent)",
            borderRadius: 6,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="First name">
              <Input name="first_name" required autoComplete="given-name" />
            </Field>
            <Field label="Last name">
              <Input name="last_name" required autoComplete="family-name" />
            </Field>
          </div>
          <Field label="Address">
            <Input name="address_1" required autoComplete="street-address" />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Postal code">
              <Input name="postal_code" required autoComplete="postal-code" />
            </Field>
            <Field label="City">
              <Input name="city" required autoComplete="address-level2" />
            </Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Province / region">
              <Input name="province" autoComplete="address-level1" />
            </Field>
            <Field label="Country">
              <Input
                name="country_code"
                defaultValue={countryCode.toLowerCase()}
                required
                autoComplete="country"
              />
            </Field>
          </div>
          <Field label="Phone (optional)">
            <Input name="phone" type="tel" autoComplete="tel" />
          </Field>

          <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
            <button type="submit" className="auth-cta" disabled={pending}>
              <span>{pending ? "Saving…" : "Save address"}</span>
              <span>→</span>
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="link-mini"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--ink-soft)",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="auth-cta"
          style={{ alignSelf: "flex-start", marginTop: 4 }}
        >
          <span>Add address</span>
          <span>+</span>
        </button>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span
        style={{
          fontSize: 11,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "var(--ink-soft)",
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}
