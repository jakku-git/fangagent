"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react"

interface FooterProps {
  language: "en" | "zh"
}

export default function Footer({ language }: FooterProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const content = {
    en: {
      tagline: "Empowering Agents. Trusted by Chinese Buyers.",
      contact: {
        title: "Contact Us",
        email: "marketing@fang.com.au",
        phone: "+61 432 827 665",
        address: "Level 3, 122 Castlereagh Street, Sydney NSW 2000",
      },
      services: {
        title: "Services",
        items: ["Property Listings", "Chinese Marketing", "Lead Generation", "Cultural Consulting"],
      },
      platforms: {
        title: "Platforms",
        items: ["WeChat", "Xiaohongshu", "SydneyToday", "UMall", "Fang.com.au"],
      },
      legal: {
        title: "Legal",
        items: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Disclaimer"],
      },
      wechat: "WeChat Official Account",
      copyright: "© 2025 fang.com.au. All rights reserved.",
    },
    zh: {
      tagline: "赋能经纪人，赢得中国买家信赖。",
      contact: {
        title: "联系我们",
        email: "hello@fang.com.au",
        phone: "+61 2 9000 0000",
        address: "新南威尔士州悉尼皮特街123号10层 2000",
      },
      services: {
        title: "服务",
        items: ["房产列表", "中文营销", "潜在客户生成", "文化咨询"],
      },
      platforms: {
        title: "平台",
        items: ["微信", "小红书", "今日悉尼", "UMall", "Fang.com.au"],
      },
      legal: {
        title: "法律",
        items: ["隐私政策", "服务条款", "Cookie政策", "免责声明"],
      },
      wechat: "微信公众号",
      copyright: "© 2024 Fang.com.au. 版权所有。",
    },
  }

  return (
    <footer ref={ref} className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2"
          >
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center mb-6">
              <img src="/hero.png" alt="fang.com.au logo" className="h-16 w-16 mr-4" />
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-semibold text-blue-300 tracking-wide">华人找房</span>
                <h3 className="text-3xl font-extrabold lowercase tracking-tight font-sans">fang.com.au</h3>
                <p className="text-gray-400 text-sm">{content[language].tagline}</p>
              </div>
            </motion.div>

            {/* WeChat QR Code */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white p-4 rounded-lg inline-block"
            >
              <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                <img src="/fangwechat.png" alt="WeChat QR" className="h-20 w-20 object-contain" />
              </div>
              <p className="text-gray-900 text-xs text-center mt-2 font-medium">{content[language].wechat}</p>
            </motion.div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-white">{content[language].contact.title}</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-3 text-gray-400" />
                <span className="text-sm text-gray-300">{content[language].contact.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-3 text-gray-400" />
                <span className="text-sm text-gray-300">{content[language].contact.phone}</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-3 text-gray-400 mt-1" />
                <span className="text-sm text-gray-300">{content[language].contact.address}</span>
              </div>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-white">{content[language].services.title}</h4>
            <ul className="space-y-2">
              {content[language].services.items.map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  className="text-sm text-gray-300 hover:text-white cursor-pointer transition-colors duration-200"
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Platforms */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-white">{content[language].platforms.title}</h4>
            <ul className="space-y-2">
              {content[language].platforms.items.map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  className="text-sm text-gray-300 hover:text-white cursor-pointer transition-colors duration-200"
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-400 text-sm mb-4 md:mb-0">{content[language].copyright}</p>

          <div className="flex space-x-6">
            {content[language].legal.items.map((item, index) => (
              <motion.a
                key={index}
                href="#"
                whileHover={{ scale: 1.05 }}
                className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                {item}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
