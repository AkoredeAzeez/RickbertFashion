import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts, deleteProduct } from "../lib/api";
import { useCart } from "../state/CartContext";

export default function Home() {
  const [products, setProducts] = useState([]);
  const { addItem } = useCart();
  const [popup, setPopup] = useState({ message: "", visible: false });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await fetchProducts();
      console.log("API response:", res);

      // Normalize response (handle both array or object with products)
      if (Array.isArray(res)) {
        setProducts(res);
      } else if (res && Array.isArray(res.products)) {
        setProducts(res.products);
      } else {
        setProducts([]); // fallback
      }
    } catch (err) {
      console.error("Failed to load products", err);
      setProducts([]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        loadProducts();
      } catch (err) {
        console.error("Failed to delete product", err);
      }
    }
  };

  const handleAddToCart = (product) => {
    addItem(product, 1);
    setPopup({ message: `${product.name} added to cart!`, visible: true });

    // hide after 2 seconds
    setTimeout(() => {
      setPopup((prev) => ({ ...prev, visible: false }));
    }, 2000);
  };

  return (
    <div>
      {/* Sliding popup */}
      <div
        style={{
          position: "fixed",
          top: popup.visible ? "20px" : "-60px",
          right: "20px",
          background: "#111",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
          transition: "top 0.5s ease-in-out",
          zIndex: 9999,
        }}
      >
        {popup.message}
      </div>

      <div className="mb-8 rounded-2xl p-10 bg-gradient-to-r from-amber-100 to-yellow-50">
        <h1 className="text-3xl font-bold mb-2">RICKBERT-FASHION</h1>
        <p className="text-gray-600">
          Beautiful styles, fast delivery, secure Paystack checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl shadow p-4 flex flex-col"
            >
              <Link to={`/product/${p._id}`} className="block">
                <img
                  src={p.images?.[0]}
                  alt={p.name}
                  className="rounded-xl w-full h-56 object-cover"
                />
              </Link>
              <h3 className="mt-3 font-semibold">{p.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {p.description}
              </p>
              <div className="mt-auto flex items-center justify-between pt-4 gap-2">
                <span className="font-bold">₦{p.price.toLocaleString()}</span>
                <button
                  onClick={() => handleAddToCart(p)}
                  className="px-3 py-2 rounded-xl bg-black text-white hover:opacity-90"
                >
                  Add to cart
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="px-3 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No products available
          </p>
        )}
      </div>
    </div>
  );
}
