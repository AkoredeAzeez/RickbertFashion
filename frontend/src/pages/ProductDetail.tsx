import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fetchProduct } from '../actions/products.action'
import { useCart } from '../state/CartContext'
import { Product } from '../types'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const [p, setP] = useState<Product | null>(null)
  const { addItem } = useCart()

  useEffect(() => {
    if (id) {
      fetchProduct(id)
        .then((product) => {
          if (product) {
            setP(product)
          }
        })
        .catch(console.error)
    }
  }, [id])

  if (!p) return <div>Loading...</div>

  const imageUrl =
    p.attributes.images?.data?.[0]?.attributes.url || '/placeholder.png'

  return (
    <div className='grid md:grid-cols-2 gap-8'>
      <img
        src={imageUrl}
        alt={p.attributes.name}
        className='rounded-2xl w-full h-[480px] object-cover'
      />
      <div>
        <h1 className='text-2xl font-bold'>{p.attributes.name}</h1>
        <p className='text-gray-600 mt-2'>{p.attributes.description}</p>
        <div className='text-2xl font-bold mt-4'>
          ₦{p.attributes.price.toLocaleString()}
        </div>
        <button
          onClick={() => addItem(p, 1)}
          className='mt-6 px-5 py-3 rounded-xl bg-black text-white hover:opacity-90'
        >
          Add to cart
        </button>
      </div>
    </div>
  )
}
