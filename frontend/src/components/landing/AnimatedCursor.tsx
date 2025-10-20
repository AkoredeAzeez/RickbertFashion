import { motion } from 'framer-motion'

export default function AnimatedCursor({
  mousePosition,
}: {
  mousePosition: { x: number; y: number }
}) {
  return (
    <motion.div
      className='fixed w-4 h-4 bg-white rounded-full pointer-events-none z-50 mix-blend-difference'
      style={{ left: mousePosition.x - 8, top: mousePosition.y - 8 }}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  )
}
