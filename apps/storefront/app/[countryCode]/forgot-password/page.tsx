import LocalizedLink from "@/components/localized-link";

import { Footer } from "@/components/footer";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { Header } from "@/components/header";

export const metadata = {
  title: "Forgot password — Dabasberns",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <Header solid />
      <main className="shop" data-screen-label="Forgot password">
        <div className="crumb">
          <LocalizedLink href="/">Dabasberns</LocalizedLink>
          <span className="sep">/</span>
          <LocalizedLink href="/sign-in">Sign in</LocalizedLink>
          <span className="sep">/</span>
          <span className="now">Forgot password</span>
        </div>

        <div className="auth-shell">
          <div className="auth-head">
            <span className="eyebrow">No worries</span>
            <h1>Forgot password</h1>
            <p className="sub">
              Type the email you used to sign up. We&apos;ll send a link to
              choose a new password.
            </p>
          </div>

          <ForgotPasswordForm />

          <div className="auth-foot">
            Remembered it?{" "}
            <LocalizedLink href="/sign-in">Sign in</LocalizedLink>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
