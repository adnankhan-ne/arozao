"use client";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CartItem, Product } from "@/types";

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  add: (product: Product, quantity?: number) => void;
  remove: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
};
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const hydrated = useRef(false);
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("arozaoCart") || "[]");
      if (Array.isArray(stored)) setItems(stored.filter((item) => item && typeof item.slug === "string" && Number(item.quantity) > 0));
    } catch {
      localStorage.removeItem("arozaoCart");
    } finally {
      hydrated.current = true;
    }
  }, []);
  useEffect(() => {
    if (hydrated.current) localStorage.setItem("arozaoCart", JSON.stringify(items));
  }, [items]);
  const value = useMemo(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce((sum, item) => sum + (item.salePrice ?? item.price) * item.quantity, 0),
    add: (product: Product, quantity: number = 1) =>
      setItems((current) => {
        const qty = Math.max(1, quantity);
        return current.some((item) => item.slug === product.slug)
          ? current.map((item) => (item.slug === product.slug ? { ...item, quantity: item.quantity + qty } : item))
          : [...current, { ...product, quantity: qty }];
      }),
    remove: (slug: string) => setItems((current) => current.filter((item) => item.slug !== slug)),
    setQuantity: (slug: string, quantity: number) =>
      setItems((current) =>
        quantity < 1
          ? current.filter((item) => item.slug !== slug)
          : current.map((item) => (item.slug === slug ? { ...item, quantity } : item))
      ),
    clear: () => setItems([]),
  }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export const useCart = () => {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
};
