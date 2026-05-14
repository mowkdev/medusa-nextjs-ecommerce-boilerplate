import { redirect } from "next/navigation";

import LocalizedLink from "@/components/localized-link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SignUpForm } from "@/components/sign-up-form";
import { retrieveCustomer } from "@/lib/data/customer";

export const metadata = {
  title: "Create account — Dabasberns",
};

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ countryCode: string }>;
}) {
  const { countryCode } = await params;
  const customer = await retrieveCustomer();
  if (customer) {
    redirect(`/${countryCode}/account`);
  }
  return (
    <>
      <Header solid />
      <main className="shop" data-screen-label="Create account">
        <div className="crumb">
          <LocalizedLink href="/">Dabasberns</LocalizedLink>
          <span className="sep">/</span>
          <span className="now">Create account</span>
        </div>

        <div className="auth-shell">
          <div className="auth-head">
            <span className="eyebrow">Take a seat</span>
            <h1>Create account</h1>
            <p className="sub">
              Save your bench, follow new batches, and get a heads-up when
              something quiet ships.
            </p>
          </div>

          <SignUpForm countryCode={countryCode} />

          <p className="auth-fine">
            By creating an account you agree to our{" "}
            <LocalizedLink href="#">Terms</LocalizedLink> and <LocalizedLink href="#">Privacy</LocalizedLink>.
          </p>

          <div className="auth-foot">
            Already have an account? <LocalizedLink href="/sign-in">Sign in</LocalizedLink>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
