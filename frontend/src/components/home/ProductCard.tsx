import { motion } from 'framer-motion'
import { Product } from '../../types'

interface ProductCardProps {
  product: Product
  index: number
  onAdd: (product: Product) => void
  onDelete: (id: number) => void
}

export default function ProductCard({
  product,
  index,
  onAdd,
  onDelete,
}: ProductCardProps) {
  const imageUrl =
    product.attributes.images?.data?.[0]?.attributes.url || '/placeholder.png'

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
        <a href={`/product/${product.id}`} className='block h-full'>
          <img
            src={imageUrl}
            alt={product.attributes.name}
            className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
            loading='lazy'
          />
        </a>

        <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

        <div className='absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-black px-3 py-1 text-sm font-light'>
          ₦{product.attributes.price?.toLocaleString()}
        </div>
      </div>

      <div className='p-6'>
        <a href={`/product/${product.id}`}>
          <h3 className='text-lg font-light tracking-wide mb-2 uppercase hover:text-stone-600 transition-colors'>
            {product.attributes.name}
          </h3>
        </a>

        <p className='text-stone-600 text-sm font-light leading-relaxed mb-4 line-clamp-2'>
          {product.attributes.description}
        </p>

        <div className='flex gap-3 pt-4 border-t border-stone-100'>
          <button
            onClick={() => onAdd(product)}
            className='flex-1 bg-black text-white py-3 px-4 text-sm font-light tracking-wide uppercase hover:bg-stone-800 transition-colors duration-300'
          >
            Add to Cart
          </button>

          <button
            onClick={() => onDelete(product.id)}
            className='px-4 py-3 border border-red-200 text-red-600 hover:bg-red-50 transition-colors duration-300 text-sm'
            title='Delete Product'
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  )
}
