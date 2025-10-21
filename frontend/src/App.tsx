import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Upload from './pages/Upload'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import PaymentSuccess from './pages/PaymentSuccess'
import { CartProvider } from './state/CartContext'
import Orders from './pages/Orders'
import LandingPage from './pages/LandingPage'

export default function App() {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  // Define which pages have dark backgrounds
  // Note: checkout should use a light/nav-friendly background so navbar text is dark
  const darkBackgroundPages = ['/payment-success']
  const isDarkPage = darkBackgroundPages.includes(location.pathname)

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close nav when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isNavOpen) {
        setIsNavOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isNavOpen])

  const toggleNav = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsNavOpen(!isNavOpen)
  }

  const navItems = [
    { to: '/home', label: 'Shop' },
    { to: '/cart', label: 'Cart' },
    { to: '/checkout', label: 'Checkout' },
    { to: '/upload', label: 'Upload' },
    { to: '/orders', label: 'Orders' },
  ]

  // Determine text color based on scroll state and page background
  const getTextColor = () => {
    if (isScrolled) {
      // When scrolled, always use dark text on the white/transparent nav
      return 'text-stone-900'
    } else {
      // When not scrolled, use white text on dark pages, dark text on light pages
      return isDarkPage ? 'text-white' : 'text-stone-900'
    }
  }

  const getHoverTextColor = () => {
    if (isScrolled) {
      return 'hover:text-stone-600'
    } else {
      return isDarkPage ? 'hover:text-stone-300' : 'hover:text-stone-600'
    }
  }

  return (
    <ToastProvider>
      <CartProvider>
        <div className='min-h-screen bg-stone-50'>
          {/* Navigation */}
          <motion.nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
              isScrolled
                ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200'
                : 'bg-transparent'
            }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className='max-w-7xl mx-auto px-4 py-4 flex justify-between items-center'>
              {/* Logo */}
              <Link
                to='/'
                className={`text-base md:text-lg font-light tracking-wide transition-colors duration-300 ${getTextColor()}`}
                style={{
                  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                }}
              >
                RICKBERT FASHION
              </Link>

              {/* Navigation Links - Visible when not scrolled (Desktop only) */}
              <AnimatePresence>
                {!isScrolled && (
                  <motion.div
                    className='hidden md:flex items-center justify-center w-full space-x-16'
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.to}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <Link
                          to={item.to}
                          className={`font-light tracking-wide transition-colors duration-300 text-sm uppercase ${getTextColor()} ${getHoverTextColor()}`}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Desktop Hamburger - Visible when scrolled */}
              <AnimatePresence>
                {isScrolled && (
                  <motion.div
                    className='hidden md:block'
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.button
                      onClick={toggleNav}
                      className={`p-2 transition-colors duration-300 ${getTextColor()} ${getHoverTextColor()}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className='flex flex-col space-y-1'>
                        <motion.div
                          className='w-6 h-0.5 bg-current origin-center transition-transform duration-300'
                          animate={
                            isNavOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }
                          }
                        />
                        <motion.div
                          className='w-6 h-0.5 bg-current transition-opacity duration-300'
                          animate={isNavOpen ? { opacity: 0 } : { opacity: 1 }}
                        />
                        <motion.div
                          className='w-6 h-0.5 bg-current origin-center transition-transform duration-300'
                          animate={
                            isNavOpen
                              ? { rotate: -45, y: -6 }
                              : { rotate: 0, y: 0 }
                          }
                        />
                      </div>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mobile hamburger - Always visible on mobile */}
              <div className='md:hidden'>
                <motion.button
                  onClick={toggleNav}
                  className={`p-2 transition-colors duration-300 ${getTextColor()} ${getHoverTextColor()}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className='flex flex-col space-y-1'>
                    <motion.div
                      className='w-5 h-0.5 bg-current origin-center transition-transform duration-300'
                      animate={
                        isNavOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }
                      }
                    />
                    <motion.div
                      className='w-5 h-0.5 bg-current transition-opacity duration-300'
                      animate={isNavOpen ? { opacity: 0 } : { opacity: 1 }}
                    />
                    <motion.div
                      className='w-5 h-0.5 bg-current origin-center transition-transform duration-300'
                      animate={
                        isNavOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }
                      }
                    />
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Collapsible Navigation Menu */}
            <AnimatePresence>
              {isNavOpen && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    className='fixed inset-0 bg-black/20 backdrop-blur-sm'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setIsNavOpen(false)}
                  />

                  {/* Navigation Menu */}
                  <motion.div
                    className='absolute top-full left-0 right-0 bg-white border-b border-stone-200 shadow-lg'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className='max-w-7xl mx-auto px-4 py-6'>
                      <div className='flex flex-col md:flex-row md:justify-center space-y-4 md:space-y-0 md:space-x-12'>
                        {navItems.map((item, index) => (
                          <motion.div
                            key={item.to}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                          >
                            <Link
                              to={item.to}
                              className='block text-stone-900 hover:text-stone-600 font-light tracking-wide transition-colors duration-300 text-sm uppercase py-2'
                              onClick={() => setIsNavOpen(false)}
                            >
                              {item.label}
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.nav>

          {/* Main content with proper spacing for fixed nav */}
          <main className='relative'>
            <Routes>
              <Route path='/' element={<LandingPage />} />
              <Route
                path='/home'
                element={
                  <div className='pt-20'>
                    <Home />
                  </div>
                }
              />
              <Route
                path='/product/:id'
                element={
                  <div className='pt-20'>
                    <ProductDetail />
                  </div>
                }
              />
              <Route
                path='/cart'
                element={
                  <div className='pt-20'>
                    <Cart />
                  </div>
                }
              />
              <Route
                path='/checkout'
                element={
                  <div className='pt-20'>
                    <Checkout />
                  </div>
                }
              />
              <Route
                path='/payment-success'
                element={
                  <div className='pt-20'>
                    <PaymentSuccess />
                  </div>
                }
              />
              <Route
                path='/upload'
                element={
                  <div className='pt-20'>
                    <Upload />
                  </div>
                }
              />
              <Route
                path='/orders'
                element={
                  <div className='pt-20'>
                    <Orders />
                  </div>
                }
              />
            </Routes>
          </main>

          {/* Enhanced Footer */}
          <footer className='bg-black text-white'>
            <div className='max-w-7xl mx-auto px-6 py-16'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
                {/* Brand Section */}
                <div className='lg:col-span-2'>
                  <motion.h3
                    className='text-2xl font-thin tracking-wider mb-6'
                    style={{
                      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    RICKBERT FASHION
                  </motion.h3>
                  <motion.p
                    className='text-stone-300 font-light leading-relaxed mb-8 max-w-md'
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    Discover timeless pieces crafted for the modern wardrobe.
                    Quality fashion that speaks to your individual style.
                  </motion.p>

                  {/* Newsletter Signup */}
                  <motion.div
                    className='max-w-md'
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <h4 className='text-sm font-light tracking-wide uppercase mb-4'>
                      Stay Updated
                    </h4>
                    <div className='flex'>
                      <input
                        type='email'
                        placeholder='Enter your email'
                        className='flex-1 px-4 py-3 bg-stone-800 border border-stone-700 focus:border-white focus:outline-none text-white placeholder-stone-400 font-light text-sm'
                      />
                      <motion.button
                        className='px-6 py-3 bg-white text-black hover:bg-stone-200 transition-colors duration-300 font-light text-sm tracking-wide uppercase'
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Subscribe
                      </motion.button>
                    </div>
                  </motion.div>
                </div>

                {/* Quick Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <h4 className='text-sm font-light tracking-wide uppercase mb-6'>
                    Quick Links
                  </h4>
                  <div className='space-y-4'>
                    {navItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className='block text-stone-300 hover:text-white transition-colors duration-300 font-light text-sm'
                      >
                        {item.label}
                      </Link>
                    ))}
                    <Link
                      to='/about'
                      className='block text-stone-300 hover:text-white transition-colors duration-300 font-light text-sm'
                    >
                      About Us
                    </Link>
                    <Link
                      to='/contact'
                      className='block text-stone-300 hover:text-white transition-colors duration-300 font-light text-sm'
                    >
                      Contact
                    </Link>
                  </div>
                </motion.div>

                {/* Customer Care & Social */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <h4 className='text-sm font-light tracking-wide uppercase mb-6'>
                    Customer Care
                  </h4>
                  <div className='space-y-4 mb-8'>
                    <p className='text-stone-300 font-light text-sm'>
                      support@rickbertfashion.com
                    </p>
                    <p className='text-stone-300 font-light text-sm'>
                      +234 (0) 123 456 7890
                    </p>
                    <p className='text-stone-300 font-light text-sm'>
                      Mon - Fri: 9AM - 6PM WAT
                    </p>
                  </div>

                  {/* Social Media Links */}
                  <div>
                    <h4 className='text-sm font-light tracking-wide uppercase mb-4'>
                      Follow Us
                    </h4>
                    <div className='flex space-x-4'>
                      {/* Instagram */}
                      <motion.a
                        href='#'
                        className='w-10 h-10 bg-stone-800 hover:bg-stone-700 flex items-center justify-center transition-colors duration-300'
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg
                          className='w-5 h-5'
                          fill='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
                        </svg>
                      </motion.a>
                      {/* ...existing code... */}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Bottom Bar */}
              <motion.div
                className='border-t border-stone-800 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <p className='text-stone-400 text-sm font-light'>
                  © 2024 Rickbert Fashion. All rights reserved.
                </p>
                <div className='flex space-x-6'>
                  <Link
                    to='/privacy'
                    className='text-stone-400 hover:text-white text-sm font-light transition-colors duration-300'
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    to='/terms'
                    className='text-stone-400 hover:text-white text-sm font-light transition-colors duration-300'
                  >
                    Terms of Service
                  </Link>
                  <Link
                    to='/returns'
                    className='text-stone-400 hover:text-white text-sm font-light transition-colors duration-300'
                  >
                    Returns
                  </Link>
                </div>
              </motion.div>
            </div>
          </footer>
        </div>
      </CartProvider>
    </ToastProvider>
  )
}
