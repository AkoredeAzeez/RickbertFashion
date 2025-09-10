// src/pages/LandingPage.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "../assets/dk.jpg"; // ✅ replace with your company logo

export default function LandingPage() {
  return (
    <div className="h-screen w-full bg-gradient-to-r from-gray-900 via-black to-gray-800 flex flex-col items-center justify-center text-white overflow-hidden relative">
      {/* Background Motion */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${logo})`, filter: "blur(8px)" }}
      />

      {/* Company Logo */}
      <motion.img
        src={logo}
        alt="Company Logo"
        className="w-32 h-32 rounded-full border-4 border-white shadow-lg z-10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, type: "spring", stiffness: 100 }}
      />

      {/* Title */}
      <motion.h1
        className="text-4xl md:text-6xl font-bold mt-6 z-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Welcome to <span className="text-yellow-400">Rickbert Fashion</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="mt-4 text-lg text-gray-300 max-w-md text-center z-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        Discover timeless designs, modern trends, and styles that inspire.
      </motion.p>

      {/* CTA Button */}
      <motion.div
        className="mt-8 z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <Link
          to="/home"
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-full shadow-lg transition"
        >
          Shop Now
        </Link>
      </motion.div>
    </div>
  );
}
