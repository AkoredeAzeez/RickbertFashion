import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { fetchProducts, deleteProduct } from "../lib/api";
import { useCart } from "../state/CartContext";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const { addItem, getTotalItems } = useCart();
  const [popup, setPopup] = useState({ message: "", visible: false });
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await fetchProducts();
      console.log("API response:", res);

      if (Array.isArray(res)) {
        setProducts(res);
      } else if (res && Array.isArray(res.products)) {
        setProducts(res.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Failed to load products", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, productName) => {
    if (window.confirm(`Remove "${productName}" from collection?`)) {
      try {
        await deleteProduct(id);
        setPopup({ message: `${productName} removed from collection`, visible: true });
        setTimeout(() => setPopup(prev => ({ ...prev, visible: false })), 3000);
        loadProducts();
      } catch (err) {
        console.error("Failed to delete product", err);
      }
    }
  };

  const handleAddToCart = (product) => {
    addItem(product, 1);
    setPopup({ message: `${product.name} added to cart`, visible: true });
    setTimeout(() => setPopup(prev => ({ ...prev, visible: false })), 2500);
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
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-white text-stone-900">
      {/* Floating Cart Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        <Link to="/cart">
          <motion.div
            className="relative bg-black text-white p-5 rounded-full shadow-2xl hover:shadow-3xl group"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            }}
          >
            {/* Cart Icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
            </svg>

            {/* Animated Badge */}
            <motion.div
              className="absolute -top-2 -right-2 bg-white text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              {getTotalItems()}
            </motion.div>

            {/* Tooltip */}
            <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-3 px-3 py-2 bg-black text-white text-xs font-light tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap rounded">
              VIEW CART ({getTotalItems()})
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
            </div>
          </motion.div>
        </Link>
      </motion.div>

      {/* Premium Notification Popup */}
      <AnimatePresence>
        {popup.visible && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.8 }}
            className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-8 py-4 rounded-none shadow-2xl z-50 border border-stone-800"
            style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <p className="font-light tracking-wide text-sm uppercase">{popup.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative h-screen flex items-center justify-center bg-black text-white overflow-hidden"
        style={{ opacity }}
      >
        {/* Dynamic Background */}
        <motion.div
          className="absolute inset-0"
          style={{ 
            y: yBg,
            background: 'linear-gradient(135deg, #000000 0%, #1c1917 50%, #292524 100%)'
          }}
        />

        {/* Animated Background Pattern */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />

        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
          >
            <h1 
              className="text-6xl md:text-8xl lg:text-9xl font-thin tracking-wider mb-8"
              style={{ 
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                textShadow: '0 0 50px rgba(255,255,255,0.3)'
              }}
            >
              RICKBERT
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-8" />
            <p className="text-xl md:text-2xl font-light tracking-[0.3em] opacity-80 uppercase">
              Curated Fashion Collection
            </p>
          </motion.div>

          {/* Search Bar - Hero Style */}
          <motion.div
            className="max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.8 }}
          >
            <div className="relative group">
              <input
                type="text"
                placeholder="DISCOVER YOUR STYLE..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full px-8 py-6 bg-transparent border-2 border-white/30 text-white placeholder-white/50 text-lg font-light tracking-widest focus:outline-none focus:border-white/80 transition-all duration-500 text-center uppercase"
                style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
              />
              <motion.div
                className="absolute inset-0 border-2 border-white"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isSearchFocused ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ originX: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
          >
            <div className="flex flex-col items-center text-white/60">
              <span className="text-xs tracking-widest mb-4 uppercase font-light">Explore Collection</span>
              <div className="w-px h-20 bg-gradient-to-b from-white to-transparent" />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Filter & Sort Controls */}
      <motion.section 
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 py-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Sort Options */}
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'newest', label: 'Latest' },
                { value: 'price-low', label: 'Price ↑' },
                { value: 'price-high', label: 'Price ↓' },
                { value: 'name', label: 'A-Z' }
              ].map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`px-6 py-2 text-sm font-light tracking-wide transition-all duration-300 border ${
                    sortBy === option.value
                      ? 'bg-black text-white border-black'
                      : 'bg-transparent text-stone-700 border-stone-300 hover:border-stone-500'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-light text-stone-600 tracking-wide">
                {filteredProducts.length} PIECES
              </span>
              <div className="flex border border-stone-300">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-colors ${viewMode === 'grid' ? 'bg-black text-white' : 'text-stone-600 hover:text-black'}`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-colors ${viewMode === 'list' ? 'bg-black text-white' : 'text-stone-600 hover:text-black'}`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 12a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Products Section */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <motion.div className="flex flex-col items-center">
                <motion.div
                  className="w-20 h-20 border-2 border-stone-900 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.p 
                  className="mt-6 text-stone-600 font-light tracking-wide uppercase text-sm"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Curating Collection
                </motion.p>
              </motion.div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {filteredProducts.length > 0 ? (
                <motion.div
                  key="products"
                  className={viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" 
                    : "space-y-8"
                  }
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, staggerChildren: 0.1 }}
                >
                  {filteredProducts.map((product, index) => (
                    <motion.article
                      key={product._id}
                      className={`group bg-white shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden ${
                        viewMode === 'list' ? 'flex gap-6 p-6' : ''
                      }`}
                      initial={{ opacity: 0, y: 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                      layout
                      whileHover={{ y: viewMode === 'grid' ? -12 : 0 }}
                    >
                      {/* Product Image */}
                      <div className={`relative overflow-hidden bg-stone-50 ${
                        viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'aspect-[4/5]'
                      }`}>
                        <Link to={`/product/${product._id}`} className="block h-full">
                          <motion.img
                            src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.png"}
                            alt={product.name}
                            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                            loading="lazy"
                          />
                        </Link>
                        
                        {/* Hover Overlay */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"
                        />
                        
                        {/* Floating Actions */}
                        <motion.div
                          className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                          initial={{ x: 20 }}
                          whileInView={{ x: 0 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                        >
                          {/* Price Badge */}
                          <div className="bg-white/95 backdrop-blur-sm text-black px-3 py-2 text-sm font-light shadow-lg">
                            ₦{product.price?.toLocaleString()}
                          </div>
                        </motion.div>

                        {/* Quick Actions Overlay */}
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500"
                        >
                          <div className="flex gap-3">
                            <motion.button
                              onClick={() => handleAddToCart(product)}
                              className="bg-white text-black px-6 py-3 text-sm font-light tracking-wide uppercase hover:bg-stone-100 transition-colors duration-300 shadow-lg"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Add to Cart
                            </motion.button>
                            
                            <motion.button
                              onClick={() => handleDelete(product._id, product.name)}
                              className="bg-red-600 text-white p-3 hover:bg-red-700 transition-colors duration-300 shadow-lg"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              title="Remove from Collection"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </motion.button>
                          </div>
                        </motion.div>
                      </div>

                      {/* Product Details */}
                      <div className={viewMode === 'list' ? 'flex-1 flex flex-col justify-between py-2' : 'p-6'}>
                        <div>
                          <Link to={`/product/${product._id}`}>
                            <motion.h3
                              className="text-lg font-light tracking-wide mb-3 uppercase hover:text-stone-600 transition-colors duration-300"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.4 + index * 0.05 }}
                            >
                              {product.name}
                            </motion.h3>
                          </Link>
                          
                          <motion.p
                            className="text-stone-600 text-sm font-light leading-relaxed mb-4 line-clamp-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 + index * 0.05 }}
                          >
                            {product.description}
                          </motion.p>
                        </div>

                        {/* Mobile/List Actions */}
                        {viewMode === 'list' && (
                          <motion.div
                            className="flex gap-3 mt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 + index * 0.05 }}
                          >
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="flex-1 bg-black text-white py-3 px-4 text-sm font-light tracking-wide uppercase hover:bg-stone-800 transition-colors duration-300"
                            >
                              Add to Cart - ₦{product.price?.toLocaleString()}
                            </button>
                          </motion.div>
                        )}

                        {/* Grid Mode: Price Display */}
                        {viewMode === 'grid' && (
                          <motion.div
                            className="pt-4 border-t border-stone-100"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 + index * 0.05 }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-light text-stone-900">
                                ₦{product.price?.toLocaleString()}
                              </span>
                              <Link 
                                to={`/product/${product._id}`}
                                className="text-sm font-light tracking-wide text-stone-500 hover:text-stone-900 transition-colors uppercase"
                              >
                                View Details →
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.article>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="text-center py-32"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-8">
                      <svg className="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-light tracking-wide mb-4 uppercase">No Pieces Found</h3>
                    <p className="text-stone-600 font-light leading-relaxed">
                      {searchTerm 
                        ? `No results for "${searchTerm}". Try adjusting your search.`
                        : 'Our curated collection is being updated. Check back soon.'
                      }
                    </p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="mt-6 px-6 py-3 border border-stone-300 text-stone-600 hover:border-stone-500 hover:text-stone-900 transition-colors duration-300 text-sm font-light tracking-wide uppercase"
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </section>
    </div>
  );
}