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
    <div className="acct-layout">
      <aside className="acct-side" aria-label="Account navigation">
        <AccountNav countryCode={countryCode} />
      </aside>

      <section className="acct-main">
        <span className="eb">Addresses</span>
        <h1>Address book</h1>
        <p className="lede">
          The places we send your bench to. The first one we save becomes your
          default — change it any time at checkout.
        </p>

        <AddressBook
          addresses={customer.addresses ?? []}
          countryCode={countryCode}
        />
      </section>
    </div>
  );
}
