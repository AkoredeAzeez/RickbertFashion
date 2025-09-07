import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartCtx = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (product, qty = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i._id === product._id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx].qty += qty;
        return next;
      }
      return [...prev, { ...product, qty }];
    });
  };

  const removeItem = (id) => setCart((prev) => prev.filter((i) => i._id !== id));
  const updateQty = (id, qty) =>
    setCart((prev) => prev.map((i) => (i._id === id ? { ...i, qty } : i)));
  const clearCart = () => setCart([]);

  const total = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);

  return (
    <CartCtx.Provider value={{ cart, addItem, removeItem, updateQty, total, clearCart }}>
      {children}
    </CartCtx.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartCtx);
