import React from 'react'
import { motion } from 'framer-motion'

export default function OrderSummary({ cartLength, total }) {
  return (
    <motion.div
      className='lg:col-span-1'
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <div className='bg-white border border-stone-200 p-8 sticky top-24'>
        <h3 className='text-xl font-light tracking-wide text-stone-900 mb-6 uppercase'>
          Order Summary
        </h3>

        <div className='space-y-4 mb-6'>
          <div className='flex justify-between items-center py-2 border-b border-stone-100'>
            <span className='text-stone-600 font-light'>
              Subtotal ({cartLength} {cartLength === 1 ? 'item' : 'items'})
            </span>
            <span className='font-light text-stone-900'>
              ₦{total.toLocaleString()}
            </span>
          </div>

          <div className='flex justify-between items-center py-2 border-b border-stone-100'>
            <span className='text-stone-600 font-light'>Shipping</span>
            <span className='font-light text-stone-900'>Free</span>
          </div>

          <div className='flex justify-between items-center py-4 border-t border-stone-300'>
            <span className='text-lg font-light tracking-wide text-stone-900 uppercase'>
              Total
            </span>
            <motion.span
              className='text-xl font-light text-stone-900'
              key={total}
              initial={{ scale: 1.1, color: '#059669' }}
              animate={{ scale: 1, color: '#1c1917' }}
              transition={{ duration: 0.3 }}
            >
              ₦{total.toLocaleString()}
            </motion.span>
          </div>
        </div>

        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
          <a
            href='/checkout'
            className='block w-full relative group overflow-hidden'
          >
            <motion.div
              className='absolute inset-0 bg-stone-900'
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.5 }}
            />
            <span className='relative block w-full py-4 px-6 border border-stone-900 text-stone-900 group-hover:text-white font-light tracking-[0.2em] text-sm text-center transition-colors duration-500 uppercase'>
              Proceed to Checkout
            </span>
          </a>
        </motion.div>

        <motion.div
          className='mt-4 text-center'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <a
            href='/home'
            className='text-sm font-light tracking-wide text-stone-500 hover:text-stone-900 transition-colors duration-300 uppercase'
          >
            Continue Shopping
          </a>
        </motion.div>
      </div>
    </motion.div>
  )
}

// prop types removed to avoid extra dependency in this repo
