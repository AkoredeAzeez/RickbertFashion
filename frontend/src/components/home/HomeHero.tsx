import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { headerVariant } from '../../styles/animations'

export default function HomeHero() {
  return (
    <motion.section
      className='relative py-16 md:py-24 bg-black text-white overflow-hidden'
      initial='hidden'
      animate='show'
      variants={headerVariant}
    >
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]' />
      </div>

      <div className='max-w-7xl mx-auto px-6 relative z-10'>
        <div className='text-center'>
          <h1
            className='text-4xl md:text-6xl lg:text-7xl font-thin tracking-wider mb-6'
            style={{
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            }}
          >
            RICKBERT COLLECTION
          </h1>
          <div className='w-32 h-0.5 bg-white mx-auto mb-6' />
          <p className='text-lg md:text-xl font-light tracking-wide opacity-80 max-w-2xl mx-auto'>
            Discover timeless pieces crafted for the modern wardrobe
          </p>
        </div>
      </div>
    </motion.section>
  )
}
