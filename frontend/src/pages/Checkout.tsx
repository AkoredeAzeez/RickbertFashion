import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ProgressStepper from '@/components/checkout/ProgressStepper'
import PersonalInfo from '@/components/checkout/PersonalInfo'
import ShippingInfo from '@/components/checkout/ShippingInfo'
import ReviewOrder from '@/components/checkout/ReviewOrder'
import EmptyCheckout from '@/components/checkout/EmptyCheckout'
import OrderSummary from '@/components/checkout/OrderSummary'
import CheckoutActions from '@/components/checkout/CheckoutActions'
import '@/styles/checkout.css'
import { fadeUp, cardVariant, headerVariant } from '@/styles/animations'
import { initiatePayment, CheckoutFormData } from '@/actions/checkout.action'
import { useCart } from '@/state/CartContext'

const Checkout = () => {
  const navigate = useNavigate()
  const { cart, total } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
  })
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof CheckoutFormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateStep = (step: number) => {
    const newErrors: Partial<CheckoutFormData> = {}

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Full name is required'
      if (!formData.email.trim()) newErrors.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = 'Email is invalid'
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    }

    if (step === 2) {
      if (!formData.address.trim()) newErrors.address = 'Address is required'
      if (!formData.city.trim()) newErrors.city = 'City is required'
      if (!formData.state.trim()) newErrors.state = 'State is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleCheckout = async () => {
    if (!cart.length || !validateStep(1) || !validateStep(2)) return

    setIsLoading(true)
    try {
      const checkoutCartItems = cart.map((item) => ({
        _id: String(item.id),
        name: item.attributes.name,
        price: item.attributes.price,
        images: item.attributes.images.data.map((img) => img.attributes.url),
        qty: item.qty,
        description: item.attributes.description,
      }))
      await initiatePayment(formData, checkoutCartItems, total)
    } catch (err) {
      console.error('Checkout error:', err)
      alert('Payment initiation failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [
    { number: 1, title: 'Personal Info', description: 'Your contact details' },
    { number: 2, title: 'Shipping', description: 'Delivery information' },
    { number: 3, title: 'Payment', description: 'Review and pay' },
  ]

  if (!cart.length)
    return <EmptyCheckout onContinue={() => navigate('/home')} />

  return (
    <div className='min-h-screen bg-stone-50 py-12 px-4'>
      <div className='max-w-4xl mx-auto'>
        <motion.div
          className='text-center mb-16'
          initial='hidden'
          animate='show'
          variants={headerVariant}
        >
          <h1 className='text-3xl md:text-4xl font-light tracking-wide text-stone-900 mb-4'>
            CHECKOUT
          </h1>
          <div className='w-20 h-0.5 bg-stone-400 mx-auto' />
        </motion.div>

        <motion.div
          className='flex justify-center mb-12'
          initial='hidden'
          animate='show'
          variants={fadeUp}
        >
          <ProgressStepper steps={steps} currentStep={currentStep} />
        </motion.div>

        <div className='grid lg:grid-cols-3 gap-12'>
          <div className='lg:col-span-2'>
            <motion.div
              className='bg-white border border-stone-200 p-8'
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <AnimatePresence mode='wait'>
                {currentStep === 1 && (
                  <motion.div
                    key='step1'
                    variants={cardVariant}
                    initial='hidden'
                    animate='show'
                    exit='exit'
                    className='space-y-6'
                  >
                    <PersonalInfo
                      formData={formData}
                      errors={errors}
                      handleChange={handleChange}
                    />
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key='step2'
                    variants={cardVariant}
                    initial='hidden'
                    animate='show'
                    exit='exit'
                    className='space-y-6'
                  >
                    <ShippingInfo
                      formData={formData}
                      errors={errors}
                      handleChange={handleChange}
                    />
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key='step3'
                    variants={cardVariant}
                    initial='hidden'
                    animate='show'
                    exit='exit'
                    className='space-y-6'
                  >
                    <ReviewOrder cartItems={cart} />
                  </motion.div>
                )}
              </AnimatePresence>

              <CheckoutActions
                currentStep={currentStep}
                handlePrevStep={handlePrevStep}
                handleNextStep={handleNextStep}
                handleCheckout={handleCheckout}
                isLoading={isLoading}
              />
            </motion.div>
          </div>

          <OrderSummary cartItems={cart} total={total} />
        </div>
      </div>
    </div>
  )
}

export default Checkout
