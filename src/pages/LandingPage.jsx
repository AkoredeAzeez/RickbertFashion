import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import logo from "../assets/rf.jpg";

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen h-screen w-screen fixed inset-0 flex flex-col items-center justify-center text-white overflow-hidden">
      {/* Dynamic Animated Background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgb(17, 24, 39) 0%, rgb(0, 0, 0) 50%, rgb(31, 41, 55) 100%)',
            'radial-gradient(circle at 80% 20%, rgb(31, 41, 55) 0%, rgb(0, 0, 0) 50%, rgb(55, 65, 81) 100%)',
            'radial-gradient(circle at 40% 70%, rgb(55, 65, 81) 0%, rgb(0, 0, 0) 50%, rgb(17, 24, 39) 100%)',
            'radial-gradient(circle at 20% 50%, rgb(17, 24, 39) 0%, rgb(0, 0, 0) 50%, rgb(31, 41, 55) 100%)'
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Mouse-responsive overlay */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(251, 191, 36, 0.15), transparent 40%)`
        }}
      />

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-40"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
          }}
          animate={{
            y: [null, -20, null],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Enhanced Background Motion with your original logo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 3 }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${logo})`, 
          filter: "blur(12px) brightness(0.3)",
          transform: "scale(1.2)"
        }}
      />

      {/* Company Logo - Enhanced */}
      <motion.div
        className="relative z-10 mb-6"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          duration: 1.2, 
          type: "spring", 
          stiffness: 100,
          delay: 0.2
        }}
        whileHover={{ 
          scale: 1.1, 
          rotate: 5,
          transition: { duration: 0.3 }
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 blur-lg opacity-50"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <img
          src={logo}
          alt="Company Logo"
          className="w-32 h-32 rounded-full border-4 border-white shadow-2xl relative z-10"
        />
      </motion.div>

      {/* Enhanced Title */}
      <motion.h1
        className="text-5xl md:text-7xl font-black text-center z-10 mb-4"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          duration: 1.2, 
          delay: 0.8,
          type: "spring",
          stiffness: 80
        }}
        style={{
          background: 'linear-gradient(45deg, #ffffff, #fbbf24, #f59e0b, #ffffff)',
          backgroundSize: '400% 400%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        <motion.div
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            background: 'linear-gradient(45deg, #ffffff, #fbbf24, #f59e0b, #ffffff)',
            backgroundSize: '400% 400%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Welcome to <span className="block md:inline">Rickbert Fashion</span>
        </motion.div>
      </motion.h1>

      {/* Enhanced Subtitle */}
      <motion.p
        className="text-xl md:text-2xl text-gray-300 max-w-2xl text-center z-10 mb-8 leading-relaxed font-light"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        Discover <span className="text-yellow-400 font-semibold">timeless designs</span>, 
        <span className="text-yellow-400 font-semibold"> modern trends</span>, and 
        <span className="text-yellow-400 font-semibold"> styles that inspire</span>
      </motion.p>

      {/* Your Original CTA Button - Enhanced */}
      <motion.div
        className="z-10"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.8, 
          delay: 1.8,
          type: "spring",
          stiffness: 150
        }}
      >
        <motion.div
          whileHover={{ 
            scale: 1.05,
            y: -2
          }}
          whileTap={{ scale: 0.95 }}
          className="relative group"
        >
          {/* Glowing background effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-50 group-hover:opacity-75"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          <a
            href="/home" // keeping your original routing
            className="relative block px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold text-lg rounded-full shadow-2xl transition-all duration-300 transform hover:shadow-yellow-500/25"
          >
            <motion.span
              className="flex items-center gap-2"
              whileHover={{ x: 2 }}
            >
              Shop Now
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.span>
          </a>
        </motion.div>
      </motion.div>

      {/* Subtle scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute bottom-8 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
        >
          <motion.div className="w-1 h-3 bg-yellow-400 rounded-full mt-2" />
        </motion.div>
      </motion.div>
    </div>
  );
}