import { motion } from 'framer-motion'

export default function ProgressStepper({
  steps,
  currentStep,
}: {
  steps: { number: number; title: string }[]
  currentStep: number
}) {
  return (
    <div className='flex justify-center mb-12'>
      <div className='flex items-center space-x-8'>
        {steps.map((step, index) => (
          <div key={step.number} className='flex items-center'>
            <div className='flex flex-col items-center'>
              <motion.div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-light transition-all duration-500 ${
                  currentStep >= step.number
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : 'border-stone-300 text-stone-400'
                }`}
                whileHover={{ scale: 1.1 }}
              >
                {step.number}
              </motion.div>
              <div className='text-center mt-2'>
                <p
                  className={`text-xs font-light tracking-wide uppercase ${
                    currentStep >= step.number
                      ? 'text-stone-900'
                      : 'text-stone-400'
                  }`}
                >
                  {step.title}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-4 transition-all duration-500 ${
                  currentStep > step.number ? 'bg-stone-900' : 'bg-stone-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// prop-types removed to avoid an extra runtime dependency in dev server
