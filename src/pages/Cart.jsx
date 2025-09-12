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
            <Link to="/home" className="inline-block relative group">
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
    <div className="space-y-6">
      {cart.map((i) => (
        <div key={i._id} className="bg-white p-4 rounded-xl shadow flex gap-4 items-center">
          <img src={i.images?.[0]} className="w-24 h-24 rounded object-cover" />
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
                    Subtotal ({cart.length} {cart.length === 1 ? "item" : "items"})
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
                    key={total}
                    initial={{ scale: 1.1, color: "#059669" }}
                    animate={{ scale: 1, color: "#1c1917" }}
                    transition={{ duration: 0.3 }}
                  >
                    ₦{total.toLocaleString()}
                  </motion.span>
                </div>
              </div>

              {/* Checkout Button */}
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
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
