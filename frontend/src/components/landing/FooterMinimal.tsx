import React from 'react'
import { motion } from 'framer-motion'

export default function FooterMinimal() {
  return (
    <footer className='py-16 bg-white border-t border-gray-100'>
      <div className='max-w-7xl mx-auto px-6 text-center'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <p className='text-black font-light tracking-[0.3em] text-sm uppercase mb-6'>
            Rickbert Fashion
          </p>
          <motion.div
            className='w-16 h-0.5 bg-black mx-auto'
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true }}
          />
        </motion.div>
      </div>
    </footer>
  )
}
