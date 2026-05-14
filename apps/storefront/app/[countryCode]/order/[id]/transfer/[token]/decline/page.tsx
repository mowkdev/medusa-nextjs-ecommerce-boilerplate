import LocalizedLink from "@/components/localized-link";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { declineTransferRequest } from "@/lib/data/orders";

export const metadata = { title: "Transfer declined — Dabasberns" };

export default async function DeclineTransferPage({
  params,
}: {
  params: Promise<{ countryCode: string; id: string; token: string }>;
}) {
  const { id, token } = await params;
  const result = await declineTransferRequest(id, token);

  return (
    <>
      <Header solid />
      <main className="shop" data-screen-label="Transfer declined">
        <div className="crumb">
          <LocalizedLink href="/">Dabasberns</LocalizedLink>
          <span className="sep">/</span>
          <span className="now">Transfer</span>
        </div>

        <div className="auth-shell" style={{ textAlign: "center" }}>
          <div className="auth-head">
            <span className="eyebrow">
              {result.success ? "Noted" : "Something went wrong"}
            </span>
            <h1>{result.success ? "Transfer declined" : "Could not decline"}</h1>
            <p className="sub">
              {result.success
                ? "The original owner has been notified. No further action needed."
                : result.error ?? "The link may have expired."}
            </p>
          </div>

          <LocalizedLink
            href="/"
            className="auth-cta"
            style={{ display: "inline-flex", textDecoration: "none" }}
          >
            <span>Back home</span>
            <span>→</span>
          </LocalizedLink>
        </div>
      </main>
      <Footer />
    </>
  );
}
