"use client"
import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"

export default function FadeOnly({ children, className }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 1, ease: "easeOut" }}>
      {children}
    </motion.div>
  )
}
