import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyPayment } from "../actions/checkout.action";
import { Order } from "../types";
import "../styles/payment-success.css";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
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

        const { attributes: { customerName, customerEmail, customerPhone, shippingAddress, items, total } } = verifiedOrder;
        const message = `
New Order 🚀
Name: ${customerName}
Email: ${customerEmail}
Phone: ${customerPhone}
Address: ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}
Total: ₦${total}

Items:
${items.map(item => `- ${item.product.data.attributes.name} x${item.quantity} = ₦${item.product.data.attributes.price * item.quantity}`).join("\n")}
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
        <p>Name: {order.attributes.customerName}</p>
        <p>Email: {order.attributes.customerEmail}</p>
        <p>Phone: {order.attributes.customerPhone}</p>
        <p>Address: {`${order.attributes.shippingAddress.street}, ${order.attributes.shippingAddress.city}`}</p>

        <h3>Items</h3>
        <ul>
          {order.attributes.items.map((item, i) => (
            <li key={i}>
              {item.product.data.attributes.name} x {item.quantity} = ₦{item.product.data.attributes.price * item.quantity}
            </li>
          ))}
        </ul>

        <h3>Total: ₦{order.attributes.total}</h3>
      </div>
    </div>
  );
};

export default PaymentSuccess;