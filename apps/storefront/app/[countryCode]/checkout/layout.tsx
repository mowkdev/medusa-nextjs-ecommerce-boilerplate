import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header solid />
      {children}
      <Footer />
    </>
  );
}
