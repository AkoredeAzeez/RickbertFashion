import { Order } from '../types'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/orders`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    // The component using this expects an array of orders.
    // A standard Strapi endpoint returns StrapiCollectionResponse<Order>.
    // A custom endpoint might return Order[] directly.
    // We assume a custom endpoint is used, returning an array of Order-like objects.
    const data: Order[] = await response.json()
    return data
  } catch (err: any) {
    console.error('Error fetching orders:', err.message)
    return []
  }
}
