// Temporary API placeholders while the Strapi backend is being built

const SAMPLE_PRODUCTS = [
  { _id: '1', name: 'Classic Tee', description: 'Comfortable cotton tee', price: 2500, imageUrl: '/assets/sample1.jpg' },
  { _id: '2', name: 'Denim Jacket', description: 'Stylish denim jacket', price: 12000, imageUrl: '/assets/sample2.jpg' },
  { _id: '3', name: 'Sneakers', description: 'Sporty sneakers', price: 8000, imageUrl: '/assets/sample3.jpg' }
]

export async function fetchProducts() {
  // simulate network latency
  await new Promise((r) => setTimeout(r, 120))
  return SAMPLE_PRODUCTS
}

export async function fetchProduct(id) {
  await new Promise((r) => setTimeout(r, 80))
  return SAMPLE_PRODUCTS.find(p => p._id === id) || SAMPLE_PRODUCTS[0]
}

export async function deleteProduct(id) {
  await new Promise((r) => setTimeout(r, 80))
  // not actually deleting in placeholder
  return { success: true }
}

export default { fetchProducts, fetchProduct, deleteProduct }
