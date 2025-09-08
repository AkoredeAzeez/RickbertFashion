import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 4000;
export const BACKEND_URL =
  process.env.BACKEND_URL || `http://localhost:${PORT}`;
export const MONGODB_URI = process.env.MONGODB_URI;
export const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
export const CLIENT_URL = process.env.CLIENT_URL;

console.log("PORT:", PORT);
console.log("BACKEND_URL:", BACKEND_URL);
console.log("CLIENT_URL:", CLIENT_URL);
