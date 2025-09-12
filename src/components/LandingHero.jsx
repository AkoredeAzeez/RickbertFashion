import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function LandingHero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      {/* subtle animated gradient layer */}
      <motion.div
        className="absolute inset-0"
        style={{ zIndex: 0 }}
        animate={{ opacity: [0.9, 0.7, 0.9] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <div
          className="w-full h-full"
          style={{
            background:
              "radial-gradient(circle at 15% 25%, rgba(124,58,237,0.2), transparent 15%), radial-gradient(circle at 80% 60%, rgba(236,72,153,0.12), transparent 25%)",
          }}
        />
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="inline-block p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-3xl">👑</div>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
              RICKBERT<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">FASHION</span>
            </h1>

            <p className="text-gray-300 max-w-xl">
              Where luxury meets innovation. Discover elevated silhouettes and bold textures — crafted for the modern statement.
            </p>

            <div className="flex gap-4">
              <Link to="/shop" className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold shadow-lg">
                Shop Collection
              </Link>
              <Link to="/about" className="px-6 py-3 rounded-full border border-white/20 text-white/90">
                Learn More
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9 }}
            className="flex items-center justify-center"
          >
            {/* Replace this img with your hero asset */}
            <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
              <img src="/hero-sample.jpg" alt="Hero" className="w-full h-96 object-cover" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
