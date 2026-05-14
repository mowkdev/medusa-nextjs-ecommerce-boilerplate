import { AccountNav } from "@/components/account/account-nav";
import { AddressBook } from "@/components/account/address-book";
import { retrieveCustomer } from "@/lib/data/customer";

export const metadata = { title: "Addresses — Dabasberns" };

export default async function AddressesPage({
  params,
}: {
  params: Promise<{ countryCode: string }>;
}) {
  const { countryCode } = await params;
  const customer = await retrieveCustomer();
  if (!customer) return null;

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
          — Addresses
        </span>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 4vw, 52px)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            margin: "12px 0 8px",
            lineHeight: 1,
            fontWeight: 400,
          }}
        >
          Address book
        </h1>
        <p style={{ color: "var(--ink-soft)", fontSize: 14, margin: "0 0 28px" }}>
          The places we send your bench to.
        </p>

        <AddressBook
          addresses={customer.addresses ?? []}
          countryCode={countryCode}
        />
      </section>
    </div>
  );
}
