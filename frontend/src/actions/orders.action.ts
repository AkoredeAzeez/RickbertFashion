// Mock function to fetch only paid orders
export async function fetchPaidOrders(query: string): Promise<any[]> {
  await new Promise(res => setTimeout(res, 500))
  // Replace with real API call
  if (!query) return []
  // Example: return successful orders with shipping details
  return [
    {
      id: 'ORD123',
      status: 'paid',
      amount: 25000,
      date: '2025-10-21',
      shippingStatus: 'Shipped',
      trackingNumber: 'RB123456789NG',
      items: [
        { name: 'Luxury Shirt', qty: 1 },
        { name: 'Elegant Dress', qty: 2 },
      ],
      address: '12 Fashion Ave, Lagos',
    },
    {
      id: 'ORD124',
      status: 'paid',
      amount: 18000,
      date: '2025-10-19',
      shippingStatus: 'Processing',
      trackingNumber: '',
      items: [
        { name: 'Couture Pants', qty: 1 },
      ],
      address: '12 Fashion Ave, Lagos',
    },
  ]
}
import axios from 'axios'
import { Order, StrapiCollectionResponse } from '../types'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const response = await axios.get<StrapiCollectionResponse<Order>>(
      `${BACKEND_URL}/api/orders?populate=deep,2`,
    )
    return response.data.data
  } catch (err: any) {
    console.error('Error fetching orders:', err.message)
    return []
  }
}
