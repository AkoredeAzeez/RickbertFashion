import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NavBar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full z-50"
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 flex items-center justify-center text-white font-black">
            RF
          </div>
          <span className="text-lg font-semibold tracking-wide">RICKBERT FASHION</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/shop" className="hover:text-purple-500">Shop</Link>
          <div className="group relative">
            <button className="hover:text-purple-500">Collections</button>
            {/* dropdown example (optional) */}
            <div className="absolute left-0 mt-2 w-48 bg-white shadow-md rounded hidden group-hover:block">
              <Link className="block px-4 py-2 text-sm" to="/collections/street">Street Culture</Link>
              <Link className="block px-4 py-2 text-sm" to="/collections/roots">Roots</Link>
            </div>
          </div>
          <Link to="/about" className="hover:text-purple-500">About</Link>
          <Link to="/upload" className="hover:text-purple-500">Upload</Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <Link to="/cart" className="px-3 py-2 rounded-full bg-black text-white text-sm">Cart</Link>
          <button className="md:hidden text-lg">☰</button>
        </div>
      </div>
    </motion.nav>
  );
}
