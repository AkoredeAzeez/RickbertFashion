import React from 'react';
import { CheckoutFormData } from '../../actions/checkout.action';

interface PersonalInfoProps {
  formData: CheckoutFormData;
  errors: Partial<CheckoutFormData>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PersonalInfo({ formData, errors, handleChange }: PersonalInfoProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-light tracking-wide text-stone-900 mb-6 uppercase">Personal Information</h3>
      <div className="space-y-4">
        <div>
          <input
            type="text"
            name="name"
            placeholder="FULL NAME"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-4 border font-light tracking-wide placeholder-stone-400 focus:outline-none focus:border-stone-500 transition-colors duration-300 ${
              errors.name ? 'border-red-400' : 'border-stone-300'
            }`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1 font-light">{errors.name}</p>}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="EMAIL ADDRESS"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-4 border font-light tracking-wide placeholder-stone-400 focus:outline-none focus:border-stone-500 transition-colors duration-300 ${
              errors.email ? 'border-red-400' : 'border-stone-300'
            }`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1 font-light">{errors.email}</p>}
        </div>

        <div>
          <input
            type="tel"
            name="phone"
            placeholder="PHONE NUMBER"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-4 border font-light tracking-wide placeholder-stone-400 focus:outline-none focus:border-stone-500 transition-colors duration-300 ${
              errors.phone ? 'border-red-400' : 'border-stone-300'
            }`}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1 font-light">{errors.phone}</p>}
        </div>
      </div>
    </div>
  );
}