import axios from 'axios'
import { Product, StrapiCollectionResponse, StrapiResponse } from '../types'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await axios.get<StrapiCollectionResponse<Product>>(
      `${BACKEND_URL}/api/products?populate=*`,
    )
    return response.data.data
  } catch (err: any) {
    console.error('Error fetching products:', err.message)
    return []
  }
}

export async function fetchProduct(id: string): Promise<Product | undefined> {
  try {
    const response = await axios.get<StrapiResponse<Product>>(
      `${BACKEND_URL}/api/products/${id}?populate=*`,
    )
    return response.data.data
  } catch (err: any) {
    console.error(`Error fetching product ${id}:`, err.message)
    return undefined
  }
}

export async function deleteProduct(id: number): Promise<{ success: boolean }> {
  try {
    await axios.delete(`${BACKEND_URL}/api/products/${id}`)
    console.log(`Deleted product ${id}`)
    return { success: true }
  } catch (err: any) {
    console.error(`Error deleting product ${id}:`, err.message)
    return { success: false }
  }
}

export interface CreateProductData {
  name: string
  price: number
  description: string
  sizes: string
  colors: string
  stock: number
}

// Note: This function uploads images to the Strapi media library and then
// creates a product with the uploaded image IDs.
export async function createProduct(
  productData: CreateProductData,
  files: File[],
  onUploadProgress: (progress: any) => void,
): Promise<Product> {
  const uploadedImageIds: number[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const formData = new FormData()
    formData.append('files', file)

    const uploadRes = await axios.post(`${BACKEND_URL}/api/upload`, formData, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          )
          onUploadProgress((prev: any) => ({ ...prev, [i]: percent }))
        }
      },
    })

    if (uploadRes.data && uploadRes.data.length > 0) {
      uploadedImageIds.push(uploadRes.data[0].id)
    }
  }

  const product = {
    ...productData,
    images: uploadedImageIds,
  }

  const productRes = await axios.post<{ data: Product }>(
    `${BACKEND_URL}/api/products`,
    { data: product },
  )
  return productRes.data.data
}

export function imageUrlBuilder(url: string): string {
  if (url.startsWith('http')) return url
  return `${BACKEND_URL}${url}`
}
