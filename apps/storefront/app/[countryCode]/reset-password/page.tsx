import LocalizedLink from "@/components/localized-link";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ResetPasswordForm } from "@/components/reset-password-form";

export const metadata = {
  title: "Reset password — Dabasberns",
};

export default async function ResetPasswordPage({
  params,
  searchParams,
}: {
  params: Promise<{ countryCode: string }>;
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  const { countryCode } = await params;
  const { token = "", email = "" } = await searchParams;

  const invalid = !token || !email;

  return (
    <>
      <Header solid />
      <main className="shop" data-screen-label="Reset password">
        <div className="crumb">
          <LocalizedLink href="/">Dabasberns</LocalizedLink>
          <span className="sep">/</span>
          <span className="now">Reset password</span>
        </div>

        <div className="auth-shell">
          <div className="auth-head">
            <span className="eyebrow">Almost done</span>
            <h1>Reset password</h1>
            <p className="sub">
              {invalid
                ? "This link is missing or invalid. Request a new one from the forgot password page."
                : "Pick a new password for your account. At least eight characters with a letter and a number."}
            </p>
          </div>

          {invalid ? (
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <LocalizedLink
                href="/forgot-password"
                className="auth-cta"
                style={{ display: "inline-flex", textDecoration: "none" }}
              >
                <span>Request new link</span>
                <span>→</span>
              </LocalizedLink>
            </div>
          ) : (
            <ResetPasswordForm
              email={email}
              token={token}
              countryCode={countryCode}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
