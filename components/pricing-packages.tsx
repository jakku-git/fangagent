"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Star, Crown } from "lucide-react"
import ContactDrawer from "@/components/ContactDrawer"

interface PricingPackagesProps {
  language: "en" | "zh"
}

export default function PricingPackages({ language }: PricingPackagesProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [drawerOpen, setDrawerOpen] = useState(false)

  const content = {
    en: {
      title: "Smart Pricing. Serious Exposure.",
      subtitle: "Choose a plan designed to amplify your listings and unlock the Chinese market.",
      packages: [
        {
          name: "Essential",
          price: "$350",
          icon: Check,
          color: "from-blue-600 to-blue-700",
          popular: false,
          features: [
            "FANG.COM.AU Page & App Listing",
            "Automated Chinese Translation",
            "1x SydneyToday Post",
            "1x Standard REDBook Post",
            "List Until Sold",
          ],
          cta: "Get Started",
          description: "Everything you need to get started—reach Chinese buyers with ease.",
        },
        {
          name: "Signature",
          price: "$750",
          icon: Star,
          color: "from-purple-600 to-purple-700",
          popular: true,
          features: [
            "Premium Page & App Listing",
            "Professional Chinese Copywriting",
            "App Push Notification",
            "2x SydneyToday Posts",
            "1x WeChat Official Account Post (2nd Position)",
            "2x REDBook Posts",
            "Members-Only Newsletter",
          ],
          cta: "Most Popular",
          description: "Our most popular plan—premium exposure, professional copywriting, and more.",
        },
        {
          name: "Prestige",
          price: "$1,250",
          icon: Crown,
          color: "from-white to-white",
          popular: false,
          features: [
            "Multi-Channel Campaign",
            "Headline Highlighted Property Listing",
            "WeChat Official Account Post (1st Position)",
            "2x Premium App Push Notifications",
            "3x REDBook Posts",
            "REDBook & WeChat Chinese Walk-through Video",
            "Dedicated Account Manager",
            "Maximum Reach",
            "Ongoing Support",
          ],
          cta: "Request a Call",
          description: "Maximum impact—multi-channel campaigns, video, and dedicated support.",
        },
      ],
      sectionIntro: "Unlock the Chinese market with a plan tailored to your goals.",
    },
    zh: {
      title: "多样套餐，满足不同需求",
      subtitle: "选择最适合您的推广方案，全面打开中国市场。",
      packages: [
        {
          name: "基础版",
          price: "$350",
          icon: Check,
          color: "from-blue-600 to-blue-700",
          popular: false,
          features: [
            "FANG.COM.AU 页面及App房源展示",
            "自动中文翻译",
            "1次今日悉尼推文",
            "1次标准小红书推文",
            "售出前持续展示",
          ],
          cta: "立即开始",
          description: "入门首选，轻松接触中国买家。",
        },
        {
          name: "标准版",
          price: "$750",
          icon: Star,
          color: "from-purple-600 to-purple-700",
          popular: true,
          features: [
            "优质页面及App房源展示",
            "专业中文文案撰写",
            "App推送通知",
            "2次今日悉尼推文",
            "1次微信官方账号推文（第二位）",
            "2次小红书推文",
            "会员专属简报",
          ],
          cta: "最受欢迎",
          description: "最受欢迎，优质曝光与专业文案。",
        },
        {
          name: "尊享版",
          price: "$1,250",
          icon: Crown,
          color: "from-white to-white",
          popular: false,
          features: [
            "多渠道整合推广",
            "头条高亮房源展示",
            "微信官方账号推文（第一位）",
            "2次高级App推送通知",
            "3次小红书推文",
            "小红书&微信中文视频讲解",
            "专属客户经理",
            "最大化曝光",
            "持续支持",
          ],
          cta: "预约咨询",
          description: "全方位推广，视频展示，专属服务。",
        },
      ],
      sectionIntro: "量身定制推广方案，助您高效触达中国买家。",
    },
  }

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-gradient-to-br from-blue-50/60 to-white/80 min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-5xl md:text-7xl font-extrabold text-gray-900 mb-4 sm:mb-6 tracking-tight drop-shadow-xl font-sans">{content[language].title}</h2>
          <p className="text-base sm:text-2xl text-blue-900/80 max-w-xl sm:max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-lg font-sans">{content[language].sectionIntro}</p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {content[language].packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + index * 0.1 }}
              whileHover={{ scale: 1.04, boxShadow: '0 8px 32px #3b82f633' }}
              className={`relative bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border-2 flex flex-col items-center px-4 sm:px-8 py-8 sm:py-12 transition-all duration-500 ${
                pkg.popular ? "border-blue-700 ring-4 ring-blue-600/20 z-10 scale-105 md:scale-110 md:-mt-8" : "border-gray-200"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-700 to-blue-500 text-white text-center px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base font-bold rounded-full shadow-lg z-20">
                  Most Popular
                </div>
              )}
              {index === 1 ? (
                <div className="flex items-center justify-center gap-4 sm:gap-6 mb-5 sm:mb-7">
                  <motion.div
                    className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-full w-20 h-20 flex items-center justify-center shadow-lg overflow-hidden"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.7 }}
                  >
                    <img src="/redbook.png" alt="Xiaohongshu" className="w-full h-full object-cover rounded-full" />
                  </motion.div>
                  <motion.div
                    className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-full w-20 h-20 flex items-center justify-center shadow-lg overflow-hidden"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.7 }}
                  >
                    <img src="/wechat.png" alt="WeChat" className="w-full h-full object-cover rounded-full" />
                  </motion.div>
                </div>
              ) : index === 2 ? (
                <div className="flex items-center justify-center gap-2 sm:gap-4 mb-5 sm:mb-7">
                  <motion.div
                    className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-full w-16 h-16 flex items-center justify-center shadow-lg overflow-hidden"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.7 }}
                  >
                    <img src="/hero.png" alt="Fang" className="w-full h-full object-cover rounded-full" style={{ filter: 'brightness(0) invert(1)' }} />
                  </motion.div>
                  <motion.div
                    className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-full w-16 h-16 flex items-center justify-center shadow-lg overflow-hidden"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.7 }}
                  >
                    <img src="/today.png" alt="SydneyToday" className="w-full h-full object-cover rounded-full" />
                  </motion.div>
                  <motion.div
                    className="bg-gradient-to-r from-green-600 to-green-700 rounded-full w-16 h-16 flex items-center justify-center shadow-lg overflow-hidden"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.7 }}
                  >
                    <img src="/wechat.png" alt="WeChat" className="w-full h-full object-cover rounded-full" />
                  </motion.div>
                  <motion.div
                    className="bg-gradient-to-r from-pink-500 to-pink-700 rounded-full w-16 h-16 flex items-center justify-center shadow-lg overflow-hidden"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.7 }}
                  >
                    <img src="/redbook.png" alt="Xiaohongshu" className="w-full h-full object-cover rounded-full" />
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  className={`bg-gradient-to-r ${pkg.color} p-4 sm:p-5 rounded-full w-16 sm:w-20 h-16 sm:h-20 mb-5 sm:mb-7 flex items-center justify-center shadow-lg`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.7 }}
                >
                  {index === 0 ? (
                    <img src="/hero.png" alt="Essential" className="h-8 sm:h-10 w-8 sm:w-10 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
                  ) : (
                    <pkg.icon className="h-8 sm:h-10 w-8 sm:w-10 text-white" />
                  )}
                </motion.div>
              )}
              {/* Price */}
              <div className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-blue-900 mb-1 sm:mb-2 tracking-tight drop-shadow-sm">{pkg.price}</div>
              <div className="text-base sm:text-lg text-blue-900/80 mb-1 sm:mb-2 font-semibold">{pkg.name}</div>
              {/* Persuasive blurb */}
              <div className="text-sm sm:text-base text-blue-900/70 mb-4 sm:mb-6 text-center font-medium">
                {pkg.description}
              </div>
              {/* Features */}
              <ul className="space-y-2 sm:space-y-4 mb-6 sm:mb-8 w-full max-w-xs mx-auto">
                {pkg.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                    className="flex items-center gap-2 sm:gap-3 text-blue-900/90 text-sm sm:text-base"
                  >
                    <motion.span
                      className="inline-flex items-center justify-center w-5 sm:w-6 h-5 sm:h-6 min-w-5 sm:min-w-6 min-h-5 sm:min-h-6 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 text-white shadow flex-shrink-0 flex-grow-0"
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                    >
                      <Check className="w-3.5 sm:w-4 h-3.5 sm:h-4 flex-shrink-0 flex-grow-0" />
                    </motion.span>
                    {feature}
                  </motion.li>
                ))}
              </ul>
              {/* CTA Button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.04, backgroundColor: '#2563eb', color: '#fff' }}
                className={`w-full py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg transition-all duration-300 bg-blue-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-900/40 ${pkg.popular ? 'ring-2 ring-blue-600/30' : ''}`}
                style={{ letterSpacing: 1 }}
                onClick={() => setDrawerOpen(true)}
              >
                {pkg.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
      <ContactDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </section>
  )
}
