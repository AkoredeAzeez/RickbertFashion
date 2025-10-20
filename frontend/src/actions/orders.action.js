const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchOrders = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/orders`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching orders:", err.message);
    return [];
  }
};
