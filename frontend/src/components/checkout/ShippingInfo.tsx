import React from 'react'
import { CheckoutFormData } from '../../actions/checkout.action'

interface ShippingInfoProps {
  formData: CheckoutFormData
  errors: Partial<CheckoutFormData>
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function ShippingInfo({
  formData,
  errors,
  handleChange,
}: ShippingInfoProps) {
  return (
    <div className='space-y-6'>
      <h3 className='text-xl font-light tracking-wide text-stone-900 mb-6 uppercase'>
        Shipping Information
      </h3>
      <div className='space-y-4'>
        <div>
          <input
            type='text'
            name='address'
            placeholder='DELIVERY ADDRESS'
            value={formData.address}
            onChange={handleChange}
            className={`w-full px-4 py-4 border font-light tracking-wide placeholder-stone-400 focus:outline-none focus:border-stone-500 transition-colors duration-300 ${
              errors.address ? 'border-red-400' : 'border-stone-300'
            }`}
          />
          {errors.address && (
            <p className='text-red-500 text-xs mt-1 font-light'>
              {errors.address}
            </p>
          )}
        </div>

        <div className='grid md:grid-cols-2 gap-4'>
          <div>
            <input
              type='text'
              name='city'
              placeholder='CITY'
              value={formData.city}
              onChange={handleChange}
              className={`w-full px-4 py-4 border font-light tracking-wide placeholder-stone-400 focus:outline-none focus:border-stone-500 transition-colors duration-300 ${
                errors.city ? 'border-red-400' : 'border-stone-300'
              }`}
            />
            {errors.city && (
              <p className='text-red-500 text-xs mt-1 font-light'>
                {errors.city}
              </p>
            )}
          </div>

          <div>
            <input
              type='text'
              name='state'
              placeholder='STATE'
              value={formData.state}
              onChange={handleChange}
              className={`w-full px-4 py-4 border font-light tracking-wide placeholder-stone-400 focus:outline-none focus:border-stone-500 transition-colors duration-300 ${
                errors.state ? 'border-red-400' : 'border-stone-300'
              }`}
            />
            {errors.state && (
              <p className='text-red-500 text-xs mt-1 font-light'>
                {errors.state}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
