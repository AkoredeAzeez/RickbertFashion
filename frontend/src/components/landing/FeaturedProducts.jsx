import React from 'react'
import { motion } from 'framer-motion'

export default function FeaturedProducts({ loading, products }) {
  return (
    <section className="py-32 bg-white text-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(0,0,0,0.02)_0%,transparent_50%)]" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }} viewport={{ once: true }}>
          <motion.h2 className="text-4xl md:text-6xl font-thin tracking-wider mb-8" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>FEATURED PIECES</motion.h2>
          <motion.div className="w-32 h-0.5 bg-black mx-auto" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 1.5, delay: 0.5 }} viewport={{ once: true }} />
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <motion.div className="w-16 h-16 border-2 border-black border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
          </div>
        ) : (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1.5, staggerChildren: 0.2 }} viewport={{ once: true }}>
            {products.slice(0, 3).map((product, index) => (
              <motion.div key={product._id} className="group relative" initial={{ opacity: 0, y: 80 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: index * 0.15 }} viewport={{ once: true }} whileHover={{ y: -15 }}>
                <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden mb-6 md:mb-8 bg-stone-50 shadow-lg">
                  <motion.img src={product.images?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=800&fit=crop'} alt={product.name} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" loading="lazy" />
                  <motion.div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 md:from-black/50" />
                  <motion.div className="absolute top-4 md:top-6 right-4 md:right-6 bg-white/95 backdrop-blur-sm text-black px-3 py-2 md:px-4 text-xs md:text-sm font-light tracking-wide opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 shadow-sm" initial={{ x: 20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 + index * 0.1 }}>
                    ₦{product.price?.toLocaleString() || '0'}
                  </motion.div>
                  <motion.div className="absolute bottom-4 left-4 right-4 md:hidden" initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 + index * 0.1 }}>
                    <button className="w-full bg-white/90 backdrop-blur-sm text-black py-3 text-sm font-light tracking-wide uppercase transition-all duration-300 hover:bg-white">Quick View</button>
                  </motion.div>
                  <motion.div className="hidden md:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="space-y-4">
                      <button className="block w-full bg-white text-black px-8 py-3 text-sm font-light tracking-wide uppercase transition-all duration-300 hover:bg-black hover:text-white">View Details</button>
                      <button className="block w-full border border-white text-white px-8 py-3 text-sm font-light tracking-wide uppercase transition-all duration-300 hover:bg-white hover:text-black">Add to Cart</button>
                    </div>
                  </motion.div>
                </div>

                <motion.div className="text-center px-2 md:px-0">
                  <motion.h3 className="text-base md:text-lg font-light tracking-[0.15em] md:tracking-[0.2em] mb-2 md:mb-3 uppercase" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.7 + index * 0.1 }} viewport={{ once: true }}>{product.name}</motion.h3>
                  <motion.div className="w-8 md:w-12 h-0.5 bg-black mx-auto opacity-30 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />
                  <motion.p className="md:hidden text-stone-600 text-sm font-light mt-2" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.8 + index * 0.1 }}>₦{product.price?.toLocaleString() || '0'}</motion.p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div className="text-center mt-24" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1 }} viewport={{ once: true }}>
          <motion.a href="/home" className="inline-block relative group" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <motion.div className="absolute inset-0 bg-black" initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: 0.5 }} />
            <span className="relative block px-12 py-5 border border-black text-black group-hover:text-white font-light tracking-[0.3em] text-sm transition-colors duration-500 uppercase">View Full Collection</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
