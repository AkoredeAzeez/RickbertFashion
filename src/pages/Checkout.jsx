import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Checkout = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });
  const [errors, setErrors] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  // Fetch cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
    const sum = storedCart.reduce((acc, item) => acc + item.price * item.qty, 0);
    setTotal(sum);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Full name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    }
    
    if (step === 2) {
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.state.trim()) newErrors.state = "State is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleCheckout = async () => {
    if (!cartItems.length || !validateStep(1) || !validateStep(2)) return;

    setIsLoading(true);
    try {
      const totalAmountKobo = total * 100;
      const response = await fetch(`${BACKEND_URL}/api/checkout/paystack/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: totalAmountKobo,
          cart: cartItems,
        }),
      });

      const data = await response.json();

      if (data && data.authorization_url && data.reference) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error('Invalid response from payment gateway');
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Payment initiation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Personal Info", description: "Your contact details" },
    { number: 2, title: "Shipping", description: "Delivery information" },
    { number: 3, title: "Payment", description: "Review and pay" },
  ];

  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <motion.div
          className="text-center max-w-md mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-2xl font-light tracking-wide text-stone-900 mb-4">
            NO ITEMS TO CHECKOUT
          </h2>
          <p className="text-stone-600 font-light mb-8">
            Your cart is empty. Please add items before proceeding to checkout.
          </p>
          <button
            onClick={() => navigate('/home')}
            className="inline-block px-8 py-4 border border-stone-900 text-stone-900 font-light tracking-[0.2em] text-sm hover:bg-stone-900 hover:text-white transition-all duration-500 uppercase"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-3xl md:text-4xl font-light tracking-wide text-stone-900 mb-4">
            CHECKOUT
          </h1>
          <div className="w-20 h-0.5 bg-stone-400 mx-auto" />
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-light transition-all duration-500 ${
                      currentStep >= step.number
                        ? 'border-stone-900 bg-stone-900 text-white'
                        : 'border-stone-300 text-stone-400'
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {step.number}
                  </motion.div>
                  <div className="text-center mt-2">
                    <p className={`text-xs font-light tracking-wide uppercase ${
                      currentStep >= step.number ? 'text-stone-900' : 'text-stone-400'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 transition-all duration-500 ${
                    currentStep > step.number ? 'bg-stone-900' : 'bg-stone-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white border border-stone-200 p-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-light tracking-wide text-stone-900 mb-6 uppercase">
                      Personal Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <input
                          type="text"
                          name="name"
                          placeholder="FULL NAME"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full px-4 py-4 border font-light tracking-wide placeholder-stone-400 focus:outline-none focus:border-stone-500 transition-colors duration-300 ${
                            errors.name ? 'border-red-400' : 'border-stone-300'
                          }`}
                        />
                        {errors.name && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-xs mt-1 font-light"
                          >
                            {errors.name}
                          </motion.p>
                        )}
                      </div>
                      
                      <div>
                        <input
                          type="email"
                          name="email"
                          placeholder="EMAIL ADDRESS"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-4 border font-light tracking-wide placeholder-stone-400 focus:outline-none focus:border-stone-500 transition-colors duration-300 ${
                            errors.email ? 'border-red-400' : 'border-stone-300'
                          }`}
                        />
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-xs mt-1 font-light"
                          >
                            {errors.email}
                          </motion.p>
                        )}
                      </div>
                      
                      <div>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="PHONE NUMBER"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full px-4 py-4 border font-light tracking-wide placeholder-stone-400 focus:outline-none focus:border-stone-500 transition-colors duration-300 ${
                            errors.phone ? 'border-red-400' : 'border-stone-300'
                          }`}
                        />
                        {errors.phone && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-xs mt-1 font-light"
                          >
                            {errors.phone}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-light tracking-wide text-stone-900 mb-6 uppercase">
                      Shipping Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <input
                          type="text"
                          name="address"
                          placeholder="DELIVERY ADDRESS"
                          value={formData.address}
                          onChange={handleChange}
                          className={`w-full px-4 py-4 border font-light tracking-wide placeholder-stone-400 focus:outline-none focus:border-stone-500 transition-colors duration-300 ${
                            errors.address ? 'border-red-400' : 'border-stone-300'
                          }`}
                        />
                        {errors.address && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-xs mt-1 font-light"
                          >
                            {errors.address}
                          </motion.p>
                        )}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <input
                            type="text"
                            name="city"
                            placeholder="CITY"
                            value={formData.city}
                            onChange={handleChange}
                            className={`w-full px-4 py-4 border font-light tracking-wide placeholder-stone-400 focus:outline-none focus:border-stone-500 transition-colors duration-300 ${
                              errors.city ? 'border-red-400' : 'border-stone-300'
                            }`}
                          />
                          {errors.city && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-red-500 text-xs mt-1 font-light"
                            >
                              {errors.city}
                            </motion.p>
                          )}
                        </div>
                        
                        <div>
                          <input
                            type="text"
                            name="state"
                            placeholder="STATE"
                            value={formData.state}
                            onChange={handleChange}
                            className={`w-full px-4 py-4 border font-light tracking-wide placeholder-stone-400 focus:outline-none focus:border-stone-500 transition-colors duration-300 ${
                              errors.state ? 'border-red-400' : 'border-stone-300'
                            }`}
                          />
                          {errors.state && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-red-500 text-xs mt-1 font-light"
                            >
                              {errors.state}
                            </motion.p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-light tracking-wide text-stone-900 mb-6 uppercase">
                      Review Order
                    </h3>
                    
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item._id} className="flex justify-between items-center py-3 border-b border-stone-100">
                          <div>
                            <p className="font-light text-stone-900 uppercase tracking-wide">
                              {item.name} × {item.qty}
                            </p>
                          </div>
                          <p className="font-light text-stone-900">
                            ₦{(item.price * item.qty).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-8 border-t border-stone-200">
                <motion.button
                  onClick={handlePrevStep}
                  className={`px-6 py-3 font-light tracking-wide text-sm uppercase transition-all duration-300 ${
                    currentStep === 1
                      ? 'text-stone-400 cursor-not-allowed'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  disabled={currentStep === 1}
                  whileHover={currentStep > 1 ? { scale: 1.05 } : {}}
                  whileTap={currentStep > 1 ? { scale: 0.95 } : {}}
                >
                  Previous
                </motion.button>

                {currentStep < 3 ? (
                  <motion.button
                    onClick={handleNextStep}
                    className="px-8 py-3 border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white font-light tracking-wide text-sm uppercase transition-all duration-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Continue
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="px-8 py-3 border border-stone-900 bg-stone-900 text-white hover:bg-stone-800 font-light tracking-wide text-sm uppercase transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={!isLoading ? { scale: 1.05 } : {}}
                    whileTap={!isLoading ? { scale: 0.95 } : {}}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border border-white border-t-transparent rounded-full"
                        />
                        Processing...
                      </span>
                    ) : (
                      'Pay with Paystack'
                    )}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="bg-white border border-stone-200 p-8 sticky top-24">
              <h3 className="text-xl font-light tracking-wide text-stone-900 mb-6 uppercase">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-stone-100">
                  <span className="text-stone-600 font-light">
                    Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                  </span>
                  <span className="font-light text-stone-900">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-stone-100">
                  <span className="text-stone-600 font-light">Shipping</span>
                  <span className="font-light text-stone-900">Free</span>
                </div>
                
                <div className="flex justify-between items-center py-4 border-t border-stone-300">
                  <span className="text-lg font-light tracking-wide text-stone-900 uppercase">
                    Total
                  </span>
                  <span className="text-xl font-light text-stone-900">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="text-xs text-stone-500 font-light leading-relaxed">
                <p className="mb-2">
                  • Secure payment powered by Paystack
                </p>
                <p className="mb-2">
                  • Free shipping within Lagos
                </p>
                <p>
                  • 7-day return policy
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;