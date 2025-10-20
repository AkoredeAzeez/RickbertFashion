import React from 'react'
import { CartItem } from '../../state/CartContext'

interface OrderSummaryProps {
  cartItems: CartItem[]
  total: number
}

export default function OrderSummary({ cartItems, total }: OrderSummaryProps) {
  return (
    <div className='bg-white border border-stone-200 p-8 sticky top-24'>
      <h3 className='text-xl font-light tracking-wide text-stone-900 mb-6 uppercase'>
        Order Summary
      </h3>

      <div className='space-y-4 mb-6'>
        <div className='flex justify-between items-center py-2 border-b border-stone-100'>
          <span className='text-stone-600 font-light'>
            Subtotal ({cartItems.length}{' '}
            {cartItems.length === 1 ? 'item' : 'items'})
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
          <span className='text-xl font-light text-stone-900'>
            ₦{total.toLocaleString()}
          </span>
        </div>
      </div>

      <div className='text-xs text-stone-500 font-light leading-relaxed'>
        <p className='mb-2'>• Secure payment powered by Paystack</p>
        <p className='mb-2'>• Free shipping within Lagos</p>
        <p>• 7-day return policy</p>
      </div>
    </div>
  )
}
