import { Link } from "react-router-dom";
import { useCart } from "../state/CartContext";

export default function Cart() {
  const { cart, updateQty, removeItem, total } = useCart();

  if (!cart.length)
    return (
      <div className="text-center">
        <p>Your cart is empty.</p>
        <Link className="underline" to="/">Go shopping</Link>
      </div>
    );

  return (
    <div className="space-y-6">
      {cart.map((i) => (
        <div key={i._id} className="bg-white p-4 rounded-xl shadow flex gap-4 items-center">
          <img src={i.imageUrl} className="w-24 h-24 rounded object-cover" />
          <div className="flex-1">
            <div className="font-semibold">{i.name}</div>
            <div className="text-sm text-gray-500">₦{i.price.toLocaleString()}</div>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={i.qty}
                onChange={(e) => updateQty(i._id, Number(e.target.value))}
                className="w-16 border rounded px-2 py-1"
              />
              <button className="text-red-600 text-sm" onClick={() => removeItem(i._id)}>
                Remove
              </button>
            </div>
          </div>
          <div className="font-bold">₦{(i.price * i.qty).toLocaleString()}</div>
        </div>
      ))}

      <div className="text-right text-xl font-bold">Total: ₦{total.toLocaleString()}</div>
      <div className="text-right">
        <Link to="/checkout" className="px-5 py-3 rounded-xl bg-black text-white inline-block">
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}
