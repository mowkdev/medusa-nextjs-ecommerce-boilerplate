import Link from "next/link";
import { HttpTypes } from "@medusajs/types";

import {
  ActiveTags,
  CategorySidebar,
  ResultsBar,
} from "@/components/category-filters";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { listProducts } from "@/lib/data/products";
import { getCheapestProductPrice } from "@/lib/prices";

function extractSwatchColors(product: HttpTypes.StoreProduct): string[] {
  if (!product.options) return [];
  for (const opt of product.options) {
    const title = opt.title?.toLowerCase() ?? "";
    if (title.includes("color") || title.includes("colour") || title.includes("wrap")) {
      return (opt.values ?? [])
        .map((v) => v.value)
        .filter((v) => v.startsWith("#"));
    }
  }
  return [];
}

export const dynamic = "force-dynamic";

export default async function CategoryPage() {
  let products: HttpTypes.StoreProduct[] = [];
  let count = 0;

  try {
    const result = await listProducts({ limit: 20 });
    products = result.products;
    count = result.count;
  } catch {
    // Medusa backend unavailable
  }

  return (
    <>
      <Header solid />
      <main className="shop" data-screen-label="Category — Products">
        <div className="crumb">
          <Link href="/">Dabasberns</Link>
          <span className="sep">/</span>
          <Link href="#">Shop</Link>
          <span className="sep">/</span>
          <span className="now">All products</span>
        </div>

        <header className="shop-head">
          <div>
            <span className="eyebrow">
              {count} {count === 1 ? "product" : "products"}
            </span>
            <h1>Products</h1>
          </div>
          <p className="lede">
            Split-cane, fiberglass and graphite — each one wrapped, tuned and
            cast on the lake before it leaves the bench. Sized for cold-water
            trout, perch and the occasional pike.
          </p>
        </header>

        <div className="cat-layout">
          <CategorySidebar />

          <section className="results">
            <ResultsBar />
            <ActiveTags />

            <div className="pgrid">
              {products.map((p) => {
                const price = getCheapestProductPrice(p);
                const tag = (p.metadata as Record<string, string> | null)?.tag;
                const tagVariant = (
                  p.metadata as Record<string, string> | null
                )?.tag_variant;
                const swatches = extractSwatchColors(p);

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
                          className="ph"
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      ) : (
                        <div className="ph" />
                      )}
                      {tag && (
                        <span
                          className={
                            tagVariant === "accent" ? "tag accent" : "tag"
                          }
                        >
                          {tag}
                        </span>
                      )}
                      <span className="ph-label">
                        {(p.subtitle ?? p.title ?? "").toUpperCase()}
                      </span>
                    </div>
                    <div className="meta">
                      <span className="name">{p.title}</span>
                      <span className="price">{price?.formatted ?? ""}</span>
                    </div>
                    <span className="cat">
                      {p.collection?.title ??
                        p.type?.value ??
                        p.categories?.[0]?.name ??
                        ""}
                    </span>
                    {swatches.length > 0 && (
                      <div className="swatches">
                        {swatches.map((c, i) => (
                          <span
                            key={i}
                            className="d"
                            style={{ background: c }}
                          />
                        ))}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>

            <nav className="pager" aria-label="Pagination">
              <button
                type="button"
                className="nav-btn"
                disabled
                aria-label="Previous"
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path d="M10 3L5 8l5 5" />
                </svg>
              </button>
              <Link className="now" href="#">
                01
              </Link>
              <Link href="#">02</Link>
              <Link className="nav-btn" href="#" aria-label="Next">
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path d="M6 3l5 5-5 5" />
                </svg>
              </Link>
            </nav>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
