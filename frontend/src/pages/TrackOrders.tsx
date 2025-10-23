import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { fetchMyOrders } from '@/actions/orders.action'
import { getAuth } from '@/actions/auth.action'
import { Order } from '@/types'
import { Link } from 'react-router-dom'

export default function TrackOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const auth = useMemo(() => getAuth(), [])

  useEffect(() => {
    async function fetchUserOrders() {
      if (!auth) {
        setError('You must be logged in to view your orders.')
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const result = await fetchMyOrders()
        setOrders(result)
        if (result.length === 0) {
          setError('No orders found for your account.')
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch orders')
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    fetchUserOrders()
  }, [auth])

  if (loading) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <div className='text-center'>
          <motion.div
            className='w-16 h-16 border-2 border-black border-t-transparent rounded-full mx-auto mb-8'
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <motion.p
            className='text-black font-light tracking-[0.3em] text-sm uppercase'
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading Your Orders...
          </motion.p>
        </div>
      </div>
    )
  }

  if (!auth) {
    return (
      <div className='min-h-screen bg-stone-50 flex items-center justify-center px-4'>
        <motion.div
          className='text-center max-w-md mx-auto'
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className='text-2xl font-light tracking-wide text-stone-900 mb-4'>
            PLEASE LOGIN
          </h2>
          <p className='text-stone-600 font-light mb-8'>
            You need to be logged in to view your order history.
          </p>
          <Link
            to='/login'
            className='inline-block px-8 py-4 border border-stone-900 text-stone-900 font-light tracking-[0.2em] text-sm hover:bg-stone-900 hover:text-white transition-all duration-500 uppercase'
          >
            Login
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white text-black'>
      <section className='py-24 md:py-32'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='text-center mb-16'>
            <h1 className='text-4xl md:text-6xl font-thin tracking-wider mb-8'>
              MY ORDERS
            </h1>
            <div className='w-32 h-0.5 bg-black mx-auto' />
          </div>

          {error && !orders.length && (
            <div className='text-center py-20'>
              <p className='text-stone-600 font-light'>{error}</p>
            </div>
          )}

          <div className='space-y-12'>
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                className='bg-white border border-stone-200 hover:border-stone-300 transition-all duration-500 shadow-sm hover:shadow-lg'
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className='p-8 md:p-12'>
                  <div className='flex flex-col lg:flex-row lg:items-center justify-between mb-8 pb-8 border-b border-stone-100'>
                    <div className='mb-4 lg:mb-0'>
                      <h3 className='text-2xl font-thin tracking-wider mb-2'>
                        Order #{order.id}
                      </h3>
                      <div className='text-stone-600 font-light text-sm'>
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                    <div className='flex items-center gap-6'>
                      <span
                        className={`px-6 py-2 text-xs font-light tracking-[0.2em] uppercase border ${
                          order.paymentStatus === 'paid'
                            ? 'bg-black text-white border-black'
                            : 'bg-stone-100 text-stone-700 border-stone-300'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                      <div className='text-right'>
                        <div className='text-3xl font-thin tracking-wide'>
                          ₦{order.total.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='grid lg:grid-cols-2 gap-12'>
                    <div>
                      <h4 className='text-lg font-light tracking-[0.2em] uppercase border-b border-stone-200 pb-3 mb-6'>
                        Items Ordered
                      </h4>
                      <div className='space-y-4'>
                        {order.items.map((item, i) => (
                          <div
                            key={i}
                            className='flex justify-between items-center'
                          >
                            <div>
                              <p className='font-light text-stone-900'>
                                {item.product.data.name} × {item.quantity}
                              </p>
                            </div>
                            <p className='font-light text-stone-900'>
                              ₦
                              {(
                                item.product.data.price * item.quantity
                              ).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className='text-lg font-light tracking-[0.2em] uppercase border-b border-stone-200 pb-3 mb-6'>
                        Shipping Details
                      </h4>
                      <div className='font-light text-stone-700 leading-relaxed'>
                        <p>{order.customerName}</p>
                        <p>{order.shippingAddress.street}</p>
                        <p>
                          {order.shippingAddress.city},{' '}
                          {order.shippingAddress.state}
                        </p>
                        <p>{order.customerPhone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
