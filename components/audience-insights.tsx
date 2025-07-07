"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Eye, Users, Clock, Star } from "lucide-react"

interface AudienceInsightsProps {
  language: "en" | "zh"
}

export default function AudienceInsights({ language }: AudienceInsightsProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const [impressions, setImpressions] = useState(0)
  const [buyers, setBuyers] = useState(0)
  const [readyToBuy, setReadyToBuy] = useState(0)

  const content = {
    en: {
      title: "Why Chinese Buyers Matter",
      subtitle: "Tap into a market that drives over 20% of Australia's property transactions. Our platform connects you with high-intent, qualified Chinese buyers—no middlemen, no barriers.",
      stats: [
        {
          icon: Eye,
          value: "3.4M+",
          label: "Audience Size",
          description: "Across FANG.COM.AU, SydneyToday, UMall, WeChat, REDBook",
        },
        {
          icon: Users,
          value: "#1",
          label: "Largest Chinese Real Estate Audience",
          description: "Australia's entire Chinese population, local & overseas",
        },
        {
          icon: Users,
          value: "80%",
          label: "Local Audience (NSW, VIC, QLD)",
          description: "Australia's most active Chinese property buyers",
        },
        {
          icon: Clock,
          value: "70%",
          label: "Buying Within 12 Months",
          description: "High-intent, ready-to-purchase users",
        },
        {
          icon: Eye,
          value: "3x",
          label: "Higher Time on Listings",
          description: "1.7 min avg. per listing (3x industry avg)",
        },
        {
          icon: Star,
          value: "Premium",
          label: "Buyer Quality",
          description: "Preferred by agents for luxury & premium sales",
        },
      ],
    },
    zh: {
      title: "中国买家为何重要",
      subtitle: "中国买家占澳洲房产交易的20%以上。Fang.com.au 让您直连高意向买家，省去中间环节，提升成交效率。",
      stats: [
        {
          icon: Eye,
          value: "3.4M+",
          label: "受众规模",
          description: "覆盖FANG.COM.AU、今日悉尼、UMall、微信、小红书",
        },
        {
          icon: Users,
          value: "#1",
          label: "最大华人房产受众",
          description: "覆盖全澳华人本地及海外买家",
        },
        {
          icon: Users,
          value: "80%",
          label: "本地用户（新州、维州、昆州）",
          description: "澳洲最活跃的华人购房群体",
        },
        {
          icon: Clock,
          value: "70%",
          label: "12个月内购房",
          description: "高意向、准备购买的用户",
        },
        {
          icon: Eye,
          value: "3倍",
          label: "更高房源停留时长",
          description: "单房源平均1.7分钟（行业3倍）",
        },
        {
          icon: Star,
          value: "高端",
          label: "买家质量",
          description: "高端/豪宅首选平台，深受经纪人信赖",
        },
      ],
    },
  }

  // Animated counters
  useEffect(() => {
    if (isInView) {
      const timer1 = setTimeout(() => {
        let count = 0
        const interval = setInterval(() => {
          count += 100000
          setImpressions(count)
          if (count >= 3400000) {
            clearInterval(interval)
            setImpressions(3400000)
          }
        }, 50)
      }, 500)

      const timer2 = setTimeout(() => {
        let count = 0
        const interval = setInterval(() => {
          count += 2
          setBuyers(count)
          if (count >= 80) {
            clearInterval(interval)
            setBuyers(80)
          }
        }, 50)
      }, 800)

      const timer3 = setTimeout(() => {
        let count = 0
        const interval = setInterval(() => {
          count += 2
          setReadyToBuy(count)
          if (count >= 70) {
            clearInterval(interval)
            setReadyToBuy(70)
          }
        }, 50)
      }, 1100)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
      }
    }
  }, [isInView])

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold mb-4 sm:mb-6 tracking-tight drop-shadow-xl font-sans">{content[language].title}</h2>
          <p className="text-base sm:text-2xl text-blue-100 max-w-xl sm:max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg font-sans">{content[language].subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {content[language].stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="text-center group flex-1 min-h-[260px] sm:min-h-[370px] flex flex-col justify-between"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 h-full flex flex-col justify-between">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                  className="bg-gradient-to-r from-white/80 to-white p-3 sm:p-4 rounded-full w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-4 sm:mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                >
                  <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-900" />
                </motion.div>

                <motion.div
                  className="text-2xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-white/90 to-white bg-clip-text text-transparent"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
                >
                  {index === 0
                    ? language === "en"
                      ? `${(impressions / 1000000).toFixed(1)}M+`
                      : `${(impressions / 1000000).toFixed(1)}M+`
                    : index === 2
                      ? `${buyers}%`
                      : index === 3
                        ? `${readyToBuy}%`
                        : stat.value}
                </motion.div>
                <div className="text-xs sm:text-base font-semibold mb-1 sm:mb-2">{stat.label}</div>
                <div className="text-xs sm:text-sm text-blue-100/80">{stat.description}</div>

                {/* Progress Bar */}
                <motion.div
                  className="mt-6 h-2 bg-white/20 rounded-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.2 + 0.7 }}
                >
                  <motion.div
                    className="h-full bg-blue-400/70 rounded-full"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: (index === 2 ? `${buyers}%` : index === 3 ? `${readyToBuy}%` : "100%") } : {}}
                    transition={{ duration: 2, delay: index * 0.2 + 1 }}
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
