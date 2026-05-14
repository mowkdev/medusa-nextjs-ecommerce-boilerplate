import { redirect } from "next/navigation";

import LocalizedLink from "@/components/localized-link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SignInForm } from "@/components/sign-in-form";
import { retrieveCustomer } from "@/lib/data/customer";

export const metadata = {
  title: "Sign in — Dabasberns",
};

export default async function SignInPage({
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
      <main className="shop" data-screen-label="Sign in">
        <div className="crumb">
          <LocalizedLink href="/">Dabasberns</LocalizedLink>
          <span className="sep">/</span>
          <span className="now">Sign in</span>
        </div>

        <div className="auth-shell">
          <div className="auth-head">
            <span className="eyebrow">Welcome back</span>
            <h1>Sign in</h1>
            <p className="sub">
              Use your email and password, or continue with Google.
            </p>
          </div>

          <SignInForm countryCode={countryCode} />

          <div className="auth-foot">
            New to Dabasberns?{" "}
            <LocalizedLink href="/sign-up">Create an account</LocalizedLink>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
