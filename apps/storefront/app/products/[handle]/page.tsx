import Link from "next/link";
import { notFound } from "next/navigation";
import { HttpTypes } from "@medusajs/types";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ProductDetail } from "@/components/product-detail";
import { getProductByHandle, listProducts } from "@/lib/data/products";
import { getCheapestProductPrice } from "@/lib/prices";

async function getRelatedProducts(
  currentId: string
): Promise<HttpTypes.StoreProduct[]> {
  try {
    const { products } = await listProducts({ limit: 5 });
    return products.filter((p) => p.id !== currentId).slice(0, 4);
  } catch {
    return [];
  }
}

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  let product: HttpTypes.StoreProduct | null = null;
  try {
    product = await getProductByHandle(handle);
  } catch {
    // Medusa backend unavailable
  }
  if (!product) return notFound();

  const related = await getRelatedProducts(product.id);
  const metaRecord = product.metadata as Record<string, any> | null;
  const specs: { k: string; v: string; small: string }[] =
    metaRecord?.specs ?? [];

  return (
    <>
      <Header solid />
      <main className="shop" data-screen-label={`Product — ${product.title}`}>
        <div className="crumb">
          <Link href="/">Dabasberns</Link>
          <span className="sep">/</span>
          <Link href="/products">Products</Link>
          <span className="sep">/</span>
          <span className="now">{product.title}</span>
        </div>

        <div className="pdp">
          <ProductDetail product={product} />

          {specs.length > 0 && (
            <section className="specs-section">
              <div className="specs-head">
                <h3>The bench card</h3>
                <p>
                  Every rod that leaves the workshop ships with a hand-written
                  bench card — the same numbers we pencil in while we tune the
                  blank. These are the ones we've kept on this rod.
                </p>
              </div>
              <div className="specs">
                {specs.map((s) => (
                  <div key={s.k}>
                    <div className="k">{s.k}</div>
                    <div className="v">
                      {s.v}
                      <small>{s.small}</small>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {related.length > 0 && (
            <section className="pairs">
              <h3>Pairs nicely with</h3>
              <div className="row">
                {related.map((p) => {
                  const price = getCheapestProductPrice(p);
                  return (
                    <Link
                      key={p.id}
                      className="product"
                      href={`/products/${p.handle}`}
                    >
                      <div className="frame">
                        {p.thumbnail ? (
                          <img
                            src={p.thumbnail}
                            alt={p.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div className="ph" />
                        )}
                        <span className="ph-label">
                          {(p.subtitle ?? p.title ?? "").toUpperCase()}
                        </span>
                      </div>
                      <div className="meta">
                        <span className="name">{p.title}</span>
                        <span className="price">
                          {price?.formatted ?? ""}
                        </span>
                      </div>
                      <span className="cat">
                        {p.collection?.title ??
                          p.type?.value ??
                          p.categories?.[0]?.name ??
                          ""}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
