import axios from 'axios'
import { Order, StrapiCollectionResponse } from '../types'
import { getAuth } from './auth.action'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const fetchOrders = async (): Promise<Order[]> => {
  const auth = getAuth()
  if (!auth) {
    return []
  }

  try {
    const response = await axios.get<StrapiCollectionResponse<Order>>(
      `${BACKEND_URL}/api/orders?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${auth.jwt}`,
        },
      },
    )
    return response.data.data
  } catch (err: any) {
    console.error('Error fetching orders:', err.message)
    return []
  }
}

export const fetchMyOrders = async (): Promise<Order[]> => {
  const auth = getAuth()
  if (!auth) {
    // Not logged in, no orders to fetch
    return []
  }

  try {
    const response = await axios.get<StrapiCollectionResponse<Order>>(
      `${BACKEND_URL}/api/orders?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${auth.jwt}`,
        },
        params: {
          'filters[customerEmail][$eq]': auth.user.email,
        },
      },
    )
    return response.data.data
  } catch (err: any) {
    console.error('Error fetching my orders:', err.message)
    return []
  }
}
