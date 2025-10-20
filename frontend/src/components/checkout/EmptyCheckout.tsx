import React from 'react'
import { motion } from 'framer-motion'

export default function EmptyCheckout({ onContinue }) {
  return (
    <div className='min-h-screen bg-stone-50 flex items-center justify-center px-4'>
      <motion.div
        className='text-center max-w-md mx-auto'
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className='text-2xl font-light tracking-wide text-stone-900 mb-4'>
          NO ITEMS TO CHECKOUT
        </h2>
        <p className='text-stone-600 font-light mb-8'>
          Your cart is empty. Please add items before proceeding to checkout.
        </p>
        <button
          onClick={onContinue}
          className='inline-block px-8 py-4 border border-stone-900 text-stone-900 font-light tracking-[0.2em] text-sm hover:bg-stone-900 hover:text-white transition-all duration-500 uppercase'
        >
          Continue Shopping
        </button>
      </motion.div>
    </div>
  )
}
