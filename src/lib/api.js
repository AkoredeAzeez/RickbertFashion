import axios from "axios";

// ✅ use env-based URL
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// ====== Products ======
export const fetchProducts = () =>
  api.get("/api/products").then((r) => r.data);

export const fetchProduct = (id) =>
  api.get(`/api/products/${id}`).then((r) => r.data);

export const uploadProduct = (formData) =>
  api.post("/api/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);

export const deleteProduct = (id) =>
  api.delete(`/api/products/${id}`).then((r) => r.data);

// ====== Payments ======
export const paystackInitiate = (payload) =>
  api.post("/api/checkout/paystack/initiate", payload).then((r) => r.data);

export const paystackVerify = (reference) =>
  api.get(`/api/checkout/paystack/verify/${reference}`).then((r) => r.data);
