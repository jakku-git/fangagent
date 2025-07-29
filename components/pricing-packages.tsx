"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Star, Crown, X, ArrowRight, Play } from "lucide-react"
import ContactDrawer from "@/components/ContactDrawer"

interface PricingPackagesProps {
  language: "en" | "zh"
}

interface TierDetails {
  name: string
  price: string
  description: string
  features: string[]
  highlights: string[]
  examples: string[]
  icon: any
  color: string
}

export default function PricingPackages({ language }: PricingPackagesProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTier, setSelectedTier] = useState<TierDetails | null>(null)

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
            "FANG Web Page & App Listing",
            "Professional Chinese Copywriting",
            "WeChat Official Account EDM (1)",
            "REDBook Social Media Post (1)",
            "Weekly Listing Performance Report",
            "Cross-Channel Listing (SydneyToday)",
          ],
          cta: "Get Started",
          description: "Everything you need to get started—reach Chinese buyers with ease.",
        },
        {
          name: "Signature",
          price: "$800",
          icon: Star,
          color: "from-purple-600 to-purple-700",
          popular: true,
          features: [
            "Everything in the Essential Package",
            "App Push Notification",
            "SydneyToday Posts (2)",
            "WeChat Official Account Post (1)",
            "REDBook Posts (2)",
            "Multi-Channel Social Media Campaign",
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
            "Everything in the Signature Package",
            "Headline Highlighted Property Listing",
            "WeChat Official Account Headline Post",
            "Premium App Push Notifications (2)",
            "REDBook Posts (3)",
            "FANG.COM.AU Essential Video",
            "Dedicated Account Manager",
            "Maximum Exposure",
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
            "FANG 网页及App房源展示",
            "专业中文文案撰写",
            "微信官方账号邮件营销 (1)",
            "小红书社交媒体推文 (1)",
            "每周房源表现报告",
            "跨渠道房源展示 (今日悉尼)",
          ],
          cta: "立即开始",
          description: "入门首选，轻松接触中国买家。",
        },
        {
          name: "标准版",
          price: "$800",
          icon: Star,
          color: "from-purple-600 to-purple-700",
          popular: true,
          features: [
            "包含基础版所有功能",
            "App推送通知",
            "今日悉尼推文 (2)",
            "微信官方账号推文 (1)",
            "小红书推文 (2)",
            "多渠道社交媒体推广",
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
            "包含标准版所有功能",
            "头条高亮房源展示",
            "微信官方账号头条推文",
            "高级App推送通知 (2)",
            "小红书推文 (3)",
            "FANG.COM.AU 基础视频",
            "专属客户经理",
            "最大化曝光",
          ],
          cta: "预约咨询",
          description: "全方位推广，视频展示，专属服务。",
        },
      ],
      sectionIntro: "量身定制推广方案，助您高效触达中国买家。",
    },
  }

  const tierDetails: { [key: string]: TierDetails } = {
    Essential: {
      name: "Essential",
      price: "$350",
      description: "Perfect for first-time sellers looking to tap into the Chinese market with essential exposure.",
      features: [
        "Professional FANG.COM.AU listing with Chinese translation",
        "Automated SEO optimization for Chinese search terms",
        "Featured placement in SydneyToday's property section",
        "Strategic REDBook post targeting Chinese buyers",
        "Continuous listing until property sells",
        "Basic analytics and performance tracking"
      ],
      highlights: [
        "Quick setup - live within 24 hours",
        "Reach 50,000+ Chinese buyers",
        "Professional Chinese translations included",
        "No ongoing fees - pay once"
      ],
      examples: [
        "Sample FANG.COM.AU listing with Chinese text",
        "SydneyToday post preview",
        "REDBook post template",
        "Performance dashboard screenshot"
      ],
      icon: Check,
      color: "from-blue-600 to-blue-700"
    },
    Signature: {
      name: "Signature",
      price: "$800",
      description: "Our most popular choice for serious sellers who want premium exposure and professional copywriting.",
      features: [
        "Premium FANG.COM.AU listing with enhanced visibility",
        "Professional Chinese copywriting by native speakers",
        "App push notifications to engaged users",
        "Two strategic SydneyToday posts for maximum reach",
        "WeChat Official Account post (2nd position)",
        "Two REDBook posts with different angles",
        "Exclusive newsletter feature to members"
      ],
      highlights: [
        "Professional copywriting included",
        "Multi-platform exposure strategy",
        "Push notification technology",
        "Member-exclusive newsletter placement"
      ],
      examples: [
        "Professional Chinese copywriting samples",
        "WeChat Official Account post preview",
        "REDBook campaign strategy",
        "Newsletter integration example"
      ],
      icon: Star,
      color: "from-purple-600 to-purple-700"
    },
    Prestige: {
      name: "Prestige",
      price: "$1,250",
      description: "Maximum impact with multi-channel campaigns, video content, and dedicated account management.",
      features: [
        "Comprehensive multi-channel campaign strategy",
        "Headline highlighted property listing on FANG.COM.AU",
        "WeChat Official Account post (1st position)",
        "Two premium app push notifications",
        "Three strategic REDBook posts",
        "Professional Chinese video content for REDBook & WeChat",
        "Dedicated account manager for personalized service",
        "Maximum reach across all platforms",
        "Ongoing support and optimization"
      ],
      highlights: [
        "Dedicated account manager",
        "Professional video content creation",
        "1st position WeChat placement",
        "Comprehensive campaign strategy"
      ],
      examples: [
        "Video content creation process",
        "Multi-channel campaign timeline",
        "Account manager dashboard",
        "Performance optimization reports"
      ],
      icon: Crown,
      color: "from-white to-white"
    }
  }

  const handleIconClick = (tierName: string) => {
    setSelectedTier(tierDetails[tierName])
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedTier(null)
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
                    className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-full w-20 h-20 flex items-center justify-center shadow-lg overflow-hidden cursor-pointer group"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.7 }}
                    onClick={() => handleIconClick("Signature")}
                  >
                    <img src="/redbook.png" alt="Xiaohongshu" className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300" />
                  </motion.div>
                  <motion.div
                    className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-full w-20 h-20 flex items-center justify-center shadow-lg overflow-hidden cursor-pointer group"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.7 }}
                    onClick={() => handleIconClick("Signature")}
                  >
                    <img src="/wechat.png" alt="WeChat" className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300" />
                  </motion.div>
                </div>
              ) : index === 2 ? (
                <div className="flex items-center justify-center gap-2 sm:gap-4 mb-5 sm:mb-7">
                  <motion.div
                    className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-full w-16 h-16 flex items-center justify-center shadow-lg overflow-hidden cursor-pointer group"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.7 }}
                    onClick={() => handleIconClick("Prestige")}
                  >
                    <img src="/hero.png" alt="Fang" className="h-8 w-8 object-contain group-hover:scale-110 transition-transform duration-300" style={{ filter: 'brightness(0) invert(1)' }} />
                  </motion.div>
                  <motion.div
                    className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-full w-16 h-16 flex items-center justify-center shadow-lg overflow-hidden cursor-pointer group"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.7 }}
                    onClick={() => handleIconClick("Prestige")}
                  >
                    <img src="/today.png" alt="SydneyToday" className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300" />
                  </motion.div>
                  <motion.div
                    className="bg-gradient-to-r from-green-600 to-green-700 rounded-full w-16 h-16 flex items-center justify-center shadow-lg overflow-hidden cursor-pointer group"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.7 }}
                    onClick={() => handleIconClick("Prestige")}
                  >
                    <img src="/wechat.png" alt="WeChat" className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300" />
                  </motion.div>
                  <motion.div
                    className="bg-gradient-to-r from-pink-500 to-pink-700 rounded-full w-16 h-16 flex items-center justify-center shadow-lg overflow-hidden cursor-pointer group"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.7 }}
                    onClick={() => handleIconClick("Prestige")}
                  >
                    <img src="/redbook.png" alt="Xiaohongshu" className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300" />
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  className={`bg-gradient-to-r ${pkg.color} p-4 sm:p-5 rounded-full w-16 sm:w-20 h-16 sm:h-20 mb-5 sm:mb-7 flex items-center justify-center shadow-lg cursor-pointer group`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.7 }}
                  onClick={() => handleIconClick("Essential")}
                >
                  {index === 0 ? (
                    <img src="/hero.png" alt="Essential" className="h-8 sm:h-10 w-8 sm:w-10 object-contain group-hover:scale-110 transition-transform duration-300" style={{ filter: 'brightness(0) invert(1)' }} />
                  ) : (
                    <pkg.icon className="h-8 sm:h-10 w-8 sm:w-10 text-white group-hover:scale-110 transition-transform duration-300" />
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

      {/* Hyper-Modern Modal */}
      <AnimatePresence>
        {modalOpen && selectedTier && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeModal}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Modal Header */}
              <div className="relative p-8 sm:p-12">
                <div className="flex items-center gap-6 mb-8">
                  <motion.div
                    className={`bg-gradient-to-r ${selectedTier.color} p-4 rounded-2xl shadow-xl`}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", damping: 15 }}
                  >
                    <selectedTier.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <motion.h2
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl sm:text-4xl font-bold text-white mb-2"
                    >
                      {selectedTier.name}
                    </motion.h2>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-2xl sm:text-3xl font-bold text-blue-200"
                    >
                      {selectedTier.price}
                    </motion.div>
                  </div>
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg text-blue-100 mb-8 leading-relaxed"
                >
                  {selectedTier.description}
                </motion.p>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Features */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      What's Included
                    </h3>
                    <ul className="space-y-3">
                      {selectedTier.features.map((feature, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          className="flex items-start gap-3 text-blue-100"
                        >
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm leading-relaxed">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Highlights */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      Key Highlights
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedTier.highlights.map((highlight, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.9 + index * 0.1 }}
                          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                        >
                          <p className="text-sm text-blue-100 font-medium">{highlight}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Examples Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="mt-8"
                >
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Play className="w-5 h-5 text-blue-400" />
                    What You'll Get
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {selectedTier.examples.map((example, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.1 + index * 0.1 }}
                        className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:scale-105 transition-transform duration-300 cursor-pointer group"
                      >
                        <div className="w-full h-20 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-lg mb-3 flex items-center justify-center">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Play className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <p className="text-xs text-blue-100 text-center font-medium">{example}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="mt-8 pt-8 border-t border-white/20"
                >
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="text-center sm:text-left">
                      <p className="text-blue-100 font-medium">Ready to get started?</p>
                      <p className="text-sm text-blue-200">Join hundreds of successful sellers</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        closeModal()
                        setDrawerOpen(true)
                      }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl"
                    >
                      Get Started Now
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ContactDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </section>
  )
}
