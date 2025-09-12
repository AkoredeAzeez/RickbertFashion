import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const headerRef = useRef(null);
  const isInView = useInView(headerRef, { once: true });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/orders`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.customer?.name}</td>
                <td>{order.customer?.email}</td>
                <td>{order.customer?.phone}</td>
                <td>{order.customer?.address}</td>
                <td>
                  <ul>
                    {order.items.map((item, i) => (
                      <li key={i}>
                        {item.product?.name} x {item.qty} = ₦{item.price * item.qty}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>₦{order.amount}</td>
                <td>{order.status}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;