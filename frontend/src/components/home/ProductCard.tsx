import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Product } from '../../types'
import { imageUrlBuilder } from '@/actions/products.action'

interface ProductCardProps {
  product: Product
  index: number
  onAdd: (product: Product) => void
}

export default function ProductCard({ product, index, onAdd }: ProductCardProps) {
  const imageUrl = imageUrlBuilder(product.images[0]?.url) || '/placeholder.png'
  const [open, setOpen] = useState(false)
  const backdropRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const openModal = (e?: React.MouseEvent) => {
    e?.preventDefault()
    setOpen(true)
  }

  const closeModal = () => setOpen(false)

  const onBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) closeModal()
  }

  return (
    <motion.div
      className='group bg-white shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden'
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      layout
      whileHover={{ y: -10 }}
    >
      <div className='relative aspect-[4/5] overflow-hidden bg-stone-50'>
        <button
          onClick={openModal}
          aria-label={`View ${product.name}`}
          className='block h-full w-full text-left'
        >
          <img
            src={imageUrl}
            alt={product.name}
            className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
            loading='lazy'
          />
        </button>

        <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

        <div className='absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-black px-3 py-1 text-sm font-light'>
          ₦{product.price?.toLocaleString()}
        </div>
      </div>

      <div className='p-6'>
        <button onClick={openModal} className='text-left'>
          <h3 className='text-lg font-light tracking-wide mb-2 uppercase hover:text-stone-600 transition-colors'>
            {product.name}
          </h3>
        </button>

        <p className='text-stone-600 text-sm font-light leading-relaxed mb-4 line-clamp-2'>
          {product.description}
        </p>

        <div className='flex gap-3 pt-4 border-t border-stone-100'>
          <button
            onClick={() => onAdd(product)}
            className='flex-1 bg-black text-white py-3 px-4 text-sm font-light tracking-wide uppercase hover:bg-stone-800 transition-colors duration-300'
          >
            Add to Cart
          </button>
        </div>
      </div>
      {/* Modal */}
      {open && (
        <div
          ref={backdropRef}
          onClick={onBackdropClick}
          className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'
        >
          <div className='bg-white rounded-xl max-w-3xl w-full shadow-xl overflow-auto'>
            <div className='grid grid-cols-1 md:grid-cols-2'>
              <div className='p-4'>
                <img src={imageUrl} alt={product.name} className='w-full h-auto rounded-lg object-cover' />
              </div>
              <div className='p-6 flex flex-col'>
                <h2 className='text-2xl font-semibold mb-2'>{product.name}</h2>
                <div className='text-xl font-bold mb-4'>₦{product.price?.toLocaleString()}</div>
                <p className='text-stone-700 mb-6'>{product.description}</p>

                <div className='mt-auto flex gap-3'>
                  <button
                    onClick={() => {
                      onAdd(product)
                    }}
                    className='flex-1 bg-black text-white py-3 px-4 text-sm font-light tracking-wide uppercase hover:bg-stone-800 transition-colors duration-300'
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={closeModal}
                    className='px-4 py-3 border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors duration-200 rounded'
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
