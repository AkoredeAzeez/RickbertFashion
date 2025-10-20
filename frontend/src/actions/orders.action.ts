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
