import { AccountNav } from "@/components/account/account-nav";
import { ProfileForm } from "@/components/account/profile-form";
import { retrieveCustomer } from "@/lib/data/customer";

export const metadata = { title: "Profile — Dabasberns" };

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ countryCode: string }>;
}) {
  const { countryCode } = await params;
  const customer = await retrieveCustomer();
  if (!customer) return null;

  return (
    <div
      style={{
        maxWidth: "var(--container)",
        margin: "0 auto",
        padding: "24px var(--pad) 96px",
        display: "grid",
        gridTemplateColumns: "220px minmax(0, 1fr)",
        gap: 48,
      }}
    >
      <AccountNav countryCode={countryCode} />

      <section style={{ maxWidth: 520 }}>
        <span
          style={{
            fontSize: 11,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--accent-deep)",
          }}
        >
          — Profile
        </span>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 4vw, 52px)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            margin: "12px 0 24px",
            lineHeight: 1,
            fontWeight: 400,
          }}
        >
          Your details
        </h1>

        <ProfileForm customer={customer} />
      </section>
    </div>
  );
}
