"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, Calendar, ArrowRight } from "lucide-react"

interface FinalCTAProps {
  language: "en" | "zh"
}

export default function FinalCTA({ language }: FinalCTAProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    agency: "",
  })

  const content = {
    en: {
      title: "Ready to Reach More Buyers?",
      subtitle: "Start your journey to more leads, more exposure, and faster sales. Let's get your listings in front of the right audience—today.",
      cta: "Get Started Now",
      form: {
        name: "Full Name",
        email: "Email Address",
        agency: "Agency Name",
        upload: "Upload Your Property",
        schedule: "Schedule a Call",
      },
    },
    zh: {
      title: "准备好触达更多买家了吗？",
      subtitle: "开启高效获客之旅，让您的房源直达目标买家。现在就行动！",
      cta: "立即开始",
      form: {
        name: "全名",
        email: "电子邮件地址",
        agency: "机构名称",
        upload: "上传房源",
        schedule: "安排通话",
      },
    },
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <section
      ref={ref}
      className="py-16 sm:py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.img
          src="/hero.png"
          alt="Fang Logo"
          className="absolute top-8 left-4 sm:top-20 sm:left-20 w-32 h-32 sm:w-64 sm:h-64 opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.img
          src="/hero.png"
          alt="Fang Logo"
          className="absolute bottom-8 right-4 sm:bottom-20 sm:right-20 w-24 h-24 sm:w-48 sm:h-48 opacity-10"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-5xl md:text-7xl font-extrabold mb-3 sm:mb-6 tracking-tight drop-shadow-xl font-sans">{content[language].title}</h2>
          <p className="text-base sm:text-2xl text-blue-100 max-w-xs sm:max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg font-sans">{content[language].subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-3xl p-4 sm:p-8 border border-white/20"
          >
            <h3 className="text-xl sm:text-3xl font-extrabold mb-4 sm:mb-8 text-center tracking-tight font-sans">{content[language].cta}</h3>

            <div className="space-y-3 sm:space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Input
                  placeholder={content[language].form.name}
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30 text-base sm:text-lg py-3 sm:py-4"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Input
                  type="email"
                  placeholder={content[language].form.email}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30 text-base sm:text-lg py-3 sm:py-4"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Input
                  placeholder={content[language].form.agency}
                  value={formData.agency}
                  onChange={(e) => handleInputChange("agency", e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30 text-base sm:text-lg py-3 sm:py-4"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button className="w-full bg-gradient-to-r from-white to-white hover:from-white hover:to-white text-blue-900 font-semibold py-3 sm:py-4 text-base sm:text-lg rounded-full">
                  {content[language].cta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Action Buttons Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4 sm:space-y-8 mt-8 lg:mt-0"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-white/20 cursor-pointer group"
            >
              <div className="flex items-center mb-2 sm:mb-4">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 sm:p-4 rounded-full mr-2 sm:mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h4 className="text-lg sm:text-2xl font-extrabold tracking-tight font-sans">{content[language].form.upload}</h4>
              </div>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                {language === "en"
                  ? "Start with your best property and see the Chinese market response immediately."
                  : "从您最优质的房产开始，立即感受中国市场的热度。"}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-white/20 cursor-pointer group"
            >
              <div className="flex items-center mb-2 sm:mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 sm:p-4 rounded-full mr-2 sm:mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h4 className="text-lg sm:text-2xl font-extrabold tracking-tight font-sans">{content[language].form.schedule}</h4>
              </div>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                {language === "en"
                  ? "Speak with our Chinese market experts about your specific needs and goals."
                  : "与我们的中国市场专家讨论您的具体需求和目标。"}
              </p>
            </motion.div>

            {/* Glowing Effect */}
            <motion.div
              className="text-center"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <div className="inline-block bg-gradient-to-r from-white to-white bg-clip-text text-transparent font-semibold">
                {language === "en" ? "Access the largest Chinese buyer's audience network today." : "✨ 优质中国市场曝光等待着您"}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
