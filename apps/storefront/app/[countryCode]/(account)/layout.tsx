import { MinimalShell } from "@/components/checkout-chrome";

export default function AccountGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MinimalShell variant="account">{children}</MinimalShell>;
}
