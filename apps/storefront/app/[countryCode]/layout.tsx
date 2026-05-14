import { notFound } from "next/navigation";

import { CartUiProvider } from "@/components/cart-panel";
import { CartProvider } from "@/components/cart-provider";
import { getRegion } from "@/lib/data/regions";

export default async function CountryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ countryCode: string }>;
}) {
  const { countryCode } = await params;
  const region = await getRegion(countryCode);

  if (!region) {
    notFound();
  }

  return (
    <CartProvider regionId={region.id} countryCode={countryCode}>
      <CartUiProvider>{children}</CartUiProvider>
    </CartProvider>
  );
}
