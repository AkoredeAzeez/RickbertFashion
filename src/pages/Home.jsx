import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../lib/api";
import { useCart } from "../state/CartContext";

export default function Home() {
  const [products, setProducts] = useState([]);
  const { addItem } = useCart();

  useEffect(() => {
    fetchProducts().then(setProducts).catch(console.error);
  }, []);

  return (
    <div>
      <div className="mb-8 rounded-2xl p-10 bg-gradient-to-r from-amber-100 to-yellow-50">
        <h1 className="text-3xl font-bold mb-2">RICKBERT-FASHION</h1>
        <p className="text-gray-600">Beautiful styles, fast delivery, secure Paystack checkout.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p._id} className="bg-white rounded-2xl shadow p-4 flex flex-col">
            <Link to={`/product/${p._id}`} className="block">
              <img src={p.images?.[0]} alt={p.name} className="rounded-xl w-full h-56 object-cover" />
            </Link>
            <h3 className="mt-3 font-semibold">{p.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">{p.description}</p>
            <div className="mt-auto flex items-center justify-between pt-4">
              <span className="font-bold">₦{p.price.toLocaleString()}</span>
              <button
                onClick={() => addItem(p, 1)}
                className="px-3 py-2 rounded-xl bg-black text-white hover:opacity-90"
              >
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
