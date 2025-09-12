import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProduct } from "../lib/api";
import { useCart } from "../state/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const { addItem } = useCart();

  useEffect(() => { fetchProduct(id).then(setP).catch(console.error); }, [id]);

  if (!p) return <div>Loading...</div>;
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <img src={p.imageUrl} alt={p.name} className="rounded-2xl w-full h-[480px] object-cover" />
      <div>
        <h1 className="text-2xl font-bold">{p.name}</h1>
        <p className="text-gray-600 mt-2">{p.description}</p>
        <div className="text-2xl font-bold mt-4">₦{p.price.toLocaleString()}</div>
        <button
          onClick={() => addItem(p, 1)}
          className="mt-6 px-5 py-3 rounded-xl bg-black text-white hover:opacity-90"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
