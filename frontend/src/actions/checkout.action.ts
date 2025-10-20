import axios from "axios";
import { Order } from "../types";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// This is based on the mock product data and cart state
export interface CartItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  qty: number;
}

export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}

export const initiatePayment = async (formData: CheckoutFormData, cartItems: CartItem[], total: number): Promise<void> => {
  const totalAmountKobo = total * 100;
  const response = await fetch(
    `${BACKEND_URL}/api/checkout/paystack/initiate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        amount: totalAmountKobo,
        cart: cartItems,
      }),
    }
  );

  const data = await response.json();

  if (data && data.authorization_url && data.reference) {
    window.location.href = data.authorization_url;
  } else {
    throw new Error("Invalid response from payment gateway");
  }
};

export const verifyPayment = async (reference: string): Promise<Order> => {
  const verifyRes = await axios.get<{ status: string; order: Order }>(
    `${BACKEND_URL}/api/checkout/paystack/verify/${reference}`
  );

  if (verifyRes.data.status !== "success") {
    throw new Error("Payment verification failed");
  }

  return verifyRes.data.order;
};