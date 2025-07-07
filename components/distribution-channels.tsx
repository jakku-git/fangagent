"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Globe, MessageCircle, Camera, Newspaper, ShoppingBag } from "lucide-react"

interface DistributionChannelsProps {
  language: "en" | "zh"
}

export default function DistributionChannels({ language }: DistributionChannelsProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [hoveredChannel, setHoveredChannel] = useState<number | null>(null)

  const content = {
    en: {
      title: "Multi-Channel Success",
      subtitle: "Fang.com.au seamlessly distributes your listings to every major Chinese property and social channel in Australia. Maximizing your exposure, effectively.",
      channels: [
        {
          icon: Globe,
          name: "Fang.com.au",
          audience: "500K+ Monthly Visitors",
          description: "SEO-optimised, mobile-first real estate platform",
          color: "from-blue-600 to-blue-700",
        },
        {
          icon: Newspaper,
          name: "SydneyToday",
          audience: "320K+ Daily Readers",
          description: "Australia's largest Chinese news and lifestyle platform",
          color: "from-red-600 to-red-700",
        },
        {
          icon: MessageCircle,
          name: "WeChat",
          audience: "1.2M+ Followers",
          description: "Official accounts and moments distribution",
          color: "from-green-600 to-green-700",
        },
        {
          icon: Camera,
          name: "Xiaohongshu (REDBook)",
          audience: "770K+ Engaged Monthly Active Users",
          description: "Visual content and lifestyle sharing",
          color: "from-pink-600 to-pink-700",
        },
        {
          icon: ShoppingBag,
          name: "UMall",
          audience: "60K+ Monthly Orders",
          description: "Monthly packages delivered to 60k Sydney Residents",
          color: "from-purple-600 to-purple-700",
        },
      ],
    },
    zh: {
      title: "您的房源，覆盖所有中国买家常用平台",
      subtitle: "Fang.com.au 一键分发至澳洲主流中文房产与社交平台，全面提升曝光率。",
      channels: [
        {
          icon: Globe,
          name: "Fang.com.au",
          audience: "50万+月访问量",
          description: "SEO优化的移动优先房地产平台",
          color: "from-blue-600 to-blue-700",
        },
        {
          icon: Newspaper,
          name: "今日悉尼",
          audience: "30万+日读者",
          description: "领先的中文新闻和生活方式平台",
          color: "from-red-600 to-red-700",
        },
        {
          icon: MessageCircle,
          name: "微信",
          audience: "20万+活跃用户",
          description: "公众号和朋友圈分发",
          color: "from-green-600 to-green-700",
        },
        {
          icon: Camera,
          name: "小红书",
          audience: "15万+参与用户",
          description: "视觉内容和生活方式分享",
          color: "from-pink-600 to-pink-700",
        },
        {
          icon: ShoppingBag,
          name: "UMall",
          audience: "10万+购物者",
          description: "零售和房地产市场",
          color: "from-purple-600 to-purple-700",
        },
      ],
    },
  }

  // Circular network layout positions
  const angleStep = (2 * Math.PI) / (content[language].channels.length - 1)
  const radius = 180

  return (
    <section ref={ref} className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center w-full px-6 relative z-10 mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 text-center tracking-tight drop-shadow-xl font-sans"
        >
          {content[language].title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-2xl text-gray-600 max-w-2xl mx-auto mb-10 text-center font-medium leading-relaxed drop-shadow-lg font-sans"
        >
          {content[language].subtitle}
        </motion.p>
        {/* Central logo */}
        <motion.div
          className="flex items-center justify-center mb-10"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img src="/hero.png" alt="Fang.com.au" className="w-28 h-28 rounded-full shadow-xl bg-white/80 p-2 object-contain" />
        </motion.div>
        {/* Two-column grid: left = problem/solution, right = channels */}
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left: Problem & Solution */}
          <div className="space-y-10">
            {/* The Problem */}
            <div>
              <div className="flex items-center mb-4">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-100 mr-3">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <h3 className="text-2xl font-bold text-gray-900">The Traditional Gap</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'English-only listings lose relevance and resonance',
                  'Traditional ads fail on trusted Chinese platforms like WeChat or REDBook',
                  'Cultural disconnect reduces trust and engagement',
                  "Your listings remain invisible to one of Australia's most active buyer groups",
                ].map((problem, i) => (
                  <motion.li
                    key={problem}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                    className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg text-gray-800 font-medium shadow-sm"
                  >
                    {problem}
                  </motion.li>
                ))}
              </ul>
            </div>
            {/* Fang Solution */}
            <div>
              <div className="flex items-center mb-4">
                <img src="/hero.png" alt="Fang Solution" className="h-8 w-8 mr-3 rounded-full bg-blue-100 p-1" />
                <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight font-sans">FANG.COM.AU's Advantage</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Native, culturally resonant Chinese content—never just translated, always localised',
                  'Syndicated reach across WeChat, REDBook, SydneyToday & UMall',
                  'Storytelling that builds instant trust and relevance',
                  'Direct lead generation—no middlemen, no dilution',
                ].map((solution, i) => (
                  <motion.li
                    key={solution}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.7 + i * 0.1 }}
                    className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg text-gray-800 font-medium shadow-sm"
                  >
                    {solution}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
          {/* Right: Channel cards */}
          <div className="flex flex-col gap-8">
            {content[language].channels.slice(1).map((channel, i) => (
              <motion.div
                key={channel.name}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.1 }}
                whileHover={{ scale: 1.06, boxShadow: '0 8px 32px #3b82f633' }}
                className="bg-white/60 backdrop-blur-md shadow-lg rounded-2xl p-6 flex flex-col items-center border border-gray-100 transition-all duration-300 w-full"
              >
                {channel.name === 'SydneyToday' ? (
                  <img src="/today.png" alt="SydneyToday" className="h-10 w-10 mb-3 object-contain" />
                ) : channel.name === 'WeChat' ? (
                  <img src="/wechat.png" alt="WeChat" className="h-10 w-10 mb-3 object-contain" />
                ) : channel.name === 'Xiaohongshu (REDBook)' || channel.name === '小红书' ? (
                  <img src="/redbook.png" alt="Xiaohongshu" className="h-10 w-10 mb-3 object-contain" />
                ) : channel.name === 'UMall' ? (
                  <img src="/umall.png" alt="UMall" className="h-14 w-14 mb-3 object-contain" />
                ) : (
                  <channel.icon className="h-10 w-10 mb-3 text-blue-700" />
                )}
                <span className="font-bold text-gray-900 text-lg mb-1 text-center">{channel.name}</span>
                <span className="text-sm text-blue-700 font-semibold mb-1 text-center">{channel.audience}</span>
                <span className="text-sm text-gray-500 text-center">{channel.description}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
