import { useState, useEffect } from 'react'
import { fetchPaidOrders } from '@/actions/orders.action'
// Mock: get current user (replace with real auth context)
function getCurrentUser() {
  // Example: get from localStorage or context
  return { email: 'client@example.com', id: 'user123', name: 'Rick Client' };
}


export default function TrackOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const user = getCurrentUser();

  useEffect(() => {
    async function fetchUserOrders() {
      setLoading(true);
      try {
        const result = await fetchPaidOrders(user.email);
        setOrders(result);
        setError('');
        if (result.length === 0) setError('No paid orders found for your account.');
      } catch (err: any) {
        setError(err.message || 'Failed to fetch orders');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUserOrders();
  }, [user.email]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-stone-50'>
      <div className='bg-white p-8 rounded shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6'>Track Your Orders</h2>
        <div className='mb-4 text-gray-700'>Logged in as <b>{user.name}</b> ({user.email})</div>
        <button
          className='w-full bg-black text-white py-2 rounded font-semibold disabled:opacity-50 mb-4'
          onClick={async () => {
            setLoading(true);
            try {
              const result = await fetchPaidOrders(user.email);
              setOrders(result);
              setError('');
              if (result.length === 0) setError('No paid orders found for your account.');
            } catch (err: any) {
              setError(err.message || 'Failed to fetch orders');
              setOrders([]);
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Orders'}
        </button>
        {error && <div className='text-red-600 mt-4'>{error}</div>}
        {orders.length > 0 && (
          <div className='mt-6'>
            <h3 className='text-lg font-semibold mb-2'>Your Successful Orders:</h3>
            <ul className='space-y-3'>
              {orders.map((order) => (
                <li key={order.id} className='border p-3 rounded'>
                  <div><b>Order ID:</b> {order.id}</div>
                  <div><b>Status:</b> {order.status}</div>
                  <div><b>Amount:</b> ₦{order.amount}</div>
                  <div><b>Date:</b> {order.date}</div>
                  <div><b>Shipping Status:</b> {order.shippingStatus}</div>
                  {order.trackingNumber && (
                    <div><b>Tracking Number:</b> {order.trackingNumber}</div>
                  )}
                  <div><b>Delivery Address:</b> {order.address}</div>
                  <div><b>Items:</b>
                    <ul className='list-disc ml-6'>
                      {order.items.map((item: any, idx: number) => (
                        <li key={idx}>{item.name} x{item.qty}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
