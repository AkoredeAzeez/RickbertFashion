import { Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Upload from "./pages/Upload.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx"; 
import { CartProvider } from "./state/CartContext.jsx";
import Orders from "./pages/Orders.jsx";
import LandingPage from "./pages/LandingPage.jsx";

export default function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close nav when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isNavOpen) {
        setIsNavOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isNavOpen]);

  const toggleNav = (e) => {
    e.stopPropagation();
    setIsNavOpen(!isNavOpen);
  };

  const navItems = [
    { to: "/home", label: "Shop" },
    { to: "/cart", label: "Cart" },
    { to: "/checkout", label: "Checkout" },
    { to: "/upload", label: "Upload" },
    { to: "/orders", label: "Orders" }
  ];

  return (
    <CartProvider>
      <div className="min-h-screen bg-stone-50">
        {/* Navigation */}
        <motion.nav 
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            isScrolled 
              ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200' 
              : 'bg-transparent'
          }`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            {/* Logo */}
            <Link 
              to="/" 
              className={`text-lg font-light tracking-wide transition-colors duration-300 ${
                isScrolled ? 'text-stone-900' : 'text-white'
              }`}
              style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
            >
              RICKBERT FASHION
            </Link>

            {/* Desktop Navigation - Hidden by default, can be toggled */}
            <div className="hidden md:block">
              <motion.button
                onClick={toggleNav}
                className={`p-2 transition-colors duration-300 ${
                  isScrolled ? 'text-stone-900 hover:text-stone-600' : 'text-white hover:text-stone-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex flex-col space-y-1">
                  <motion.div 
                    className="w-6 h-0.5 bg-current origin-center transition-transform duration-300"
                    animate={isNavOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  />
                  <motion.div 
                    className="w-6 h-0.5 bg-current transition-opacity duration-300"
                    animate={isNavOpen ? { opacity: 0 } : { opacity: 1 }}
                  />
                  <motion.div 
                    className="w-6 h-0.5 bg-current origin-center transition-transform duration-300"
                    animate={isNavOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  />
                </div>
              </motion.button>
            </div>

            {/* Mobile hamburger */}
            <div className="md:hidden">
              <motion.button
                onClick={toggleNav}
                className={`p-2 transition-colors duration-300 ${
                  isScrolled ? 'text-stone-900 hover:text-stone-600' : 'text-white hover:text-stone-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex flex-col space-y-1">
                  <motion.div 
                    className="w-5 h-0.5 bg-current origin-center transition-transform duration-300"
                    animate={isNavOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                  />
                  <motion.div 
                    className="w-5 h-0.5 bg-current transition-opacity duration-300"
                    animate={isNavOpen ? { opacity: 0 } : { opacity: 1 }}
                  />
                  <motion.div 
                    className="w-5 h-0.5 bg-current origin-center transition-transform duration-300"
                    animate={isNavOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
                  />
                </div>
              </motion.button>
            </div>
          </div>

          {/* Collapsible Navigation Menu */}
          <AnimatePresence>
            {isNavOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setIsNavOpen(false)}
                />
                
                {/* Navigation Menu */}
                <motion.div
                  className="absolute top-full left-0 right-0 bg-white border-b border-stone-200 shadow-lg"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row md:justify-center space-y-4 md:space-y-0 md:space-x-12">
                      {navItems.map((item, index) => (
                        <motion.div
                          key={item.to}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                        >
                          <Link
                            to={item.to}
                            className="block text-stone-900 hover:text-stone-600 font-light tracking-wide transition-colors duration-300 text-sm uppercase py-2"
                            onClick={() => setIsNavOpen(false)}
                          >
                            {item.label}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.nav>

        {/* Main content with proper spacing for fixed nav */}
        <main className="relative">
          <Routes>
            <Route path="/" element={<LandingPage />}/>
            <Route path="/home" element={
              <div className="pt-20">
                <Home />
              </div>
            } />
            <Route path="/product/:id" element={
              <div className="pt-20">
                <ProductDetail />
              </div>
            } />
            <Route path="/cart" element={
              <div className="pt-20">
                <Cart />
              </div>
            } />
            <Route path="/checkout" element={
              <div className="pt-20">
                <Checkout />
              </div>
            } />
            <Route path="/payment-success" element={
              <div className="pt-20">
                <PaymentSuccess />
              </div>
            } />
            <Route path="/upload" element={
              <div className="pt-20">
                <Upload />
              </div>
            } />
            <Route path="/orders" element={
              <div className="pt-20">
                <Orders />
              </div>
            } />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-stone-100 py-12 text-center">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-stone-600 font-light tracking-wide text-sm uppercase">
              Rickbert Fashion
            </p>
            <div className="w-12 h-px bg-stone-400 mx-auto mt-4" />
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}