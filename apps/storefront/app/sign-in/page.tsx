import Link from "next/link";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SignInForm } from "@/components/sign-in-form";

export const metadata = {
  title: "Sign in — Dabasberns",
};

export default function SignInPage() {
  return (
    <>
      <Header solid />
      <main className="shop" data-screen-label="Sign in">
        <div className="crumb">
          <Link href="/">Dabasberns</Link>
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

          <SignInForm />

          <div className="auth-foot">
            New to Dabasberns?{" "}
            <Link href="/sign-up">Create an account</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
