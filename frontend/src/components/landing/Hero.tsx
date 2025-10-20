import React from 'react'
import { motion, useInView } from 'framer-motion'

export default function Hero({
  heroRef,
  heroSlides,
  currentSlide,
  isInView,
  yBg,
  yText,
  scale,
  mousePosition,
  setCurrentSlide,
  logo
}) {
  return (
    <motion.section ref={heroRef} className="h-screen relative overflow-hidden" style={{ scale }}>
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

      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
        <motion.div
          className="absolute inset-0"
          style={{ background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1), transparent 40%)` }}
        />
      </div>

      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute ${i % 3 === 0 ? 'w-2 h-2' : i % 3 === 1 ? 'w-1 h-8' : 'w-8 h-1'} bg-white/20`}
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            rotate: Math.random() * 360
          }}
          animate={{ y: [null, -50, null], rotate: [null, 180, null], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 8 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 4 }}
        />
      ))}

      <motion.div className="relative h-full flex flex-col items-center justify-center text-center px-4" style={{ y: yText }}>
        <motion.div
          className="mb-12 relative"
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={isInView ? { scale: 1, rotate: 0, opacity: 1 } : {}}
          transition={{ duration: 2, type: 'spring', stiffness: 100, delay: 0.5 }}
        >
          <motion.div className="absolute inset-0 rounded-full border border-white/30" animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity }} style={{ padding: '20px' }} />
          <motion.div className="absolute inset-0 rounded-full border border-white/20" animate={{ scale: [1.2, 1.4, 1.2], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }} style={{ padding: '30px' }} />
          <img src={logo} alt="Rickbert Fashion" className="w-24 h-24 md:w-32 md:h-32 rounded-full relative z-10 shadow-2xl" />
        </motion.div>

        <motion.div className="mb-8 max-w-6xl">
          <motion.h1 className="text-5xl md:text-8xl lg:text-9xl font-thin tracking-wider mb-4" initial={{ opacity: 0, y: 100 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.5, delay: 1 }} style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", textShadow: '0 0 30px rgba(255,255,255,0.3)' }}>
            {heroSlides[currentSlide].title.split("").map((letter, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 + i * 0.1 }} className="inline-block">
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
          </motion.h1>

          <motion.div className="h-1 w-32 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-6" initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}} transition={{ duration: 2, delay: 2.5 }} />

          <motion.p className="text-xl md:text-2xl font-light tracking-widest opacity-80" initial={{ opacity: 0 }} animate={isInView ? { opacity: 0.8 } : {}} transition={{ duration: 1, delay: 3 }}>
            {heroSlides[currentSlide].subtitle}
          </motion.p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 3.5 }} className="relative group">
          <motion.div className="absolute inset-0 bg-white rounded-none" initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: 0.6 }} />
          <motion.a href="/home" className="relative block px-12 py-6 border border-white text-white hover:text-black font-light tracking-[0.3em] text-sm transition-colors duration-600 uppercase overflow-hidden" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <motion.span className="flex items-center gap-4" whileHover={{ x: 5 }} transition={{ duration: 0.3 }}>
              Enter Collection
              <motion.span animate={{ x: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>→</motion.span>
            </motion.span>
          </motion.a>
        </motion.div>

        <motion.div className="absolute bottom-12 flex space-x-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4 }}>
          {heroSlides.map((_, index) => (
            <button key={index} onClick={() => setCurrentSlide(index)} className={`w-12 h-0.5 transition-all duration-500 ${currentSlide === index ? 'bg-white' : 'bg-white/30'}`} />
          ))}
        </motion.div>
      </motion.div>

      <motion.div className="absolute bottom-8 left-1/2 transform -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <div className="w-0.5 h-16 bg-gradient-to-b from-white to-transparent" />
      </motion.div>
    </motion.section>
  )
}
