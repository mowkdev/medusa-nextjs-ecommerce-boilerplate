"use client";

import { usePathname } from "next/navigation";
import { useTransition } from "react";

import LocalizedLink from "@/components/localized-link";
import { cn } from "@/lib/utils";
import { signout } from "@/lib/data/customer";

const items = [
  { href: "/account", label: "Overview" },
  { href: "/account/profile", label: "Profile" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/orders", label: "Orders" },
];

export function AccountNav({ countryCode }: { countryCode: string }) {
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await signout(countryCode);
    });
  };

  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid color-mix(in srgb, var(--ink) 10%, transparent)",
        paddingRight: 24,
        position: "sticky",
        top: 96,
      }}
    >
      <span
        style={{
          fontSize: 11,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "var(--accent-deep)",
          marginBottom: 14,
        }}
      >
        — Account
      </span>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((item) => {
          const fullHref = `/${countryCode}${item.href}`;
          const active =
            pathname === fullHref ||
            (item.href !== "/account" &&
              pathname.startsWith(`${fullHref}/`));
          return (
            <li key={item.href} style={{ padding: "6px 0" }}>
              <LocalizedLink
                href={item.href}
                style={{
                  display: "block",
                  fontFamily: "var(--font-display)",
                  fontSize: 18,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--ink)",
                  textDecoration: active ? "underline" : "none",
                  textUnderlineOffset: 6,
                  textDecorationThickness: 1,
                  opacity: active ? 1 : 0.7,
                }}
              >
                {item.label}
              </LocalizedLink>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={pending}
        className={cn("link-mini")}
        style={{
          background: "none",
          border: "none",
          textAlign: "left",
          padding: "16px 0 0",
          cursor: "pointer",
          color: "var(--ink-soft)",
        }}
      >
        {pending ? "Signing out…" : "Sign out →"}
      </button>
    </nav>
  );
}
