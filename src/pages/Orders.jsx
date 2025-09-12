import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Search,
  Eye,
  Edit,
  Trash2,
  X,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showModal, setShowModal] = useState(false);
  const [modalOrder, setModalOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdateOrder, setStatusUpdateOrder] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [wsConnected, setWsConnected] = useState(true);
  const headerRef = useRef(null);
  const isInView = useInView(headerRef, { once: true });

  // Debounced search term for performance
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const statusOptions = [
    { value: "pending", label: "Pending", icon: Clock, color: "amber" },
    { value: "confirmed", label: "Confirmed", icon: CheckCircle, color: "blue" },
    { value: "processing", label: "Processing", icon: Package, color: "purple" },
    { value: "shipped", label: "Shipped", icon: Truck, color: "indigo" },
    { value: "delivered", label: "Delivered", icon: CheckCircle, color: "emerald" },
    { value: "cancelled", label: "Cancelled", icon: XCircle, color: "red" },
    { value: "failed", label: "Failed", icon: AlertCircle, color: "red" },
    { value: "paid", label: "Paid", icon: CheckCircle, color: "emerald" },
  ];

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Notifications helpers
  const addNotification = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeNotification(id), 5000);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Throttled mouse tracking
  useEffect(() => {
    let rafId;
    const handleMouseMove = (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
        rafId = null;
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Original API call preserved
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/orders`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setOrders(data);
        setFilteredOrders(data);
        addNotification(`Loaded ${data.length} orders`, "success");
      } catch (err) {
        console.error("Error fetching orders:", err.message);
        addNotification("Failed to load orders", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [addNotification]);

  // Optimized filtering with debounced search
  useEffect(() => {
    let filtered = orders;

    if (filter !== "all") {
      filtered = filtered.filter((order) => order.status === filter);
    }

    if (debouncedSearchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.customer?.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          order.customer?.email?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          order._id.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          order.items.some((item) =>
            item.product?.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
          )
      );
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "customer":
          comparison = (a.customer?.name || "").localeCompare(b.customer?.name || "");
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === "desc" ? -comparison : comparison;
    });

    setFilteredOrders(filtered);
  }, [orders, filter, debouncedSearchTerm, sortBy, sortOrder]);

  const getStatusStyles = useCallback((status) => {
    const statusConfig = statusOptions.find((s) => s.value === status);
    if (!statusConfig) return "bg-stone-100 text-stone-700 border-stone-300";

    const colors = {
      amber: "bg-amber-50 text-amber-800 border-amber-200",
      blue: "bg-blue-50 text-blue-800 border-blue-200",
      purple: "bg-purple-50 text-purple-800 border-purple-200",
      indigo: "bg-indigo-50 text-indigo-800 border-indigo-200",
      emerald: "bg-emerald-50 text-emerald-800 border-emerald-200",
      red: "bg-red-50 text-red-800 border-red-200",
    };

    return colors[statusConfig.color] || "bg-stone-100 text-stone-700 border-stone-300";
  }, [statusOptions]);

  // Original status update API call preserved
  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        setShowStatusModal(false);
        setStatusUpdateOrder(null);
        addNotification(`Order status updated to ${newStatus}`, "success");
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      addNotification("Failed to update order status", "error");
    } finally {
      setUpdating(false);
    }
  };

  // Original delete API call preserved
  const handleDeleteOrder = async () => {
    setUpdating(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/orders/${deleteOrderId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setOrders((prev) => prev.filter((order) => order._id !== deleteOrderId));
        setShowDeleteModal(false);
        setDeleteOrderId(null);
        addNotification("Order deleted successfully", "success");
      } else {
        throw new Error("Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      addNotification("Failed to delete order", "error");
    } finally {
      setUpdating(false);
    }
  };

  const getTotalRevenue = useMemo(
    () => filteredOrders.reduce((total, order) => total + order.amount, 0),
    [filteredOrders]
  );

  const getOrdersByStatus = useCallback(
    (status) => filteredOrders.filter((order) => order.status === status).length,
    [filteredOrders]
  );

  const filterOptions = useMemo(
    () => [
      { value: "all", label: "All Orders", count: filteredOrders.length },
      ...statusOptions.map((status) => ({
        value: status.value,
        label: status.label,
        count: getOrdersByStatus(status.value),
        icon: status.icon,
        color: status.color,
      })),
    ],
    [filteredOrders.length, getOrdersByStatus, statusOptions]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          className="fixed w-4 h-4 bg-white rounded-full pointer-events-none z-50 mix-blend-difference"
          style={{
            left: mousePosition.x - 8,
            top: mousePosition.y - 8,
          }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-2 border-white border-t-transparent rounded-full mx-auto mb-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.h2
            className="text-2xl font-thin tracking-wider text-white"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            LOADING ORDERS
          </motion.h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Simplified cursor effect */}
      <div
        className="fixed w-4 h-4 bg-white rounded-full pointer-events-none z-40 mix-blend-difference opacity-50"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
          transition: 'left 0.1s ease-out, top 0.1s ease-out'
        }}
      />

      {/* WebSocket Connection Status */}
      <motion.div
        className="fixed top-6 right-6 z-50"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className={`px-4 py-2 rounded-full border text-sm font-light tracking-wide flex items-center gap-2 ${
            wsConnected
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              wsConnected ? "bg-emerald-400" : "bg-red-400"
            }`}
            style={{
              animation: wsConnected ? 'pulse 2s infinite' : 'none'
            }}
          />
          {wsConnected ? "Live Updates" : "Disconnected"}
        </div>
      </motion.div>

      {/* Notification System */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              className={`px-6 py-3 rounded border backdrop-blur-sm font-light tracking-wide text-sm flex items-center gap-3 min-w-[300px] ${
                notification.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : notification.type === "error"
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : notification.type === "warning"
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  : "bg-blue-500/10 border-blue-500/30 text-blue-400"
              }`}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
            >
              <span className="flex-1">{notification.message}</span>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-white/60 hover:text-white/80 transition-colors duration-200"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Hero Header */}
      <motion.section
        ref={headerRef}
        className="py-24 md:py-32 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 100 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.5 }}
          >
            <motion.h1
              className="text-5xl md:text-8xl lg:text-9xl font-thin tracking-wider mb-8"
              style={{
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                textShadow: "0 0 30px rgba(255,255,255,0.3)",
              }}
            >
              {"ORDERS".split("").map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            </motion.h1>

            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-8" />

            <motion.p
              className="text-white/60 font-light tracking-[0.3em] text-sm uppercase"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.6 } : {}}
              transition={{ duration: 1, delay: 2 }}
            >
              Management Dashboard
            </motion.p>
          </motion.div>

          {/* Stats Dashboard */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 2.5 }}
          >
            {[
              {
                label: "Total Orders",
                value: filteredOrders.length,
                icon: "📦",
                color: "from-blue-500/20 to-purple-500/20",
              },
              {
                label: "Delivered",
                value: getOrdersByStatus("delivered"),
                icon: "✓",
                color: "from-emerald-500/20 to-green-500/20",
              },
              {
                label: "Processing",
                value: getOrdersByStatus("processing") + getOrdersByStatus("shipped"),
                icon: "⏳",
                color: "from-amber-500/20 to-yellow-500/20",
              },
              {
                label: "Revenue",
                value: `₦${getTotalRevenue.toLocaleString()}`,
                icon: "💎",
                color: "from-violet-500/20 to-pink-500/20",
              },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                className={`relative group p-8 bg-gradient-to-br ${stat.color} backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-700`}
                whileHover={{ y: -5 }}
              >
                <div className="text-3xl mb-4">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-thin mb-3 tracking-wide">
                  {stat.value}
                </div>
                <div className="text-white/60 font-light tracking-[0.2em] text-xs uppercase">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Search and Controls */}
      <section className="py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders, customers, products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 text-white placeholder-white/40 focus:border-white/40 focus:outline-none transition-all duration-300 font-light tracking-wide"
              />
            </div>

            <div className="flex gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/20 text-white focus:border-white/40 focus:outline-none transition-all duration-300 font-light tracking-wide"
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="customer">Sort by Customer</option>
                <option value="status">Sort by Status</option>
              </select>

              <button
                onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                className="px-4 py-3 bg-white/5 border border-white/20 text-white hover:border-white/40 transition-all duration-300 font-light tracking-wide"
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Navigation */}
      <section className="py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-4 justify-center">
            {filterOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`px-6 py-3 text-sm font-light tracking-[0.2em] uppercase transition-all duration-500 relative group flex items-center gap-2 ${
                    filter === option.value
                      ? "text-black bg-white"
                      : "text-white/60 border border-white/20 hover:border-white/40 hover:text-white/90"
                  }`}
                >
                  {IconComponent && <IconComponent size={16} />}
                  {option.label}
                  {option.count > 0 && (
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        filter === option.value ? "bg-black/10 text-black" : "bg-white/10 text-white/60"
                      }`}
                    >
                      {option.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Orders Content */}
      <section className="py-16 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatePresence mode="wait">
            {filteredOrders.length === 0 ? (
              <motion.div
                key="empty"
                className="text-center py-32"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="text-8xl md:text-9xl font-thin text-white/10 mb-12">∅</div>
                <h3 className="text-3xl md:text-4xl font-thin tracking-wider mb-6">
                  {searchTerm ? "No matching orders" : filter === "all" ? "No Orders Found" : `No ${filter} Orders`}
                </h3>
                <div className="w-20 h-0.5 bg-white/30 mx-auto mb-8" />
                <p className="text-white/40 font-light tracking-[0.2em] text-sm uppercase">
                  {searchTerm ? "Try adjusting your search terms" : "Orders will appear here once placed"}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="orders"
                className="grid gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                {filteredOrders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    className="group relative"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: Math.min(index * 0.1, 1) }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-700 relative overflow-hidden">
                      <div className="p-8 md:p-12 relative z-10">
                        {/* Order Header */}
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-8">
                          <div className="mb-6 lg:mb-0 flex-1">
                            <div className="flex items-center gap-4 mb-4">
                              <h3
                                className="text-2xl md:text-3xl font-thin tracking-wider cursor-pointer hover:text-white/80 transition-colors"
                                onClick={() => {
                                  setModalOrder(order);
                                  setShowModal(true);
                                }}
                              >
                                {order.customer?.name || "Anonymous Customer"}
                              </h3>

                              <div
                                className={`px-4 py-1 text-xs font-light tracking-[0.2em] uppercase border shadow-lg cursor-pointer hover:scale-105 transition-transform ${getStatusStyles(
                                  order.status
                                )}`}
                                onClick={() => {
                                  setStatusUpdateOrder(order);
                                  setShowStatusModal(true);
                                }}
                              >
                                {order.status}
                              </div>

                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                  onClick={() => {
                                    setModalOrder(order);
                                    setShowModal(true);
                                  }}
                                  className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all duration-300"
                                >
                                  <Eye size={16} />
                                </button>

                                <button
                                  onClick={() => {
                                    setStatusUpdateOrder(order);
                                    setShowStatusModal(true);
                                  }}
                                  className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all duration-300"
                                >
                                  <Edit size={16} />
                                </button>

                                <button
                                  onClick={() => {
                                    setDeleteOrderId(order._id);
                                    setShowDeleteModal(true);
                                  }}
                                  className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 transition-all duration-300"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>

                            <div className="text-white/60 font-light tracking-[0.15em] text-sm mb-4">
                              Order #{order._id.slice(-8).toUpperCase()}
                            </div>

                            <div className="text-white/40 font-light tracking-[0.15em] text-sm">
                              {new Date(order.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>

                          <div className="text-right lg:text-left lg:pl-8">
                            <div className="text-4xl md:text-5xl font-thin tracking-wide mb-2">
                              ₦{order.amount.toLocaleString()}
                            </div>
                            <div className="text-white/40 font-light tracking-[0.15em] text-xs uppercase">
                              Total Amount
                            </div>
                            <div className="w-12 h-0.5 bg-white/30 mt-2 ml-auto lg:ml-0" />
                          </div>
                        </div>

                        {/* Product Images Preview */}
                        {order.items && order.items.length > 0 && (
                          <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                            {order.items.slice(0, 4).map((item, i) => (
                              <div
                                key={i}
                                className="flex-shrink-0 relative group/img"
                              >
                                <div className="w-16 h-16 bg-white/10 border border-white/20 overflow-hidden relative hover:scale-110 transition-transform duration-300">
                                  {item.product?.image ? (
                                    <img
                                      src={item.product.image}
                                      alt={item.product?.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/40">
                                      <Package size={24} />
                                    </div>
                                  )}
                                </div>
                                {order.items.length > 4 && i === 3 && (
                                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-light text-sm">
                                    +{order.items.length - 4}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Expandable Details */}
                        <AnimatePresence>
                          {selectedOrder === order._id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.5 }}
                              className="border-t border-white/10 pt-8 mt-8"
                            >
                              <div className="grid lg:grid-cols-2 gap-12">
                                {/* Customer Details */}
                                <div>
                                  <h4 className="text-lg font-light tracking-[0.2em] uppercase mb-6 text-white/80">
                                    Customer Information
                                  </h4>
                                  <div className="space-y-6">
                                    {[
                                      { label: "Email", value: order.customer?.email },
                                      { label: "Phone", value: order.customer?.phone },
                                      { label: "Address", value: order.customer?.address },
                                    ].map((field) => (
                                      <div key={field.label} className="group/field hover:translate-x-2 transition-transform duration-300">
                                        <div className="text-white/40 font-light tracking-[0.15em] text-xs uppercase mb-2">
                                          {field.label}
                                        </div>
                                        <div className="text-lg font-light tracking-wide group-hover/field:text-white transition-colors duration-300">
                                          {field.value || "Not provided"}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Order Items */}
                                <div>
                                  <h4 className="text-lg font-light tracking-[0.2em] uppercase mb-6 text-white/80">
                                    Order Items ({order.items.length})
                                  </h4>
                                  <div className="space-y-4 max-h-64 overflow-y-auto">
                                    {order.items.map((item, i) => (
                                      <div
                                        key={i}
                                        className="bg-white/5 border border-white/10 p-4 md:p-6 group/item hover:border-white/20 transition-all duration-500 hover:-translate-y-1"
                                      >
                                        <div className="flex gap-3 md:gap-4">
                                          <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 border border-white/20 overflow-hidden flex-shrink-0">
                                            {item.product?.image ? (
                                              <img
                                                src={item.product.image}
                                                alt={item.product?.name}
                                                className="w-full h-full object-cover"
                                              />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center text-white/40">
                                                <Package size={16} />
                                              </div>
                                            )}
                                          </div>

                                          <div className="flex-1">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                              <div className="flex-1 pr-0 sm:pr-4 mb-2 sm:mb-0">
                                                <div className="font-light text-base md:text-lg tracking-wide mb-2 group-hover/item:text-white transition-colors duration-300">
                                                  {item.product?.name || "Product"}
                                                </div>
                                                <div className="text-white/40 font-light tracking-[0.15em] text-sm">
                                                  Qty: {item.qty} × ₦{item.price.toLocaleString()}
                                                </div>
                                              </div>
                                              <div className="text-left sm:text-right">
                                                <div className="font-light text-lg md:text-xl tracking-wide group-hover/item:font-normal transition-all duration-300">
                                                  ₦{(item.price * item.qty).toLocaleString()}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Expand/Collapse Indicator */}
                        <button
                          onClick={() =>
                            setSelectedOrder(selectedOrder === order._id ? null : order._id)
                          }
                          className="flex justify-center mt-6 w-full py-4 text-white/40 hover:text-white/60 transition-colors duration-300"
                        >
                          <div className="text-sm flex items-center gap-2">
                            <span className={`transform transition-transform duration-300 ${selectedOrder === order._id ? 'rotate-180' : ''}`}>▲</span>
                            <span className="hidden sm:inline">Click to {selectedOrder === order._id ? "collapse" : "expand"}</span>
                            <span className="sm:hidden">{selectedOrder === order._id ? "Less" : "More"}</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Order Details Modal - Mobile Optimized */}
      <AnimatePresence>
        {showModal && modalOrder && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />

            <motion.div
              className="relative bg-black border border-white/20 w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
            >
              <div className="p-4 sm:p-6 md:p-8">
                <div className="flex justify-between items-start mb-6 md:mb-8">
                  <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-thin tracking-wider mb-2">Order Details</h2>
                    <p className="text-white/60 font-light tracking-[0.2em] text-xs sm:text-sm uppercase">
                      Order #{modalOrder._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 sm:p-3 hover:bg-white/10 transition-colors duration-300"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
                  {/* Customer Info */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-light tracking-wider mb-4">Customer Information</h3>
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <span className="text-white/60 text-sm">Name:</span>
                        <div className="font-light text-base sm:text-lg">{modalOrder.customer?.name || "N/A"}</div>
                      </div>
                      <div>
                        <span className="text-white/60 text-sm">Email:</span>
                        <div className="font-light text-base sm:text-lg break-all">{modalOrder.customer?.email || "N/A"}</div>
                      </div>
                      <div>
                        <span className="text-white/60 text-sm">Phone:</span>
                        <div className="font-light text-base sm:text-lg">{modalOrder.customer?.phone || "N/A"}</div>
                      </div>
                      <div>
                        <span className="text-white/60 text-sm">Address:</span>
                        <div className="font-light text-base sm:text-lg">{modalOrder.customer?.address || "N/A"}</div>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-light tracking-wider mb-4">Order Summary</h3>
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <span className="text-white/60 text-sm">Status:</span>
                        <div
                          className={`inline-block ml-2 px-3 py-1 text-xs font-light tracking-[0.2em] uppercase border ${getStatusStyles(
                            modalOrder.status
                          )}`}
                        >
                          {modalOrder.status}
                        </div>
                      </div>
                      <div>
                        <span className="text-white/60 text-sm">Date:</span>
                        <div className="font-light text-base sm:text-lg">
                          {new Date(modalOrder.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      <div>
                        <span className="text-white/60 text-sm">Total Amount:</span>
                        <div className="font-light text-xl sm:text-2xl">₦{modalOrder.amount.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div>
                  <h3 className="text-lg sm:text-xl font-light tracking-wider mb-4 md:mb-6">Order Items</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {modalOrder.items.map((item, i) => (
                      <div key={i} className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 border border-white/10">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 border border-white/20 overflow-hidden flex-shrink-0">
                          {item.product?.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product?.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/40">
                              <Package size={20} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                            <div className="mb-2 sm:mb-0">
                              <h4 className="font-light text-base sm:text-lg mb-1 sm:mb-2">{item.product?.name || "Product"}</h4>
                              <p className="text-white/60 text-sm">
                                Quantity: {item.qty} × ₦{item.price.toLocaleString()}
                              </p>
                            </div>
                            <div className="text-left sm:text-right">
                              <div className="font-light text-lg sm:text-xl">
                                ₦{(item.price * item.qty).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Update Modal - Mobile Optimized */}
      <AnimatePresence>
        {showStatusModal && statusUpdateOrder && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowStatusModal(false)}
            />

            <motion.div
              className="relative bg-black border border-white/20 w-full max-w-md max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
            >
              <div className="p-4 sm:p-6 md:p-8">
                <div className="flex justify-between items-start mb-4 md:mb-6">
                  <h2 className="text-xl sm:text-2xl font-thin tracking-wider">Update Status</h2>
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="p-2 hover:bg-white/10 transition-colors duration-300"
                  >
                    <X size={18} />
                  </button>
                </div>

                <p className="text-white/60 mb-4 md:mb-6 text-sm">Order #{statusUpdateOrder._id.slice(-8).toUpperCase()}</p>

                <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                  {statusOptions.map((status) => {
                    const IconComponent = status.icon;
                    const isCurrent = statusUpdateOrder.status === status.value;
                    return (
                      <button
                        key={status.value}
                        onClick={() => handleStatusUpdate(statusUpdateOrder._id, status.value)}
                        disabled={updating}
                        className={`w-full flex items-center gap-3 p-3 sm:p-4 text-left border transition-all duration-300 ${
                          isCurrent
                            ? "border-white/40 bg-white/10"
                            : "border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <IconComponent size={18} />
                        <span className="font-light tracking-wide flex-1">{status.label}</span>
                        {isCurrent && (
                          <span className="text-xs text-white/60">CURRENT</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {updating && (
                  <div className="flex justify-center">
                    <motion.div
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal - Mobile Optimized */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowDeleteModal(false)}
            />

            <motion.div
              className="relative bg-black border border-red-500/20 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
            >
              <div className="p-4 sm:p-6 md:p-8 text-center">
                <div className="text-4xl sm:text-6xl mb-4 md:mb-6">⚠️</div>
                <h2 className="text-xl sm:text-2xl font-thin tracking-wider mb-3 md:mb-4">Delete Order</h2>
                <p className="text-white/60 mb-6 md:mb-8 text-sm sm:text-base">
                  Are you sure you want to delete this order? This action cannot be undone.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    disabled={updating}
                    className="flex-1 px-4 sm:px-6 py-3 border border-white/20 hover:border-white/40 transition-all duration-300 font-light tracking-wide text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteOrder}
                    disabled={updating}
                    className="flex-1 px-4 sm:px-6 py-3 bg-red-500 hover:bg-red-600 transition-all duration-300 font-light tracking-wide disabled:opacity-50 text-sm sm:text-base"
                  >
                    {updating ? (
                      <div className="flex items-center justify-center gap-2">
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span className="hidden sm:inline">Deleting...</span>
                        <span className="sm:hidden">...</span>
                      </div>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-12 md:py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white font-light tracking-[0.3em] text-xs sm:text-sm uppercase mb-4 md:mb-6">Rickbert Fashion</p>
          <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent mx-auto" />
        </div>
      </footer>

      {/* Mobile-optimized scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 1px;
          }
        }
      `}</style>
    </div>
  );
};

export default Orders;