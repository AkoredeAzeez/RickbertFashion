import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dctdaad7d/image/upload";
const UPLOAD_PRESET = "rickbertfashion";

const SAMPLE_PRODUCTS = [
  {
    _id: "1",
    name: "Classic Tee",
    description: "Comfortable cotton tee",
    price: 2500,
    images: ["/assets/sample1.jpg"],
  },
  {
    _id: "2",
    name: "Denim Jacket",
    description: "Stylish denim jacket",
    price: 12000,
    images: ["/assets/sample2.jpg"],
  },
  {
    _id: "3",
    name: "Sneakers",
    description: "Sporty sneakers",
    price: 8000,
    images: ["/assets/sample3.jpg"],
  },
];

export async function fetchProducts() {
  // simulate network latency
  await new Promise((r) => setTimeout(r, 120));
  // In a real app, you'd fetch from `${API_URL}/api/products`
  return SAMPLE_PRODUCTS;
}

export async function fetchProduct(id) {
  await new Promise((r) => setTimeout(r, 80));
  return SAMPLE_PRODUCTS.find((p) => p._id === id) || SAMPLE_PRODUCTS[0];
}

export async function deleteProduct(id) {
  await new Promise((r) => setTimeout(r, 80));
  // In a real app, you'd make a DELETE request to `${API_URL}/api/products/${id}`
  console.log(`Deleted product ${id}`);
  return { success: true };
}

export async function createProduct(productData, files, onUploadProgress) {
  const uploadedUrls = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "products");

    const cloudRes = await axios.post(CLOUDINARY_URL, formData, {
      onUploadProgress: (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total ?? 0)
        );
        onUploadProgress({ ...onUploadProgress, [i]: percent });
      },
    });
    uploadedUrls.push(cloudRes.data.secure_url);
  }

  const product = {
    ...productData,
    images: uploadedUrls,
  };

  const productRes = await axios.post(`${API_URL}/api/products`, product);
  return productRes.data;
}
