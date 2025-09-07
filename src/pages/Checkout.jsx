import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Checkout = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  // Fetch cart from backend or localStorage if needed
  React.useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
    const sum = storedCart.reduce((acc, item) => acc + item.price * item.qty, 0);
    setTotal(sum);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    if (!cartItems.length || !formData.name || !formData.email) return;

    try {
      const totalAmountKobo = total * 100; // Paystack requires kobo
      const response = await axios.post(`${BACKEND_URL}/api/checkout/paystack/initiate`, {
        ...formData,
        amount: totalAmountKobo,
        cart: cartItems,
      });

      if (response.data && response.data.authorization_url && response.data.reference) {
        // Redirect to Paystack in the same tab
        window.location.href = response.data.authorization_url;

        // After payment, Paystack should redirect back to:
        // /payment-success?reference=xxx
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
        disabled={!cartItems.length || !formData.email || !formData.name}
      >
        Pay with Paystack
      </button>
    </div>
  );
};

export default Checkout;
