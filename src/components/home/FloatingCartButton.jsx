import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function FloatingCartButton() {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <Link to="/cart">
        <motion.div className="relative bg-black text-white p-4 rounded-full shadow-2xl hover:bg-stone-800 transition-colors duration-300 group" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
          <motion.div className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />

          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black text-white text-sm font-light tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            View Cart
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black" />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
