import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { verifyPayment } from '@/actions/checkout.action'
import { useCart } from '@/state/CartContext'
import { Order, OrderItemComponent } from '@/types'
import '@/styles/payment-success.css'

const PaymentSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [showNotification, setShowNotification] = useState(false)
  const { clearCart } = useCart()

  const searchParams = new URLSearchParams(location.search)
  const reference = searchParams.get('reference') || searchParams.get('trxref')

  useEffect(() => {
    if (!reference) {
      alert('No payment reference found!')
      navigate('/checkout')
      return
    }

    const handlePaymentSuccess = async () => {
      try {
        const verifiedOrder = await verifyPayment(reference)
        setOrder(verifiedOrder)
        clearCart()

        const {
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
          items,
          total,
        } = verifiedOrder
        const formatOrderItem = (item: OrderItemComponent): string =>
          `- ${item.product.data.name} x${item.quantity} = ₦${
            item.product.data.price * item.quantity
          }`
        const message = [
          `New Order 🚀`,
          `Name: ${customerName}`,
          `Email: ${customerEmail}`,
          `Phone: ${customerPhone}`,
          `Address: ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}`,
          `Total: ₦${total}`,
          `Items:
${items.map(formatOrderItem).join('\n')}`,
        ].join('\n')
        const whatsappNumber = '2349043045934'
        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          message,
        )}`
        window.open(url, '_blank')

        setShowNotification(true)
        setTimeout(() => setShowNotification(false), 4000)
      } catch (err) {
        console.error('Payment success error:', err)
        alert('Something went wrong while processing your order.')
        navigate('/checkout')
      }
    }

    handlePaymentSuccess()
  }, [reference, navigate, clearCart])

  if (!order) return <p>Processing your payment...</p>

  return (
    <div className='payment-success'>
      <h2>Payment Successful! 🎉</h2>
      <p>Your order has been confirmed.</p>

      {showNotification && (
        <div className='notification'>
          ✅ Order sent to WhatsApp & saved successfully!
        </div>
      )}

      <div className='order-details'>
        <h3>Customer Info</h3>
        <p>Name: {order.customerName}</p>
        <p>Email: {order.customerEmail}</p>
        <p>Phone: {order.customerPhone}</p>
        <p>
          Address:{' '}
          {`${order.shippingAddress.street}, ${order.shippingAddress.city}`}
        </p>

        <h3>Items</h3>
        <ul>
          {order.items.map((item, i) => (
            <li key={i}>
              {item.product.data.name} x {item.quantity} = ₦
              {item.product.data.price * item.quantity}
            </li>
          ))}
        </ul>

        <h3>Total: ₦{order.total}</h3>
      </div>
    </div>
  )
}

export default PaymentSuccess
