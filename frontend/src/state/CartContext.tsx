import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Product } from '@/types'

export interface CartItem extends Product {
  qty: number
}

interface ICartContext {
  cart: CartItem[]
  addItem: (product: Product, qty?: number) => void
  removeItem: (id: number) => void
  updateQty: (id: number, qty: number) => void
  total: number
  clearCart: () => void
  // Attach the current device cart to a user id (called after login).
  // If `merge` is true, merge existing user cart and device cart by summing qtys.
  attachUser?: (userId: string, merge?: boolean) => void
  // Merge a remote cart into local cart (useful when restoring from server).
  mergeWithRemote?: (remote: CartItem[]) => void
}

const CartCtx = createContext<ICartContext | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Keying strategy: use an authenticated user id if available, otherwise
  // create a stable per-device visitor id. This makes the cart unique to
  // each device (and optionally to each signed-in user if frontend sets
  // `localStorage.userId`).
  const CART_PREFIX = 'cart:'

  const getVisitorId = () => {
    try {
      let id: string | null = localStorage.getItem('rb:visitorId')
      if (!id) {
        // Use crypto.randomUUID when available for good uniqueness
        id = (typeof crypto !== 'undefined' && (crypto as any).randomUUID)
          ? (crypto as any).randomUUID()
          : Date.now().toString(36) + Math.random().toString(36).slice(2)
        localStorage.setItem('rb:visitorId', id as string)
      }
      return id
    } catch (e) {
      // Fallback deterministic-ish id
      return 'guest'
    }
  }

  const getCartKey = () => {
    try {
      // If your app stores an authenticated user id in localStorage (e.g. 'userId'),
      // prefer that so each user on the same device has a distinct cart.
      const userId = localStorage.getItem('userId')
      const id = userId || getVisitorId()
      return `${CART_PREFIX}${id}`
    } catch (e) {
      return `${CART_PREFIX}guest`
    }
  }

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(getCartKey())
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(getCartKey(), JSON.stringify(cart))
    } catch (e) {
      // ignore localStorage errors (e.g. quota exceeded)
    }
  }, [cart])

  const addItem = (product: Product, qty = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id)
      if (idx !== -1) {
        const next = [...prev]
        next[idx].qty += qty
        return next
      }
      return [...prev, { ...product, qty }]
    })
  }

  const removeItem = (id: number) =>
    setCart((prev) => prev.filter((i) => i.id !== id))
  const updateQty = (id: number, qty: number) =>
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)))
  const clearCart = () => setCart([])

  // Merge helper: combine two carts by summing quantities for same product id.
  const mergeCarts = (a: CartItem[], b: CartItem[]) => {
    const map = new Map<number, CartItem>()
    for (const it of a) map.set(it.id, { ...it })
    for (const it of b) {
      const existing = map.get(it.id)
      if (existing) existing.qty = existing.qty + it.qty
      else map.set(it.id, { ...it })
    }
    return Array.from(map.values())
  }

  // Called when the app detects (or receives) a user id after login. This
  // migrates the device cart into the user's cart key in localStorage.
  const attachUser = (userId: string, merge = true) => {
    try {
      const prevUserKey = `${CART_PREFIX}${userId}`
      const visitorKey = getCartKey() // current key (likely visitor)
      const visitorCartRaw = localStorage.getItem(visitorKey)
      const userCartRaw = localStorage.getItem(prevUserKey)
      const visitorCart: CartItem[] = visitorCartRaw ? JSON.parse(visitorCartRaw) : []
      const userCart: CartItem[] = userCartRaw ? JSON.parse(userCartRaw) : []

      const final = merge ? mergeCarts(userCart, visitorCart) : visitorCart.length ? visitorCart : userCart

      // persist to the new user key and update local state
      localStorage.setItem(prevUserKey, JSON.stringify(final))
      // also set the canonical userId so getCartKey will prefer it
      try { localStorage.setItem('userId', userId) } catch (e) {}
      setCart(final)
    } catch (e) {
      // swallow errors - attaching is optional
      console.error('attachUser error', e)
    }
  }

  const mergeWithRemote = (remote: CartItem[]) => {
    try {
      const merged = mergeCarts(cart, remote)
      setCart(merged)
    } catch (e) {
      console.error('mergeWithRemote error', e)
    }
  }

  const total = useMemo(
    () => cart.reduce((s, i) => s + i.price * i.qty, 0),
    [cart],
  )

  return (
    <CartCtx.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQty,
        total,
        clearCart,
        attachUser,
        mergeWithRemote,
      }}
    >
      {children}
    </CartCtx.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartCtx)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
