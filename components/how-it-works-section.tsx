"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Upload, Edit, Rocket, Zap, Users } from "lucide-react"

interface HowItWorksSectionProps {
  language: "en" | "zh"
}

export default function HowItWorksSection({ language }: HowItWorksSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const content = {
    en: {
      title: "How It Works",
      subtitle: "From Listing to Leads—Effortlessly, in 5 Steps",
      steps: [
        {
          icon: Upload,
          title: "Submit Your Listing",
          description: "Connect your CRM or upload property details in seconds—photos, features, and more.",
        },
        {
          icon: Edit,
          title: "We Localise Content",
          description: "Our experts craft culturally resonant Chinese content that truly connects.",
        },
        {
          icon: Rocket,
          title: "Go Live Across Channels",
          description: "Your listing appears on FANG.COM.AU and is instantly syndicated to top Chinese platforms.",
        },
        {
          icon: Zap,
          title: "Boost for Maximum Impact",
          description: "Supercharge your reach with targeted campaigns on WeChat, Xiaohongshu, and SydneyToday.",
        },
        {
          icon: Users,
          title: "Leads Delivered Directly",
          description: "Receive qualified inquiries straight to your inbox—no delays, no dilution.",
        },
      ],
    },
    zh: {
      title: "工作流程",
      subtitle: "5步轻松获客，快速成交",
      steps: [
        {
          icon: Upload,
          title: "提交房源",
          description: "一键上传房产信息，照片与亮点，或对接CRM系统。",
        },
        {
          icon: Edit,
          title: "内容本地化",
          description: "专业团队撰写地道中文内容，精准打动买家。",
        },
        {
          icon: Rocket,
          title: "多平台同步上线",
          description: "房源同步至FANG.COM.AU及主流中文平台，全面曝光。",
        },
        {
          icon: Zap,
          title: "推广加持",
          description: "定向投放微信、小红书、今日悉尼等，提升转化。",
        },
        {
          icon: Users,
          title: "线索直达",
          description: "合格买家咨询直达，无中间环节，快速响应。",
        },
      ],
    },
  }

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-5xl md:text-7xl font-extrabold text-gray-900 mb-4 sm:mb-6 tracking-tight drop-shadow-xl font-sans">{content[language].title}</h2>
          <p className="text-base sm:text-2xl text-gray-600 max-w-xl sm:max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg font-sans">{content[language].subtitle}</p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-600 via-blue-500 to-white hidden md:block" />

          <div className="space-y-8 sm:space-y-16">
            {content[language].steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`flex flex-col md:flex-row ${index % 2 === 0 ? '' : 'md:flex-row-reverse'} md:gap-16 gap-6 sm:gap-8 items-center`}
              >
                {/* Content */}
                <div className="flex-1 max-w-full md:max-w-lg">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-white to-gray-50 p-5 sm:p-8 rounded-2xl shadow-lg border border-gray-100"
                  >
                    <div className="flex items-center mb-2 sm:mb-4">
                      {index === 2 ? (
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 sm:p-3 rounded-full mr-2 sm:mr-4">
                          <img
                            src="/hero.png"
                            alt="Step 3"
                            className="h-5 w-5 sm:h-6 sm:w-6 object-contain"
                            style={{ filter: "brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) contrast(100%)" }}
                          />
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 sm:p-3 rounded-full mr-2 sm:mr-4">
                          <step.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                      )}
                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                        Step {index + 1}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-3">{step.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{step.description}</p>
                  </motion.div>
                </div>

                {/* Timeline Node */}
                <div className="relative z-10 hidden md:block">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                    className="w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <span className="text-white font-bold text-base sm:text-lg">{index + 1}</span>
                  </motion.div>
                </div>

                {/* Illustration */}
                <div className="flex-1 max-w-full md:max-w-lg">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8, delay: index * 0.2 + 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 sm:p-8 rounded-2xl"
                  >
                    <div className="w-full h-32 sm:h-48 bg-gradient-to-br from-blue-200 to-blue-300 rounded-lg flex items-center justify-center">
                      <step.icon className="h-10 w-10 sm:h-16 sm:w-16 text-blue-600" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
