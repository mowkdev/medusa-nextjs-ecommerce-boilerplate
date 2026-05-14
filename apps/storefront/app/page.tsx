import { FeaturedProducts } from "@/components/featured-products";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ParallaxHero } from "@/components/parallax-hero";
import { Story } from "@/components/story";
import { listProducts } from "@/lib/data/products";
import { HttpTypes } from "@medusajs/types";

export const dynamic = "force-dynamic";

async function getFeaturedProducts(): Promise<HttpTypes.StoreProduct[]> {
  try {
    const { products } = await listProducts({ limit: 8 });
    return products;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <>
      <Header />
      <main>
        <ParallaxHero />
        {products.length > 0 && <FeaturedProducts products={products} />}
        <Story />
      </main>
      <Footer />
    </>
  );
}
