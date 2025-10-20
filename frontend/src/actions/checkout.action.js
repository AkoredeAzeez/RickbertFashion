import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const initiatePayment = async (formData, cartItems, total) => {
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

export const verifyPayment = async (reference) => {
  const verifyRes = await axios.get(
    `${BACKEND_URL}/api/checkout/paystack/verify/${reference}`
  );

  if (verifyRes.data.status !== "success") {
    throw new Error("Payment verification failed");
  }

  return verifyRes.data.order;
};
