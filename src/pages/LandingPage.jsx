import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import logo from "../assets/rf.jpg";
import { fetchProducts } from "../lib/api";

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const isInView = useInView(heroRef, { once: true });

  // Advanced parallax effects
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetchProducts();
        let productArray = [];
        if (Array.isArray(res)) {
          productArray = res;
        } else if (res && Array.isArray(res.products)) {
          productArray = res.products;
        }
        setProducts(productArray);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load products:", error);
        setProducts([]);
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Auto-rotating hero slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const heroSlides = [
    {
      title: "LUXURY",
      subtitle: "Artistry meets fashion",
      gradient: "from-black via-stone-900 to-stone-800"
    },
    {
      title: "ELEGANCE",
      subtitle: "Crafted with precision",
      gradient: "from-stone-900 via-stone-800 to-stone-700"
    },
    {
      title: "COUTURE",
      subtitle: "Innovation in every detail",
      gradient: "from-stone-800 via-stone-700 to-stone-600"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Dynamic cursor effect */}
      <motion.div
        className="fixed w-4 h-4 bg-white rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Advanced hero section with full-screen experience */}
      <motion.section 
        ref={heroRef}
        className="h-screen relative overflow-hidden"
        style={{ scale }}
      >
        {/* Dynamic background gradient */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${heroSlides[currentSlide].gradient}`}
          style={{ y: yBg }}
          animate={{
            background: [
              `linear-gradient(135deg, #000000 0%, #1c1917 50%, #292524 100%)`,
              `linear-gradient(135deg, #1c1917 0%, #292524 50%, #44403c 100%)`,
              `linear-gradient(135deg, #292524 0%, #44403c 50%, #57534e 100%)`,
              `linear-gradient(135deg, #000000 0%, #1c1917 50%, #292524 100%)`
            ]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        {/* Animated mesh gradient overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1), transparent 40%)`
            }}
          />
        </div>

        {/* Floating geometric elements */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute ${i % 3 === 0 ? 'w-2 h-2' : i % 3 === 1 ? 'w-1 h-8' : 'w-8 h-1'} bg-white/20`}
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
              rotate: Math.random() * 360,
            }}
            animate={{
              y: [null, -50, null],
              rotate: [null, 180, null],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}

        <motion.div 
          className="relative h-full flex flex-col items-center justify-center text-center px-4"
          style={{ y: yText }}
        >
          {/* Logo with advanced animation */}
          <motion.div
            className="mb-12 relative"
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={isInView ? { scale: 1, rotate: 0, opacity: 1 } : {}}
            transition={{ 
              duration: 2, 
              type: "spring", 
              stiffness: 100,
              delay: 0.5
            }}
          >
            {/* Glowing ring around logo */}
            <motion.div
              className="absolute inset-0 rounded-full border border-white/30"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ padding: '20px' }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border border-white/20"
              animate={{
                scale: [1.2, 1.4, 1.2],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              style={{ padding: '30px' }}
            />
            <img
              src={logo}
              alt="Rickbert Fashion"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full relative z-10 shadow-2xl"
            />
          </motion.div>

          {/* Animated title with typewriter effect */}
          <motion.div className="mb-8 max-w-6xl">
            <motion.h1
              className="text-5xl md:text-8xl lg:text-9xl font-thin tracking-wider mb-4"
              initial={{ opacity: 0, y: 100 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.5, delay: 1 }}
              style={{ 
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                textShadow: '0 0 30px rgba(255,255,255,0.3)'
              }}
            >
              {heroSlides[currentSlide].title.split("").map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + i * 0.1 }}
                  className="inline-block"
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </motion.h1>
            
            <motion.div
              className="h-1 w-32 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-6"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 2, delay: 2.5 }}
            />

            <motion.p
              className="text-xl md:text-2xl font-light tracking-widest opacity-80"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.8 } : {}}
              transition={{ duration: 1, delay: 3 }}
            >
              {heroSlides[currentSlide].subtitle}
            </motion.p>
          </motion.div>

          {/* Revolutionary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 3.5 }}
            className="relative group"
          >
            <motion.div
              className="absolute inset-0 bg-white rounded-none"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.6 }}
            />
            <motion.a
              href="/home"
              className="relative block px-12 py-6 border border-white text-white hover:text-black font-light tracking-[0.3em] text-sm transition-colors duration-600 uppercase overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="flex items-center gap-4"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
              >
                Enter Collection
                <motion.span
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  →
                </motion.span>
              </motion.span>
            </motion.a>
          </motion.div>

          {/* Slide indicators */}
          <motion.div 
            className="absolute bottom-12 flex space-x-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4 }}
          >
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-12 h-0.5 transition-all duration-500 ${
                  currentSlide === index ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-0.5 h-16 bg-gradient-to-b from-white to-transparent" />
        </motion.div>
      </motion.section>

      {/* Revolutionary featured products section */}
      <section className="py-32 bg-white text-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(0,0,0,0.02)_0%,transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-4xl md:text-6xl font-thin tracking-wider mb-8"
              style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
            >
              FEATURED PIECES
            </motion.h2>
            <motion.div
              className="w-32 h-0.5 bg-black mx-auto"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              viewport={{ once: true }}
            />
          </motion.div>

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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.5, staggerChildren: 0.2 }}
              viewport={{ once: true }}
            >
              {products.slice(0, 3).map((product, index) => (
                <motion.div
                  key={product._id}
                  className="group relative"
                  initial={{ opacity: 0, y: 80 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -15 }}
                >
                  {/* Product image with advanced hover effects */}
                  <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden mb-6 md:mb-8 bg-stone-50 shadow-lg">
                    <motion.img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=800&fit=crop'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Overlay gradient on hover - more subtle on mobile */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 md:from-black/50"
                    />
                    
                    {/* Interactive elements for desktop, always visible on mobile */}
                    <motion.div
                      className="absolute top-4 md:top-6 right-4 md:right-6 bg-white/95 backdrop-blur-sm text-black px-3 py-2 md:px-4 text-xs md:text-sm font-light tracking-wide opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 shadow-sm"
                      initial={{ x: 20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      ₦{product.price?.toLocaleString() || '0'}
                    </motion.div>

                    {/* Mobile-specific: Add to cart quick action */}
                    <motion.div
                      className="absolute bottom-4 left-4 right-4 md:hidden"
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <button className="w-full bg-white/90 backdrop-blur-sm text-black py-3 text-sm font-light tracking-wide uppercase transition-all duration-300 hover:bg-white">
                        Quick View
                      </button>
                    </motion.div>

                    {/* Desktop hover overlay with actions */}
                    <motion.div
                      className="hidden md:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    >
                      <div className="space-y-4">
                        <button className="block w-full bg-white text-black px-8 py-3 text-sm font-light tracking-wide uppercase transition-all duration-300 hover:bg-black hover:text-white">
                          View Details
                        </button>
                        <button className="block w-full border border-white text-white px-8 py-3 text-sm font-light tracking-wide uppercase transition-all duration-300 hover:bg-white hover:text-black">
                          Add to Cart
                        </button>
                      </div>
                    </motion.div>
                  </div>

                  {/* Product details - enhanced spacing and typography */}
                  <motion.div className="text-center px-2 md:px-0">
                    <motion.h3
                      className="text-base md:text-lg font-light tracking-[0.15em] md:tracking-[0.2em] mb-2 md:mb-3 uppercase"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {product.name}
                    </motion.h3>
                    
                    {/* Decorative line - more prominent on desktop */}
                    <motion.div
                      className="w-8 md:w-12 h-0.5 bg-black mx-auto opacity-30 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500"
                    />

                    {/* Mobile price display (since it's also in overlay) */}
                    <motion.p
                      className="md:hidden text-stone-600 text-sm font-light mt-2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      ₦{product.price?.toLocaleString() || '0'}
                    </motion.p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Enhanced CTA */}
          <motion.div
            className="text-center mt-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            viewport={{ once: true }}
          >
            <motion.a
              href="/home"
              className="inline-block relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-black"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
              />
              <span className="relative block px-12 py-5 border border-black text-black group-hover:text-white font-light tracking-[0.3em] text-sm transition-colors duration-500 uppercase">
                View Full Collection
              </span>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Revolutionary brand philosophy section */}
      <section className="py-32 bg-black text-white relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.03) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 30%, rgba(255,255,255,0.03) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 80%, rgba(255,255,255,0.03) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.03) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true }}
          >
            <motion.h3
              className="text-3xl md:text-5xl font-thin leading-relaxed mb-12 tracking-wide"
              style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
            >
              "We don't just create fashion—
              <br />
              <span className="italic text-white/80">we architect dreams into wearable art."</span>
            </motion.h3>
            
            <motion.div
              className="w-24 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-8"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
              viewport={{ once: true }}
            />
            
            <motion.p
              className="text-white/60 font-light tracking-[0.3em] text-sm uppercase"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.6 }}
              transition={{ duration: 1, delay: 1 }}
              viewport={{ once: true }}
            >
              The Rickbert Manifesto
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Minimalist footer */}
      <footer className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-black font-light tracking-[0.3em] text-sm uppercase mb-6">
              Rickbert Fashion
            </p>
            <motion.div
              className="w-16 h-0.5 bg-black mx-auto"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.5 }}
              viewport={{ once: true }}
            />
          </motion.div>
        </div>
      </footer>
    </div>
  );
}