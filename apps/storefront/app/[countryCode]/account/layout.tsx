import LocalizedLink from "@/components/localized-link";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { retrieveCustomer } from "@/lib/data/customer";

export default async function AccountLayout({
  dashboard,
  login,
}: {
  dashboard: React.ReactNode;
  login: React.ReactNode;
}) {
  const customer = await retrieveCustomer().catch(() => null);

  return (
    <>
      <Header solid />
      <main className="shop" data-screen-label="Account">
        <div className="crumb">
          <LocalizedLink href="/">Dabasberns</LocalizedLink>
          <span className="sep">/</span>
          <span className="now">Account</span>
        </div>
        {customer ? dashboard : login}
      </main>
      <Footer />
    </>
  );
}
