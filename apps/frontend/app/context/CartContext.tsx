"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type CartContextValue = {
  cartCount: number;
  setCartCount: (n: number) => void;
  increment: (delta?: number) => void;
  reset: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "cart_count";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCountState] = useState<number>(0);

  useEffect(() => {
    try {
      const stored = globalThis.localStorage?.getItem(STORAGE_KEY);
      if (stored) setCartCountState(parseInt(stored, 10) || 0);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      globalThis.localStorage?.setItem(STORAGE_KEY, String(cartCount));
    } catch {}
  }, [cartCount]);

  const setCartCount = (n: number) => setCartCountState(Math.max(0, n | 0));
  const increment = (delta = 1) =>
    setCartCountState((c) => Math.max(0, c + delta));
  const reset = () => setCartCountState(0);

  const value = useMemo<CartContextValue>(
    () => ({ cartCount, setCartCount, increment, reset }),
    [cartCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
