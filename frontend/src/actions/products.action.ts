import axios from 'axios'
import { Product, StrapiCollectionResponse, StrapiResponse } from '../types'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dctdaad7d/image/upload'
const UPLOAD_PRESET = 'rickbertfashion'

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

// Note: This function uploads images to Cloudinary and saves the URLs.
// This is not the standard Strapi way of handling media uploads, which typically
// involves uploading directly to the Strapi media library. This might require
// a custom backend implementation to correctly handle image URLs.
export async function createProduct(
  productData: CreateProductData,
  files: File[],
  onUploadProgress: (progress: any) => void,
): Promise<Product> {
  const uploadedUrls: string[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)
    formData.append('folder', 'products')

    const cloudRes = await axios.post(CLOUDINARY_URL, formData, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          )
          onUploadProgress((prev: any) => ({ ...prev, [i]: percent }))
        }
      },
    })
    uploadedUrls.push(cloudRes.data.secure_url)
  }

  const product = {
    ...productData,
    images: uploadedUrls,
  }

  const productRes = await axios.post<{ data: Product }>(
    `${BACKEND_URL}/api/products`,
    { data: product },
  )
  return productRes.data.data
}
