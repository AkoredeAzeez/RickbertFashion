/**
 * This file contains TypeScript interfaces based on the Strapi backend types.
 * Generated from backend/types/generated/*.d.ts
 */

// --- Strapi Generic Types ---

export type StrapiDataItem<T> = T & {
  id: number
}

export interface StrapiResponse<T> {
  data: T
  meta: {}
}

export interface StrapiCollectionResponse<T> {
  data: T[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

// --- Component Types ---

// Based on shared.address component
export interface AddressComponent {
  id: number
  city: string
  state: string
  street: string
  zip: string
}

// Based on shop.order-item component
export interface OrderItemComponent {
  id: number
  quantity: number
  product: StrapiResponse<Product>
}

// --- Content Type Attributes ---

// Based on plugin::upload.file
export interface MediaAttributes {
  name: string
  alternativeText: string | null
  caption: string | null
  width: number
  height: number
  formats: {
    thumbnail?: { url: string }
    small?: { url: string }
    medium?: { url: string }
    large?: { url: string }
  } | null
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: string | null
  provider: string
  createdAt: string
  updatedAt: string
}

// Based on api::product.product
export interface ProductAttributes {
  name: string
  description: string
  price: number
  images: StrapiCollectionResponse<Media>
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  colors: string | null
  sizes: string | null
  stock: number | null
}

// Based on api::order.order
export interface OrderAttributes {
  total: number
  items: OrderItemComponent[]
  shippingAddress: AddressComponent
  customerName: string
  customerEmail: string
  customerPhone: string
  paymentStatus: 'pending' | 'paid' | 'failed'
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentReference: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

// --- Fully Typed Content Types ---

export type Product = StrapiDataItem<ProductAttributes>
export type Order = StrapiDataItem<OrderAttributes>
export type Media = StrapiDataItem<MediaAttributes>
