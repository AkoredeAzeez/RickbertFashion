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

  const getStatusStyles = (status) => {
    switch (status) {
      case "paid":
        return "bg-black text-white border-black";
      case "failed":
        return "bg-red-50 text-red-800 border-red-200";
      default:
        return "bg-stone-100 text-stone-700 border-stone-300";
    }
  };

  const getTotalRevenue = () => {
    return orders.reduce((total, order) => total + order.amount, 0);
  };

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        {/* Dynamic cursor effect */}
        <motion.div
          className="fixed w-4 h-4 bg-black rounded-full pointer-events-none z-50 mix-blend-difference"
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
            className="w-16 h-16 border-2 border-black border-t-transparent rounded-full mx-auto mb-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            className="text-black font-light tracking-[0.3em] text-sm uppercase"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading Orders...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      {/* Dynamic cursor effect */}
      <motion.div
        className="fixed w-4 h-4 bg-black rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Header Section */}
      <motion.section 
        ref={headerRef}
        className="py-24 md:py-32 relative overflow-hidden"
      >
        {/* Subtle background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(0,0,0,0.02)_0%,transparent_50%)]" />
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0,0,0,0.03), transparent 40%)`
          }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-thin tracking-wider mb-8"
              style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
              initial={{ opacity: 0, y: 100 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.5, delay: 0.5 }}
            >
              ORDER MANAGEMENT
            </motion.h1>
            
            <motion.div
              className="w-32 h-0.5 bg-black mx-auto mb-6"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 2, delay: 1 }}
            />

            <motion.p
              className="text-stone-600 font-light tracking-[0.2em] text-sm uppercase"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.8 } : {}}
              transition={{ duration: 1, delay: 1.5 }}
            >
              Customer Orders & Analytics
            </motion.p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 2 }}
          >
            <motion.div
              className="text-center group"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="text-3xl md:text-4xl font-thin mb-3 tracking-wide"
                animate={{ 
                  textShadow: ["0 0 0px rgba(0,0,0,0.3)", "0 0 10px rgba(0,0,0,0.1)", "0 0 0px rgba(0,0,0,0.3)"]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {orders.length}
              </motion.div>
              <div className="text-stone-600 font-light tracking-[0.2em] text-xs uppercase">
                Total Orders
              </div>
              <motion.div
                className="w-8 h-0.5 bg-stone-300 mx-auto mt-2 group-hover:bg-black transition-colors duration-500"
              />
            </motion.div>

            <motion.div
              className="text-center group"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="text-3xl md:text-4xl font-thin mb-3 tracking-wide text-black"
                animate={{ 
                  textShadow: ["0 0 0px rgba(0,0,0,0.3)", "0 0 10px rgba(0,0,0,0.1)", "0 0 0px rgba(0,0,0,0.3)"]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              >
                {getOrdersByStatus('paid')}
              </motion.div>
              <div className="text-stone-600 font-light tracking-[0.2em] text-xs uppercase">
                Paid Orders
              </div>
              <motion.div
                className="w-8 h-0.5 bg-stone-300 mx-auto mt-2 group-hover:bg-black transition-colors duration-500"
              />
            </motion.div>

            <motion.div
              className="text-center group"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="text-3xl md:text-4xl font-thin mb-3 tracking-wide text-stone-700"
                animate={{ 
                  textShadow: ["0 0 0px rgba(0,0,0,0.3)", "0 0 10px rgba(0,0,0,0.1)", "0 0 0px rgba(0,0,0,0.3)"]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              >
                {getOrdersByStatus('pending')}
              </motion.div>
              <div className="text-stone-600 font-light tracking-[0.2em] text-xs uppercase">
                Pending Orders
              </div>
              <motion.div
                className="w-8 h-0.5 bg-stone-300 mx-auto mt-2 group-hover:bg-stone-700 transition-colors duration-500"
              />
            </motion.div>

            <motion.div
              className="text-center group"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="text-2xl md:text-3xl font-thin mb-3 tracking-wide"
                animate={{ 
                  textShadow: ["0 0 0px rgba(0,0,0,0.3)", "0 0 10px rgba(0,0,0,0.1)", "0 0 0px rgba(0,0,0,0.3)"]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              >
                ₦{getTotalRevenue().toLocaleString()}
              </motion.div>
              <div className="text-stone-600 font-light tracking-[0.2em] text-xs uppercase">
                Total Revenue
              </div>
              <motion.div
                className="w-8 h-0.5 bg-stone-300 mx-auto mt-2 group-hover:bg-black transition-colors duration-500"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Orders Section */}
      <section className="pb-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          {orders.length === 0 ? (
            <motion.div
              className="text-center py-32"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="text-6xl md:text-8xl font-thin text-stone-200 mb-8"
                animate={{ 
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                ∅
              </motion.div>
              <h3 className="text-2xl md:text-3xl font-thin tracking-wider mb-4">
                No Orders Found
              </h3>
              <motion.div
                className="w-16 h-0.5 bg-stone-300 mx-auto mb-6"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1.5 }}
                viewport={{ once: true }}
              />
              <p className="text-stone-600 font-light tracking-[0.2em] text-sm uppercase">
                Your orders will appear here
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.5, staggerChildren: 0.1 }}
              viewport={{ once: true }}
            >
              {orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  className="group relative"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                >
                  {/* Order Card */}
                  <div className="bg-white border border-stone-200 hover:border-stone-300 transition-all duration-500 shadow-sm hover:shadow-lg relative overflow-hidden">
                    {/* Hover gradient effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 1.5 }}
                    />

                    <div className="p-8 md:p-12 relative z-10">
                      {/* Order Header */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 pb-8 border-b border-stone-100">
                        <div className="mb-4 lg:mb-0">
                          <motion.h3
                            className="text-2xl md:text-3xl font-thin tracking-wider mb-2"
                            style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
                          >
                            {order.customer?.name}
                          </motion.h3>
                          <div className="text-stone-600 font-light tracking-[0.15em] text-sm">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <span className={`px-6 py-2 text-xs font-light tracking-[0.2em] uppercase border transition-all duration-300 ${getStatusStyles(order.status)}`}>
                            {order.status}
                          </span>
                          <div className="text-right">
                            <div className="text-3xl md:text-4xl font-thin tracking-wide">
                              ₦{order.amount.toLocaleString()}
                            </div>
                            <div className="text-stone-500 font-light tracking-[0.15em] text-xs uppercase">
                              Total Amount
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Content Grid */}
                      <div className="grid lg:grid-cols-2 gap-12">
                        {/* Customer Information */}
                        <div className="space-y-8">
                          <motion.h4
                            className="text-lg font-light tracking-[0.2em] uppercase border-b border-stone-200 pb-3"
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.3 }}
                          >
                            Customer Details
                          </motion.h4>
                          
                          <div className="space-y-6">
                            <motion.div 
                              className="group/item"
                              whileHover={{ x: 10 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="text-stone-500 font-light tracking-[0.15em] text-xs uppercase mb-2">
                                Email Address
                              </div>
                              <div className="font-light text-lg tracking-wide group-hover/item:text-stone-700 transition-colors duration-300">
                                {order.customer?.email}
                              </div>
                            </motion.div>
                            
                            <motion.div 
                              className="group/item"
                              whileHover={{ x: 10 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="text-stone-500 font-light tracking-[0.15em] text-xs uppercase mb-2">
                                Phone Number
                              </div>
                              <div className="font-light text-lg tracking-wide group-hover/item:text-stone-700 transition-colors duration-300">
                                {order.customer?.phone}
                              </div>
                            </motion.div>
                            
                            <motion.div 
                              className="group/item"
                              whileHover={{ x: 10 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="text-stone-500 font-light tracking-[0.15em] text-xs uppercase mb-2">
                                Delivery Address
                              </div>
                              <div className="font-light text-lg leading-relaxed tracking-wide group-hover/item:text-stone-700 transition-colors duration-300">
                                {order.customer?.address}
                              </div>
                            </motion.div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-8">
                          <motion.h4
                            className="text-lg font-light tracking-[0.2em] uppercase border-b border-stone-200 pb-3"
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.3 }}
                          >
                            Items Ordered
                          </motion.h4>
                          
                          <div className="space-y-6">
                            {order.items.map((item, i) => (
                              <motion.div
                                key={i}
                                className="border border-stone-100 p-6 group/item hover:border-stone-200 transition-all duration-500 relative overflow-hidden"
                                whileHover={{ y: -3 }}
                                transition={{ duration: 0.3 }}
                              >
                                {/* Item hover effect */}
                                <motion.div
                                  className="absolute inset-0 bg-stone-50 opacity-0 group-hover/item:opacity-100 transition-opacity duration-500"
                                />
                                
                                <div className="relative z-10 flex justify-between items-start">
                                  <div className="flex-1 pr-6">
                                    <div className="font-light text-xl tracking-wide mb-2 group-hover/item:text-black transition-colors duration-300">
                                      {item.product?.name}
                                    </div>
                                    <div className="text-stone-500 font-light tracking-[0.15em] text-sm">
                                      Quantity: {item.qty} × ₦{item.price.toLocaleString()}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-light text-2xl tracking-wide group-hover/item:font-normal transition-all duration-300">
                                      ₦{(item.price * item.qty).toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                                
                                <motion.div
                                  className="w-full h-0.5 bg-stone-200 mt-4 opacity-0 group-hover/item:opacity-100 transition-opacity duration-500"
                                  initial={{ scaleX: 0 }}
                                  whileHover={{ scaleX: 1 }}
                                  transition={{ duration: 0.8 }}
                                />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Minimalist Footer */}
      <footer className="py-16 border-t border-stone-100 relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(0,0,0,0.01) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 30%, rgba(0,0,0,0.01) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 80%, rgba(0,0,0,0.01) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(0,0,0,0.01) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-black font-light tracking-[0.3em] text-sm uppercase mb-6">
              Rickbert Fashion
            </p>
            <motion.div
              className="w-16 h-0.5 bg-black mx-auto"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.5 }}
              viewport={{ once: true }}
            />
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Orders;