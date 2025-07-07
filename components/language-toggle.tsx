"use client"

import { motion } from "framer-motion"
import { Globe } from "lucide-react"

interface LanguageToggleProps {
  language: "en" | "zh"
  setLanguage: (lang: "en" | "zh") => void
}

export default function LanguageToggle({ language, setLanguage }: LanguageToggleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-6 right-6 z-50"
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg border border-gray-200">
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-gray-600" />
          <button
            onClick={() => setLanguage("en")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
              language === "en" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("zh")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
              language === "zh" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            中文
          </button>
        </div>
      </div>
    </motion.div>
  )
}
