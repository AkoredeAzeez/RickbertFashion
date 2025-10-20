import axios from 'axios'
import { Product } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dctdaad7d/image/upload'
const UPLOAD_PRESET = 'rickbertfashion'

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 1,
    attributes: {
      name: 'Classic Tee',
      description: 'Comfortable cotton tee',
      price: 2500,
      images: {
        data: [
          {
            id: 1,
            attributes: {
              url: '/assets/sample1.jpg',
              name: 'sample1.jpg',
              hash: 'sample1',
              ext: '.jpg',
              mime: 'image/jpeg',
              size: 123,
              width: 500,
              height: 500,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              alternativeText: null,
              caption: null,
              formats: null,
              previewUrl: null,
              provider: 'local',
            },
          },
        ],
        meta: { pagination: { page: 1, pageSize: 1, pageCount: 1, total: 1 } },
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    },
  },
  {
    id: 2,
    attributes: {
      name: 'Denim Jacket',
      description: 'Stylish denim jacket',
      price: 12000,
      images: {
        data: [
          {
            id: 2,
            attributes: {
              url: '/assets/sample2.jpg',
              name: 'sample2.jpg',
              hash: 'sample2',
              ext: '.jpg',
              mime: 'image/jpeg',
              size: 123,
              width: 500,
              height: 500,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              alternativeText: null,
              caption: null,
              formats: null,
              previewUrl: null,
              provider: 'local',
            },
          },
        ],
        meta: { pagination: { page: 1, pageSize: 1, pageCount: 1, total: 1 } },
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    },
  },
  {
    id: 3,
    attributes: {
      name: 'Sneakers',
      description: 'Sporty sneakers',
      price: 8000,
      images: {
        data: [
          {
            id: 3,
            attributes: {
              url: '/assets/sample3.jpg',
              name: 'sample3.jpg',
              hash: 'sample3',
              ext: '.jpg',
              mime: 'image/jpeg',
              size: 123,
              width: 500,
              height: 500,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              alternativeText: null,
              caption: null,
              formats: null,
              previewUrl: null,
              provider: 'local',
            },
          },
        ],
        meta: { pagination: { page: 1, pageSize: 1, pageCount: 1, total: 1 } },
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    },
  },
]

export async function fetchProducts(): Promise<Product[]> {
  // simulate network latency
  await new Promise((r) => setTimeout(r, 120))
  // In a real app, you'd fetch from `${API_URL}/api/products`
  return SAMPLE_PRODUCTS
}

export async function fetchProduct(id: string): Promise<Product | undefined> {
  await new Promise((r) => setTimeout(r, 80))
  return SAMPLE_PRODUCTS.find((p) => p.id === Number(id))
}

export async function deleteProduct(id: number): Promise<{ success: true }> {
  await new Promise((r) => setTimeout(r, 80))
  // In a real app, you'd make a DELETE request to `${API_URL}/api/products/${id}`
  console.log(`Deleted product ${id}`)
  return { success: true }
}

export interface CreateProductData {
  name: string
  price: number
  description: string
  sizes: string
  colors: string
  stock: number
}

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
    `${API_URL}/api/products`,
    { data: product },
  )
  return productRes.data.data
}
