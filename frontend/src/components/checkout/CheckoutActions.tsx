import { motion } from 'framer-motion'
import { hoverTap, spinnerVariant } from '../../styles/animations'

interface CheckoutActionsProps {
  currentStep: number
  handlePrevStep: () => void
  handleNextStep: () => void
  handleCheckout: () => void
  isLoading: boolean
}

export default function CheckoutActions({
  currentStep,
  handlePrevStep,
  handleNextStep,
  handleCheckout,
  isLoading,
}: CheckoutActionsProps) {
  return (
    <div className='flex justify-between mt-8 pt-8 border-t border-stone-200'>
      <motion.button
        onClick={handlePrevStep}
        className={`px-6 py-3 font-light tracking-wide text-sm uppercase transition-all duration-300 ${
          currentStep === 1
            ? 'text-stone-400 cursor-not-allowed'
            : 'text-stone-600 hover:text-stone-900'
        }`}
        disabled={currentStep === 1}
        {...(currentStep > 1 ? hoverTap : {})}
      >
        Previous
      </motion.button>

      {currentStep < 3 ? (
        <motion.button
          onClick={handleNextStep}
          className='px-8 py-3 border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white font-light tracking-wide text-sm uppercase transition-all duration-500'
          {...hoverTap}
        >
          Continue
        </motion.button>
      ) : (
        <motion.button
          onClick={handleCheckout}
          disabled={isLoading}
          className='px-8 py-3 border border-stone-900 bg-stone-900 text-white hover:bg-stone-800 font-light tracking-wide text-sm uppercase transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed'
          {...(!isLoading ? hoverTap : {})}
        >
          {isLoading ? (
            <span className='flex items-center gap-2'>
              <motion.div
                variants={spinnerVariant}
                animate='animate'
                className='w-4 h-4 border border-white border-t-transparent rounded-full'
              />
              Processing...
            </span>
          ) : (
            'Pay with Paystack'
          )}
        </motion.button>
      )}
    </div>
  )
}
