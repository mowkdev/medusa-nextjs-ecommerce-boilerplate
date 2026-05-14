import { HttpTypes } from "@medusajs/types";
import { sdk } from "@/lib/medusa";

const PRODUCT_FIELDS =
  "*variants.calculated_price,+variants.inventory_quantity,*options,*options.values,*images,+metadata,+tags";

export async function listProducts(
  query: HttpTypes.FindParams & HttpTypes.StoreProductListParams = {}
): Promise<{
  products: HttpTypes.StoreProduct[];
  count: number;
  offset: number;
  limit: number;
}> {
  const { products, count, offset, limit } = await sdk.store.product.list({
    fields: PRODUCT_FIELDS,
    limit: 20,
    ...query,
  });

  return {
    products: products as HttpTypes.StoreProduct[],
    count: count ?? 0,
    offset: offset ?? 0,
    limit: limit ?? 20,
  };
}

export async function getProductByHandle(
  handle: string
): Promise<HttpTypes.StoreProduct | null> {
  const { products } = await sdk.store.product.list({
    handle,
    fields: PRODUCT_FIELDS,
    limit: 1,
  });

  return (products?.[0] as HttpTypes.StoreProduct) ?? null;
}
