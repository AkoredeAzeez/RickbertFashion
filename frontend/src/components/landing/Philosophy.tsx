import React from 'react'
import { motion } from 'framer-motion'

export default function Philosophy() {
  return (
    <section className='py-32 bg-black text-white relative overflow-hidden'>
      <motion.div
        className='absolute inset-0'
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.03) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 30%, rgba(255,255,255,0.03) 0%, transparent 50%)',
            'radial-gradient(circle at 40% 80%, rgba(255,255,255,0.03) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.03) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className='max-w-5xl mx-auto px-6 text-center relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
        >
          <motion.h3
            className='text-3xl md:text-5xl font-thin leading-relaxed mb-12 tracking-wide'
            style={{
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            }}
          >
            "We don't just create fashion—
            <br />
            <span className='italic text-white/80'>
              we architect dreams into wearable art."
            </span>
          </motion.h3>

          <motion.div
            className='w-24 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-8'
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            viewport={{ once: true }}
          />

          <motion.p
            className='text-white/60 font-light tracking-[0.3em] text-sm uppercase'
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
  )
}
