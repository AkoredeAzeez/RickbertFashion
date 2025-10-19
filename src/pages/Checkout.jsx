import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProgressStepper from "../components/checkout/ProgressStepper";
import PersonalInfo from "../components/checkout/PersonalInfo";
import ShippingInfo from "../components/checkout/ShippingInfo";
import ReviewOrder from "../components/checkout/ReviewOrder";
import EmptyCheckout from "../components/checkout/EmptyCheckout";
import OrderSummary from "../components/checkout/OrderSummary";
import CheckoutActions from "../components/checkout/CheckoutActions";
import "../styles/checkout.css";
import { fadeUp, cardVariant, headerVariant} from "../styles/animations";

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

  if (!cartItems.length) return <EmptyCheckout onContinue={() => navigate('/home')} />;

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div className="text-center mb-16" initial="hidden" animate="show" variants={headerVariant}>
          <h1 className="text-3xl md:text-4xl font-light tracking-wide text-stone-900 mb-4">
            CHECKOUT
          </h1>
          <div className="w-20 h-0.5 bg-stone-400 mx-auto" />
        </motion.div>

        {/* Progress Steps */}
        <motion.div className="flex justify-center mb-12" initial="hidden" animate="show" variants={fadeUp}>
          <ProgressStepper steps={steps} currentStep={currentStep} />
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
                    <motion.div key="step1" variants={cardVariant} initial="hidden" animate="show" exit="exit" className="space-y-6">
                      <PersonalInfo formData={formData} errors={errors} handleChange={handleChange} />
                    </motion.div>
                  )}

                {currentStep === 2 && (
                  <motion.div key="step2" variants={cardVariant} initial="hidden" animate="show" exit="exit" className="space-y-6">
                    <ShippingInfo formData={formData} errors={errors} handleChange={handleChange} />
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div key="step3" variants={cardVariant} initial="hidden" animate="show" exit="exit" className="space-y-6">
                    <ReviewOrder cartItems={cartItems} />
                  </motion.div>
                )}
              </AnimatePresence>

              <CheckoutActions
                currentStep={currentStep}
                handlePrevStep={handlePrevStep}
                handleNextStep={handleNextStep}
                handleCheckout={handleCheckout}
                isLoading={isLoading}
              />
            </motion.div>
          </div>

          {/* Order Summary */}
          <OrderSummary cartItems={cartItems} total={total} />
        </div>
      </div>
    </div>
  );
};

export default Checkout;