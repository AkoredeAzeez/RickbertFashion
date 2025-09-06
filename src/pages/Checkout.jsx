import { useState } from "react";
import { useCart } from "../state/CartContext";
import { paystackInitiate } from "../lib/api";

export default function Checkout() {
  const { cart, total } = useCart();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const disabled = !cart.length || !form.email || !form.name;

  const onPay = async () => {
    try {
      const payload = {
        items: cart.map((c) => ({ productId: c._id, qty: c.qty })),
        customer: form
      };
      const res = await paystackInitiate(payload);
      window.location.href = res.authorization_url; // redirect to Paystack
    } catch (e) {
      alert("Payment init failed. Check console.");
      console.error(e);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow">
      <h1 className="text-xl font-bold mb-4">Checkout</h1>

      <div className="grid gap-3">
        {["name", "email", "phone", "address"].map((k) => (
          <input
            key={k}
            placeholder={k[0].toUpperCase() + k.slice(1)}
            value={form[k]}
            onChange={(e) => setForm({ ...form, [k]: e.target.value })}
            className="border rounded px-3 py-2"
          />
        ))}
      </div>

      <div className="mt-4 text-lg font-semibold">Total: ₦{total.toLocaleString()}</div>

      <button
        disabled={disabled}
        onClick={onPay}
        className={`mt-6 px-5 py-3 rounded-xl text-white ${disabled ? "bg-gray-400" : "bg-black"}`}
      >
        Pay with Paystack (Sandbox)
      </button>

      <p className="text-sm text-gray-500 mt-3">Use Paystack test cards on the payment page.</p>
    </div>
  );
}
