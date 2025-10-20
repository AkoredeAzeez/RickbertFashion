import { useState, useEffect, useRef } from 'react'
import { useScroll, useTransform } from 'framer-motion'
import logo from '@/assets/rf.jpg'
import { fetchProducts } from '@/actions/products.action'

import AnimatedCursor from '@/components/landing/AnimatedCursor'
import Hero from '@/components/landing/Hero'
import FeaturedProducts from '@/components/landing/FeaturedProducts'
import Philosophy from '@/components/landing/Philosophy'
import FooterMinimal from '@/components/landing/FooterMinimal'
import { Product } from '@/types'

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll()

  // Advanced parallax effects
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const yText = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetchProducts()
        setProducts(res)
        setLoading(false)
      } catch (error) {
        console.error('Failed to load products:', error)
        setProducts([])
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  // Auto-rotating hero slides
  useEffect(() => {
    const interval = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % 3),
      6000,
    )
    return () => clearInterval(interval)
  }, [])

  const heroSlides = [
    {
      title: 'LUXURY',
      subtitle: 'Artistry meets fashion',
      gradient: 'from-black via-stone-900 to-stone-800',
    },
    {
      title: 'ELEGANCE',
      subtitle: 'Crafted with precision',
      gradient: 'from-stone-900 via-stone-800 to-stone-700',
    },
    {
      title: 'COUTURE',
      subtitle: 'Innovation in every detail',
      gradient: 'from-stone-800 via-stone-700 to-stone-600',
    },
  ]

  return (
    <div className='min-h-screen bg-black text-white overflow-x-hidden'>
      <AnimatedCursor mousePosition={mousePosition} />

      <Hero
        heroRef={heroRef}
        heroSlides={heroSlides}
        currentSlide={currentSlide}
        isInView={true}
        yBg={yBg}
        yText={yText}
        scale={scale}
        mousePosition={mousePosition}
        setCurrentSlide={setCurrentSlide}
        logo={logo}
      />

      <FeaturedProducts
        loading={loading}
        products={products.map((p) => ({
          _id: p.id.toString(),
          name: p.name,
          price: p.price,
          images: p.images.data.map((img) => img.url),
        }))}
      />

      <Philosophy />

      <FooterMinimal />
    </div>
  )
}
