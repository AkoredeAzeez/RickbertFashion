import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Upload from "./pages/Upload.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx"; 
import { CartProvider } from "./state/CartContext.jsx";
import Orders from "./pages/Orders.jsx";
import LandingPage from "./pages/LandingPage.jsx";
export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">RICKBERT-FASHION</Link>
            <div className="space-x-4">
              <Link to="/home" className="hover:underline">Shop</Link>
              <Link to="/cart" className="hover:underline">Cart</Link>
              <Link to="/checkout" className="hover:underline">Checkout</Link>
              <Link to="/upload" className="hover:underline">Upload</Link>
              <Link to="/orders" className="hover:underline">Orders</Link>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<LandingPage />}/>
            <Route path="/home" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/orders" element={<Orders />} /> {/* ✅ FIXED */}
          </Routes>
        </main>

        <footer className="py-10 text-center text-sm text-gray-500">
          RICKBERTFASHION
        </footer>
      </div>
    </CartProvider>
  );
}
