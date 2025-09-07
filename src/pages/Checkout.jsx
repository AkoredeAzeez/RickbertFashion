import React, { useState } from "react";
import axios from "axios";
import { useCart } from "../state/CartContext";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {
  const { cart, total } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    if (!cart.length || !formData.name || !formData.email) return;

    try {
      // 🔹 Step 1: Initiate Paystack payment
      const totalAmountKobo = total * 100; // Paystack requires kobo
      const response = await axios.post(`${BACKEND_URL}/api/checkout/paystack/initiate`, {
        ...formData,
        amount: totalAmountKobo,
        cart,
      });

      if (response.data && response.data.authorization_url && response.data.reference) {
        // 🔹 Step 2: Construct your redirect page
        const successPageUrl = `/payment-success?reference=${response.data.reference}`;

        // 🔹 Step 3: Open Paystack in the same tab
        window.location.href = response.data.authorization_url;

        // Note: After payment, Paystack needs to redirect to the success page URL
        // You should configure the Paystack "callback_url" on the backend when initializing transaction
      }
    } catch (err) {
      console.error("Checkout error:", err.response?.data || err.message);
      alert("Payment initiation failed. Check console.");
    }
  };

  return (
    <div className="checkout">
      <h2>Checkout</h2>

      <div className="form">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Delivery Address"
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      <h3>Total: ₦{total}</h3>

      <button
        onClick={handleCheckout}
        disabled={!cart.length || !formData.email || !formData.name}
      >
        Pay with Paystack
      </button>
    </div>
  );
};

export default Checkout;
