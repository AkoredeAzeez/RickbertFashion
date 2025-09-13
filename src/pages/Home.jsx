import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fetchProducts, deleteProduct } from "../lib/api";
import { useCart } from "../state/CartContext";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const { addItem, getTotalItems } = useCart();
  const [popup, setPopup] = useState({ message: "", visible: false });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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

  // Filter and sort products
  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0; // newest (default order from API)
      }
    });

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Floating Cart Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <Link to="/cart">
          <motion.div
            className="relative bg-black text-white p-4 rounded-full shadow-2xl hover:bg-stone-800 transition-colors duration-300 group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Cart Icon */}
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" 
              />
            </svg>

            {/* Item Count Badge - Simple version without count */}
            <motion.div
              className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />

            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black text-white text-sm font-light tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
              View Cart
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
            </div>
          </motion.div>
        </Link>
      </motion.div>

      {/* Enhanced sliding popup */}
      <AnimatePresence>
        {popup.visible && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-6 right-6 bg-black text-white px-6 py-4 rounded-none shadow-2xl z-50 border-l-4 border-white"
            style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
          >
            <p className="font-light tracking-wide text-sm">{popup.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <motion.section 
        className="relative py-16 md:py-24 bg-black text-white overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-thin tracking-wider mb-6"
              style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
            >
              RICKBERT COLLECTION
            </motion.h1>
            <motion.div
              className="w-32 h-0.5 bg-white mx-auto mb-6"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.8 }}
            />
            <motion.p
              className="text-lg md:text-xl font-light tracking-wide opacity-80 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 1.2, duration: 1 }}
            >
              Discover timeless pieces crafted for the modern wardrobe
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search and Filter Section */}
        <motion.div
          className="mb-12 space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* Search Bar */}
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

          {/* Sort Options */}
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { value: 'newest', label: 'Newest' },
              { value: 'price-low', label: 'Price: Low to High' },
              { value: 'price-high', label: 'Price: High to Low' },
              { value: 'name', label: 'Alphabetical' }
            ].map((option) => (
              <motion.button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={`px-6 py-2 text-sm font-light tracking-wide transition-all duration-300 ${
                  sortBy === option.value
                    ? 'bg-black text-white'
                    : 'bg-white text-black border border-stone-200 hover:border-black'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <motion.div
              className="w-16 h-16 border-2 border-black border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <AnimatePresence>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    className="group bg-white shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    layout
                    whileHover={{ y: -10 }}
                  >
                    {/* Product Image */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-stone-50">
                      <Link to={`/product/${product._id}`} className="block h-full">
                        <motion.img
                          src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.png"}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      </Link>
                      
                      {/* Hover overlay */}
                      <motion.div
                        className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      
                      {/* Price tag */}
                      <motion.div
                        className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-black px-3 py-1 text-sm font-light"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        ₦{product.price?.toLocaleString()}
                      </motion.div>
                    </div>

                    {/* Product Details */}
                    <div className="p-6">
                      <Link to={`/product/${product._id}`}>
                        <motion.h3
                          className="text-lg font-light tracking-wide mb-2 uppercase hover:text-stone-600 transition-colors"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                        >
                          {product.name}
                        </motion.h3>
                      </Link>
                      
                      <motion.p
                        className="text-stone-600 text-sm font-light leading-relaxed mb-4 line-clamp-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                      >
                        {product.description}
                      </motion.p>

                      {/* Action Buttons */}
                      <motion.div
                        className="flex gap-3 pt-4 border-t border-stone-100"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                      >
                        <motion.button
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 bg-black text-white py-3 px-4 text-sm font-light tracking-wide uppercase hover:bg-stone-800 transition-colors duration-300"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Add to Cart
                        </motion.button>
                        
                        <motion.button
                          onClick={() => handleDelete(product._id)}
                          className="px-4 py-3 border border-red-200 text-red-600 hover:bg-red-50 transition-colors duration-300 text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Delete Product"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </motion.button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="col-span-full text-center py-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-light tracking-wide mb-2">No products found</h3>
                    <p className="text-stone-600 font-light">
                      {searchTerm ? 'Try adjusting your search terms.' : 'Check back later for new arrivals.'}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}