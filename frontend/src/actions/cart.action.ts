// cart.action.ts
// API call to merge device cart with server cart after login
import axios from 'axios'
import { CartItem } from '../state/CartContext'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export async function mergeCartWithServer(userId: string, deviceCart: CartItem[]): Promise<CartItem[]> {
  // POST device cart to server, get merged cart back
  const res = await axios.post(`${BACKEND_URL}/api/cart/merge`, {
    userId,
    cart: deviceCart,
  })
  // Server should return the merged cart
  return res.data.cart
}
