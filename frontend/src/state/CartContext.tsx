import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Product } from "../types";

export interface CartItem extends Product {
  qty: number;
}

interface ICartContext {
  cart: CartItem[];
  addItem: (product: Product, qty?: number) => void;
  removeItem: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  total: number;
  clearCart: () => void;
}

const CartCtx = createContext<ICartContext | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (product: Product, qty = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx].qty += qty;
        return next;
      }
      return [...prev, { ...product, qty }];
    });
  };

  const removeItem = (id: number) => setCart((prev) => prev.filter((i) => i.id !== id));
  const updateQty = (id: number, qty: number) =>
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  const clearCart = () => setCart([]);

  const total = useMemo(() => cart.reduce((s, i) => s + i.attributes.price * i.qty, 0), [cart]);

  return (
    <CartCtx.Provider value={{ cart, addItem, removeItem, updateQty, total, clearCart }}>
      {children}
    </CartCtx.Provider>
  );
}

export const useCart = () => {
    const context = useContext(CartCtx);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
