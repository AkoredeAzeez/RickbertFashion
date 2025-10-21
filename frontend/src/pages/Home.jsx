import { useEffect, useState } from "react";
import { fetchProducts } from "../lib/api";
import { useCart } from "../state/CartContext";
import HomeHero from "../components/home/HomeHero";
import ProductGrid from "../components/home/ProductGrid";
import FloatingCartButton from "../components/home/FloatingCartButton";
import "../styles/home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const { addItem } = useCart();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await fetchProducts();
      if (Array.isArray(res)) setProducts(res);
      else if (res && Array.isArray(res.products)) setProducts(res.products);
      else setProducts([]);
    } catch (err) {
      console.error("Failed to load products", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };


  const handleAddToCart = (product) => {
    addItem(product, 1);
  };

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-stone-50">
      <FloatingCartButton />
      <HomeHero />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 space-y-6">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 bg-white border border-stone-200 focus:border-black focus:outline-none transition-colors duration-300 font-light tracking-wide text-sm"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-stone-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              { value: "newest", label: "Newest" },
              { value: "price-low", label: "Price: Low to High" },
              { value: "price-high", label: "Price: High to Low" },
              { value: "name", label: "Alphabetical" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={`px-6 py-2 text-sm font-light tracking-wide transition-all duration-300 ${
                  sortBy === option.value ? "bg-black text-white" : "bg-white text-black border border-stone-200 hover:border-black"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <ProductGrid products={filteredProducts} loading={loading} onAdd={handleAddToCart} />
      </div>
    </div>
  );
}