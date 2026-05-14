"use client";

import { useState, useTransition } from "react";
import { HttpTypes } from "@medusajs/types";

import { Input } from "@/components/ui/input";
import { updateCustomer } from "@/lib/data/customer";

export function ProfileForm({ customer }: { customer: HttpTypes.StoreCustomer }) {
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(
    null
  );

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);
    const fd = new FormData(e.currentTarget);
    const body: HttpTypes.StoreUpdateCustomer = {
      first_name: (fd.get("first_name") as string) || undefined,
      last_name: (fd.get("last_name") as string) || undefined,
      phone: (fd.get("phone") as string) || undefined,
    };
    startTransition(async () => {
      try {
        await updateCustomer(body);
        setFeedback({ ok: true, msg: "Saved" });
      } catch (err) {
        setFeedback({
          ok: false,
          msg: err instanceof Error ? err.message : "Could not save",
        });
      }
    });
  };

  return (
    <form
      onSubmit={submit}
      style={{ display: "flex", flexDirection: "column", gap: 18 }}
    >
      <Field label="First name">
        <Input
          name="first_name"
          defaultValue={customer.first_name ?? ""}
          autoComplete="given-name"
        />
      </Field>
      <Field label="Last name">
        <Input
          name="last_name"
          defaultValue={customer.last_name ?? ""}
          autoComplete="family-name"
        />
      </Field>
      <Field label="Email">
        <Input value={customer.email} disabled />
        <span
          style={{
            fontSize: 11,
            color: "var(--ink-soft)",
            marginTop: -2,
          }}
        >
          Contact us to change the email on your account.
        </span>
      </Field>
      <Field label="Phone">
        <Input
          name="phone"
          type="tel"
          defaultValue={customer.phone ?? ""}
          autoComplete="tel"
        />
      </Field>

      {feedback && (
        <p
          style={{
            fontSize: 12,
            color: feedback.ok ? "var(--accent-deep)" : "var(--accent-deep)",
          }}
        >
          {feedback.msg}
        </p>
      )}

      <button type="submit" className="auth-cta" disabled={pending}>
        <span>{pending ? "Saving…" : "Save changes"}</span>
        <span>→</span>
      </button>
    </form>
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
