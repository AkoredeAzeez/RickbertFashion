import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fetchOrders } from "../actions/orders.action";
import { Order } from "../types";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const headerRef = useRef(null);

  const isInView = useInView(headerRef, { once: true });

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const getStatusStyles = (status: string) => {
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
    return orders.reduce((total, order) => total + order.attributes.total, 0);
  };

  const getOrdersByStatus = (status: string) => {
    return orders.filter(order => order.attributes.paymentStatus === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
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

      <motion.section
        ref={headerRef}
        className="py-24 md:py-32 relative overflow-hidden"
      >
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
                  key={order.id}
                  className="group relative"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                >
                  <div className="bg-white border border-stone-200 hover:border-stone-300 transition-all duration-500 shadow-sm hover:shadow-lg relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 1.5 }}
                    />

                    <div className="p-8 md:p-12 relative z-10">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 pb-8 border-b border-stone-100">
                        <div className="mb-4 lg:mb-0">
                          <motion.h3
                            className="text-2xl md:text-3xl font-thin tracking-wider mb-2"
                            style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
                          >
                            {order.attributes.customerName}
                          </motion.h3>
                          <div className="text-stone-600 font-light tracking-[0.15em] text-sm">
                            {new Date(order.attributes.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <span className={`px-6 py-2 text-xs font-light tracking-[0.2em] uppercase border transition-all duration-300 ${getStatusStyles(order.attributes.paymentStatus)}`}>
                            {order.attributes.paymentStatus}
                          </span>
                          <div className="text-right">
                            <div className="text-3xl md:text-4xl font-thin tracking-wide">
                              ₦{order.attributes.total.toLocaleString()}
                            </div>
                            <div className="text-stone-500 font-light tracking-[0.15em] text-xs uppercase">
                              Total Amount
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid lg:grid-cols-2 gap-12">
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
                                {order.attributes.customerEmail}
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
                                {order.attributes.customerPhone}
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
                                {`${order.attributes.shippingAddress.street}, ${order.attributes.shippingAddress.city}`}
                              </div>
                            </motion.div>
                          </div>
                        </div>

                        <div className="space-y-8">
                          <motion.h4
                            className="text-lg font-light tracking-[0.2em] uppercase border-b border-stone-200 pb-3"
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.3 }}
                          >
                            Items Ordered
                          </motion.h4>

                          <div className="space-y-6">
                            {order.attributes.items.map((item, i) => (
                              <motion.div
                                key={i}
                                className="border border-stone-100 p-6 group/item hover:border-stone-200 transition-all duration-500 relative overflow-hidden"
                                whileHover={{ y: -3 }}
                                transition={{ duration: 0.3 }}
                              >
                                <motion.div
                                  className="absolute inset-0 bg-stone-50 opacity-0 group-hover/item:opacity-100 transition-opacity duration-500"
                                />

                                <div className="relative z-10 flex justify-between items-start">
                                  <div className="flex-1 pr-6">
                                    <div className="font-light text-xl tracking-wide mb-2 group-hover/item:text-black transition-colors duration-300">
                                      {item.product.data.attributes.name}
                                    </div>
                                    <div className="text-stone-500 font-light tracking-[0.15em] text-sm">
                                      Quantity: {item.quantity} × ₦{item.product.data.attributes.price.toLocaleString()}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-light text-2xl tracking-wide group-hover/item:font-normal transition-all duration-300">
                                      ₦{(item.product.data.attributes.price * item.quantity).toLocaleString()}
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
