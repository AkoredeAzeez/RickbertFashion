import React from 'react'
import { CartItem } from '../../state/CartContext'

interface ReviewOrderProps {
  cartItems: CartItem[]
}

export default function ReviewOrder({ cartItems }: ReviewOrderProps) {
  return (
    <div className='space-y-6'>
      <h3 className='text-xl font-light tracking-wide text-stone-900 mb-6 uppercase'>
        Review Order
      </h3>
      <div className='space-y-4'>
        {cartItems.map((item) => (
          <div
            key={item.id}
            className='flex justify-between items-center py-3 border-b border-stone-100'
          >
            <div>
              <p className='font-light text-stone-900 uppercase tracking-wide'>
                {item.attributes.name} × {item.qty}
              </p>
            </div>
            <p className='font-light text-stone-900'>
              ₦{(item.attributes.price * item.qty).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
