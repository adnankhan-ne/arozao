"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Product } from "@/types";

type WishlistContextValue = {
  items: Product[];
  count: number;
  isInWishlist: (slug: string) => boolean;
  toggle: (product: Product) => boolean;
  add: (product: Product) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("arozaoWishlist") || "[]");
      if (Array.isArray(stored)) {
        setItems(stored.filter((item) => item && typeof item.slug === "string"));
      }
    } catch {
      localStorage.removeItem("arozaoWishlist");
    } finally {
      hydrated.current = true;
    }
  }, []);

  useEffect(() => {
    if (hydrated.current) {
      localStorage.setItem("arozaoWishlist", JSON.stringify(items));
    }
  }, [items]);

  const value = useMemo(() => {
    const isInWishlist = (slug: string) => items.some((item) => item.slug === slug);

    const toggle = (product: Product): boolean => {
      const exists = items.some((item) => item.slug === product.slug);
      if (exists) {
        setItems((current) => current.filter((item) => item.slug !== product.slug));
        return false;
      } else {
        setItems((current) => [...current, product]);
        return true;
      }
    };

    const add = (product: Product) => {
      setItems((current) => (current.some((item) => item.slug === product.slug) ? current : [...current, product]));
    };

    const remove = (slug: string) => {
      setItems((current) => current.filter((item) => item.slug !== slug));
    };

    const clear = () => setItems([]);

    return {
      items,
      count: items.length,
      isInWishlist,
      toggle,
      add,
      remove,
      clear,
    };
  }, [items]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => {
  const value = useContext(WishlistContext);
  if (!value) throw new Error("useWishlist must be used inside WishlistProvider");
  return value;
};
