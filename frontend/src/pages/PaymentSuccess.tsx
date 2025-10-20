import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyPayment } from "../actions/checkout.action";
import "../styles/payment-success.css";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  useEffect(() => {
    if (!reference) {
      alert("No payment reference found!");
      navigate("/checkout");
      return;
    }

    const handlePaymentSuccess = async () => {
      try {
        const verifiedOrder = await verifyPayment(reference);
        setOrder(verifiedOrder);

        const { customer, items, amount } = verifiedOrder;
        const message = `
New Order 🚀
Name: ${customer.name}
Email: ${customer.email}
Phone: ${customer.phone}
Address: ${customer.address}
Total: ₦${amount}

Items:
${items.map(item => `- ${item.product.name} x${item.qty} = ₦${item.price * item.qty}`).join("\n")}
        `;
        const whatsappNumber = "2349043045934";
        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");

        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 4000);

      } catch (err) {
        console.error("Payment success error:", err);
        alert("Something went wrong while processing your order.");
        navigate("/checkout");
      }
    };

    handlePaymentSuccess();
  }, [reference, navigate]);

  if (!order) return <p>Processing your payment...</p>;

  return (
    <div className="payment-success">
      <h2>Payment Successful! 🎉</h2>
      <p>Your order has been confirmed.</p>

      {showNotification && (
        <div className="notification">
          ✅ Order sent to WhatsApp & saved successfully!
        </div>
      )}

      <div className="order-details">
        <h3>Customer Info</h3>
        <p>Name: {order.customer.name}</p>
        <p>Email: {order.customer.email}</p>
        <p>Phone: {order.customer.phone}</p>
        <p>Address: {order.customer.address}</p>

        <h3>Items</h3>
        <ul>
          {order.items.map((item, i) => (
            <li key={i}>
              {item.product.name} x {item.qty} = ₦{item.price * item.qty}
            </li>
          ))}
        </ul>

        <h3>Total: ₦{order.amount}</h3>
      </div>
    </div>
  );
};

export default PaymentSuccess;
