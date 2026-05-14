import { HttpTypes } from "@medusajs/types";
import { sdk } from "@/lib/medusa";

const CART_ID_KEY = "medusa_cart_id";

function getCartId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CART_ID_KEY);
}

function setCartId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_ID_KEY, id);
}

function clearCartId() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_ID_KEY);
}

async function retrieveCart(cartId: string): Promise<HttpTypes.StoreCart> {
  const { cart } = await sdk.store.cart.retrieve(cartId);
  return cart as HttpTypes.StoreCart;
}

export async function getOrCreateCart(
  regionId: string
): Promise<HttpTypes.StoreCart> {
  const existing = getCartId();

  if (existing) {
    try {
      const cart = await retrieveCart(existing);
      // If the cart's region drifted from the active region, abandon it and create a fresh one.
      if (cart.region_id && cart.region_id !== regionId) {
        clearCartId();
      } else {
        return cart;
      }
    } catch {
      clearCartId();
    }
  }

  const { cart } = await sdk.store.cart.create({ region_id: regionId });
  setCartId(cart.id);
  return cart as HttpTypes.StoreCart;
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number
): Promise<HttpTypes.StoreCart> {
  const { cart } = await sdk.store.cart.createLineItem(cartId, {
    variant_id: variantId,
    quantity,
  });
  return cart as HttpTypes.StoreCart;
}

export async function updateLineItem(
  cartId: string,
  lineItemId: string,
  quantity: number
): Promise<HttpTypes.StoreCart> {
  const { cart } = await sdk.store.cart.updateLineItem(cartId, lineItemId, {
    quantity,
  });
  return cart as HttpTypes.StoreCart;
}

export async function removeLineItem(
  cartId: string,
  lineItemId: string
): Promise<HttpTypes.StoreCart> {
  await sdk.store.cart.deleteLineItem(cartId, lineItemId);
  return await retrieveCart(cartId);
}
