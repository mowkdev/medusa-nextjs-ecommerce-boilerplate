"use client";

import LocalizedLink from "@/components/localized-link";
import { ThemeToggle } from "@/components/theme-toggle";

export function CheckoutHeader({
  centerLabel = "Your bench",
  backHref = "/products",
  backLabel = "Continue shopping",
}: {
  centerLabel?: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <header className="nav-checkout" data-screen-label="Nav">
      <div className="left">
        <LocalizedLink
          href="/"
          className="brand"
          aria-label="Dabasberns — home"
        >
          <span className="logo-mark" role="img" aria-label="Dabasberns" />
        </LocalizedLink>
        <LocalizedLink href={backHref} className="back">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 3L5 8l5 5" />
          </svg>
          {backLabel}
        </LocalizedLink>
      </div>
      <div className="center">{centerLabel}</div>
      <div className="right">
        <span className="secure">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="4" y="10" width="16" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
          Secure cart
        </span>
        <LocalizedLink href="/account" className="help">
          Help?
        </LocalizedLink>
        <ThemeToggle />
        <LocalizedLink
          href="/account"
          className="icon-btn"
          aria-label="Account"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20c1.2-3.5 4.1-5.5 7-5.5s5.8 2 7 5.5" />
          </svg>
        </LocalizedLink>
      </div>
    </header>
  );
}

export function CheckoutFooter() {
  return (
    <footer className="footer-checkout" data-screen-label="Footer">
      <div className="left">
        <span className="logo-mark" role="img" aria-label="Dabasberns" />
        <span>© 2026 Dabasberns SIA</span>
      </div>
      <nav className="links" aria-label="Help">
        <LocalizedLink href="/account">Help</LocalizedLink>
        <LocalizedLink href="/account">Shipping</LocalizedLink>
        <LocalizedLink href="/account">Returns</LocalizedLink>
        <LocalizedLink href="/account">Contact</LocalizedLink>
        <LocalizedLink href="/account">Privacy</LocalizedLink>
        <LocalizedLink href="/account">Terms</LocalizedLink>
      </nav>
    </footer>
  );
}
