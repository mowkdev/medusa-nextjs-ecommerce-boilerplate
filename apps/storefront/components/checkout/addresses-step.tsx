import LocalizedLink from "@/components/localized-link";
import { HttpTypes } from "@medusajs/types";

import { setAddresses } from "@/lib/data/cart";
import { Input } from "@/components/ui/input";

export function AddressesStep({
  cart,
  customer,
  countryCode,
  open,
}: {
  cart: HttpTypes.StoreCart;
  customer: HttpTypes.StoreCustomer | null;
  countryCode: string;
  open: boolean;
}) {
  const shipping = cart.shipping_address;

  return (
    <section style={panelStyle(open)}>
      <Header step={1} title="Address" open={open} editHref={`/${countryCode}/checkout?step=address`} completed={!!shipping?.address_1} />

      {open ? (
        <form
          action={async (formData: FormData) => {
            "use server";
            await setAddresses(null, formData);
          }}
          style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}
        >
          <Field label="Email">
            <Input
              type="email"
              name="email"
              required
              defaultValue={cart.email ?? customer?.email ?? ""}
              placeholder="you@kurzeme.lv"
            />
          </Field>

          <Pair>
            <Field label="First name">
              <Input
                name="shipping_address.first_name"
                required
                defaultValue={shipping?.first_name ?? customer?.first_name ?? ""}
              />
            </Field>
            <Field label="Last name">
              <Input
                name="shipping_address.last_name"
                required
                defaultValue={shipping?.last_name ?? customer?.last_name ?? ""}
              />
            </Field>
          </Pair>

          <Field label="Address">
            <Input
              name="shipping_address.address_1"
              required
              defaultValue={shipping?.address_1 ?? ""}
              placeholder="Street and number"
            />
          </Field>

          <Pair>
            <Field label="Postal code">
              <Input
                name="shipping_address.postal_code"
                required
                defaultValue={shipping?.postal_code ?? ""}
              />
            </Field>
            <Field label="City">
              <Input
                name="shipping_address.city"
                required
                defaultValue={shipping?.city ?? ""}
              />
            </Field>
          </Pair>

          <Pair>
            <Field label="Province / region">
              <Input
                name="shipping_address.province"
                defaultValue={shipping?.province ?? ""}
              />
            </Field>
            <Field label="Country">
              <Input
                name="shipping_address.country_code"
                required
                defaultValue={
                  shipping?.country_code ?? countryCode.toLowerCase()
                }
              />
            </Field>
          </Pair>

          <Field label="Phone (optional)">
            <Input
              type="tel"
              name="shipping_address.phone"
              defaultValue={shipping?.phone ?? customer?.phone ?? ""}
            />
          </Field>

          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              color: "var(--ink-soft)",
              marginTop: 6,
            }}
          >
            <input
              type="checkbox"
              name="same_as_billing"
              defaultChecked
              style={{ accentColor: "var(--ink)" }}
            />
            Billing address is the same as shipping
          </label>

          <button type="submit" className="auth-cta" style={{ marginTop: 4 }}>
            <span>Continue to delivery</span>
            <span>→</span>
          </button>
        </form>
      ) : shipping?.address_1 ? (
        <SummaryRows>
          <Row k="Ship to">
            {shipping.first_name} {shipping.last_name}
            <br />
            {shipping.address_1}
            <br />
            {shipping.postal_code} {shipping.city}
            {shipping.country_code ? `, ${shipping.country_code.toUpperCase()}` : ""}
          </Row>
          <Row k="Contact">{cart.email}</Row>
        </SummaryRows>
      ) : (
        <p style={{ color: "var(--ink-soft)", fontSize: 13, marginTop: 8 }}>
          Add an address to continue.{" "}
          <LocalizedLink
            href="/checkout?step=address"
            className="link-mini"
            style={{ color: "var(--ink)" }}
          >
            Add now
          </LocalizedLink>
        </p>
      )}
    </section>
  );
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
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "baseline",
          fontFamily: "var(--font-display)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
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
        <h2 style={{ fontSize: 22, margin: 0 }}>{title}</h2>
      </div>
      {!open && completed && (
        <a className="link-mini" href={editHref}>
          Edit
        </a>
      )}
    </div>
  );
}

function Pair({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {children}
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

function SummaryRows({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
        marginTop: 14,
        fontSize: 13,
        color: "var(--ink-soft)",
      }}
    >
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
