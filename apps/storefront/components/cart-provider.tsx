"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { HttpTypes } from "@medusajs/types";

import {
  getOrCreateCart,
  addToCart as addToCartApi,
  updateLineItem as updateLineItemApi,
  removeLineItem as removeLineItemApi,
} from "@/lib/data/cart";
import { formatPrice } from "@/lib/prices";

type CartContextValue = {
  cart: HttpTypes.StoreCart | null;
  loading: boolean;
  adding: boolean;
  itemCount: number;
  subtotal: string;
  currencyCode: string;
  countryCode: string;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  updateItem: (lineItemId: string, quantity: number) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  children,
  regionId,
  countryCode,
}: {
  children: React.ReactNode;
  regionId: string;
  countryCode: string;
}) {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const refreshCart = useCallback(async () => {
    try {
      const c = await getOrCreateCart(regionId);
      setCart(c);
    } catch (err) {
      console.error("Failed to load cart:", err);
    } finally {
      setLoading(false);
    }
  }, [regionId]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = useCallback(
    async (variantId: string, quantity: number) => {
      if (!cart) return;
      setAdding(true);
      try {
        const updated = await addToCartApi(cart.id, variantId, quantity);
        setCart(updated);
      } finally {
        setAdding(false);
      }
    },
    [cart]
  );

  const updateItem = useCallback(
    async (lineItemId: string, quantity: number) => {
      if (!cart) return;
      try {
        const updated = await updateLineItemApi(cart.id, lineItemId, quantity);
        setCart(updated);
      } catch (err) {
        console.error("Failed to update item:", err);
      }
    },
    [cart]
  );

  const removeItem = useCallback(
    async (lineItemId: string) => {
      if (!cart) return;
      try {
        const updated = await removeLineItemApi(cart.id, lineItemId);
        setCart(updated);
      } catch (err) {
        console.error("Failed to remove item:", err);
      }
    },
    [cart]
  );

  const itemCount = useMemo(() => {
    if (!cart?.items) return 0;
    return cart.items.reduce(
      (sum: number, item: HttpTypes.StoreCartLineItem) => sum + item.quantity,
      0
    );
  }, [cart]);

  const currencyCode = cart?.currency_code ?? "eur";

  const subtotal = useMemo(() => {
    if (!cart) return formatPrice(0, "eur");
    const raw = cart.item_subtotal ?? 0;
    return formatPrice(raw, currencyCode);
  }, [cart, currencyCode]);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      loading,
      adding,
      itemCount,
      subtotal,
      currencyCode,
      countryCode,
      addItem,
      updateItem,
      removeItem,
      refreshCart,
    }),
    [
      cart,
      loading,
      adding,
      itemCount,
      subtotal,
      currencyCode,
      countryCode,
      addItem,
      updateItem,
      removeItem,
      refreshCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return ctx;
}
