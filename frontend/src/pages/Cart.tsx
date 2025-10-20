import React from "react";
import { useCart } from "../state/CartContext";
import CartItem from "../components/Cart/CartItem";
import EmptyCart from "../components/Cart/EmptyCart";
import OrderSummary from "../components/Cart/OrderSummary";
import "../styles/cart.css";

export default function Cart() {
  const { cart, updateQty, removeItem, total } = useCart();

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4 lg:px-16">
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((i) => (
            <CartItem key={i._id} item={i} updateQty={updateQty} removeItem={removeItem} />
          ))}
        </div>

        <OrderSummary cartLength={cart.length} total={total} />
      </div>
    </div>
  );
}
