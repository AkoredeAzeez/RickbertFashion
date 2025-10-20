import { motion } from 'framer-motion'

export default function EmptyCart() {
  return (
    <div className='min-h-screen bg-stone-50 flex items-center justify-center px-4'>
      <motion.div
        className='text-center max-w-md mx-auto'
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className='w-32 h-32 mx-auto mb-8 relative'
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className='w-full h-full border-2 border-stone-300 rounded-full flex items-center justify-center'>
            <motion.div
              className='w-16 h-16 border border-stone-400 rounded-lg relative'
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className='absolute inset-2 border-t border-stone-400 rounded-sm opacity-50' />
              <div className='absolute bottom-2 left-2 right-2 h-px bg-stone-400 opacity-30' />
            </motion.div>
          </div>
        </motion.div>

        <motion.h2
          className='text-2xl md:text-3xl font-light tracking-wide text-stone-900 mb-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          YOUR CART IS EMPTY
        </motion.h2>

        <motion.p
          className='text-stone-600 font-light mb-8 leading-relaxed'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          Discover our curated collection of timeless pieces
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <a href='/home' className='inline-block relative group'>
            <motion.div
              className='absolute inset-0 bg-stone-900'
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.5 }}
            />
            <span className='relative block px-8 py-4 border border-stone-900 text-stone-900 group-hover:text-white font-light tracking-[0.2em] text-sm transition-colors duration-500 uppercase'>
              Continue Shopping
            </span>
          </a>
        </motion.div>
      </motion.div>
    </div>
  )
}
