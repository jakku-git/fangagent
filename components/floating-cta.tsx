"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp, Phone } from "lucide-react"
import ContactDrawer from "@/components/ContactDrawer"

interface FloatingCTAProps {
  language: "en" | "zh"
}

export default function FloatingCTA({ language }: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const content = {
    en: {
      cta: "Get Started",
      backToTop: "Back to Top",
    },
    zh: {
      cta: "开始使用",
      backToTop: "回到顶部",
    },
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3"
    >
      {/* Main CTA Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-2xl rounded-full px-6 py-3 font-semibold"
          onClick={() => setDrawerOpen(true)}
        >
          <Phone className="mr-2 h-4 w-4" />
          {content[language].cta}
        </Button>
      </motion.div>

      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 p-3 rounded-full shadow-lg border border-gray-200 transition-all duration-200"
        title={content[language].backToTop}
      >
        <ArrowUp className="h-5 w-5" />
      </motion.button>

      <ContactDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </motion.div>
  )
}
