import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../state/CartContext";

export default function Cart() {
  const { cart, updateQty, removeItem, total } = useCart();

  if (!cart.length)
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <motion.div
          className="text-center max-w-md mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Empty cart illustration */}
          <motion.div
            className="w-32 h-32 mx-auto mb-8 relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="w-full h-full border-2 border-stone-300 rounded-full flex items-center justify-center">
              <motion.div
                className="w-16 h-16 border border-stone-400 rounded-lg relative"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="absolute inset-2 border-t border-stone-400 rounded-sm opacity-50" />
                <div className="absolute bottom-2 left-2 right-2 h-px bg-stone-400 opacity-30" />
              </motion.div>
            </div>
          </motion.div>

          <motion.h2
            className="text-2xl md:text-3xl font-light tracking-wide text-stone-900 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            YOUR CART IS EMPTY
          </motion.h2>

          <motion.p
            className="text-stone-600 font-light mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Discover our curated collection of timeless pieces
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <Link
              to="/home"
              className="inline-block relative group"
            >
              <motion.div
                className="absolute inset-0 bg-stone-900"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
              />
              <span className="relative block px-8 py-4 border border-stone-900 text-stone-900 group-hover:text-white font-light tracking-[0.2em] text-sm transition-colors duration-500 uppercase">
                Continue Shopping
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-3xl md:text-4xl font-light tracking-wide text-stone-900 mb-4">
            SHOPPING CART
          </h1>
          <div className="w-20 h-0.5 bg-stone-400 mx-auto" />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {cart.map((item, index) => (
                <motion.div
                  key={item._id}
                  className="bg-white border border-stone-200 overflow-hidden shadow-sm"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50, height: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  layout
                >
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Product Image */}
                      <motion.div
                        className="w-full md:w-32 h-48 md:h-32 bg-stone-100 overflow-hidden flex-shrink-0"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>

                      {/* Product Details */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-lg font-light tracking-wide text-stone-900 uppercase mb-2">
                            {item.name}
                          </h3>
                          <p className="text-stone-600 font-light">
                            ₦{item.price.toLocaleString()}
                          </p>
                        </div>

                        {/* Quantity and Remove Controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <label className="text-sm font-light tracking-wide text-stone-700 uppercase">
                              Quantity
                            </label>
                            <motion.select
                              value={item.qty}
                              onChange={(e) => updateQty(item._id, Number(e.target.value))}
                              className="w-20 px-3 py-2 border border-stone-300 text-stone-900 font-light focus:border-stone-500 focus:outline-none transition-colors duration-300"
                              whileFocus={{ scale: 1.02 }}
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                <option key={num} value={num}>{num}</option>
                              ))}
                            </motion.select>
                          </div>

                          <motion.button
                            onClick={() => removeItem(item._id)}
                            className="text-sm font-light tracking-wide text-stone-500 hover:text-red-600 transition-colors duration-300 uppercase self-start sm:self-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Remove Item
                          </motion.button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right md:text-left md:w-24 flex-shrink-0">
                        <motion.p
                          className="text-lg font-light text-stone-900"
                          key={item.qty * item.price} // Re-animate when total changes
                          initial={{ scale: 1.1, color: "#059669" }}
                          animate={{ scale: 1, color: "#1c1917" }}
                          transition={{ duration: 0.3 }}
                        >
                          ₦{(item.price * item.qty).toLocaleString()}
                        </motion.p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="bg-white border border-stone-200 p-8 sticky top-24">
              <h3 className="text-xl font-light tracking-wide text-stone-900 mb-6 uppercase">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-stone-100">
                  <span className="text-stone-600 font-light">
                    Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'items'})
                  </span>
                  <span className="font-light text-stone-900">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-stone-100">
                  <span className="text-stone-600 font-light">Shipping</span>
                  <span className="font-light text-stone-900">Free</span>
                </div>
                
                <div className="flex justify-between items-center py-4 border-t border-stone-300">
                  <span className="text-lg font-light tracking-wide text-stone-900 uppercase">
                    Total
                  </span>
                  <motion.span
                    className="text-xl font-light text-stone-900"
                    key={total} // Re-animate when total changes
                    initial={{ scale: 1.1, color: "#059669" }}
                    animate={{ scale: 1, color: "#1c1917" }}
                    transition={{ duration: 0.3 }}
                  >
                    ₦{total.toLocaleString()}
                  </motion.span>
                </div>
              </div>

              {/* Checkout Button */}
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/checkout"
                  className="block w-full relative group overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-stone-900"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="relative block w-full py-4 px-6 border border-stone-900 text-stone-900 group-hover:text-white font-light tracking-[0.2em] text-sm text-center transition-colors duration-500 uppercase">
                    Proceed to Checkout
                  </span>
                </Link>
              </motion.div>

              {/* Continue Shopping Link */}
              <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Link
                  to="/home"
                  className="text-sm font-light tracking-wide text-stone-500 hover:text-stone-900 transition-colors duration-300 uppercase"
                >
                  Continue Shopping
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}