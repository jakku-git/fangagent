"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Star, Quote } from "lucide-react"
import { useEffect, useState } from "react"

interface SuccessStoriesProps {
  language: "en" | "zh"
}

export default function SuccessStories({ language }: SuccessStoriesProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const content = {
    en: {
      title: "Real Results. Real Impact.",
      subtitle: "See how leading agencies and agents are winning with Fang.com.au.",
      testimonials: [
        {
          quote: "Fang.com.au supercharged our Chinese buyer inquiries—our listings have never been more visible.",
          author: "Sarah Chen",
          role: "Senior Agent, PPD Realty",
          rating: 5,
        },
        {
          quote: "The cultural expertise is unmatched. Our luxury listings finally get the attention they deserve.",
          author: "Michael Zhang",
          role: "Director, Stonebridge",
          rating: 5,
        },
        {
          quote: "We've closed deals faster and with better-qualified leads than ever before.",
          author: "Lisa Wang",
          role: "Principal, Elders",
          rating: 5,
        },
        {
          quote: "Our brand is now a household name in the Chinese community.",
          author: "David Lee",
          role: "Partner, Colliers",
          rating: 5,
        },
        {
          quote: "Professional, responsive, and results-driven. Highly recommended.",
          author: "Emily Sun",
          role: "Agent, Century 21",
          rating: 5,
        },
        {
          quote: "Their targeted marketing helped us close our biggest deal yet.",
          author: "Kevin Wu",
          role: "Sales Manager, Meriton",
          rating: 5,
        },
      ],
      agencies: [],
    },
    zh: {
      title: "真实案例，见证成效",
      subtitle: "众多机构与经纪人选择Fang.com.au，轻松赢得中国买家。",
      testimonials: [
        {
          quote: "Fang.com.au让我们的房源在中国买家中大受欢迎，咨询量激增。",
          author: "陈莎拉",
          role: "高级经纪人，PPD Realty",
          rating: 5,
        },
        {
          quote: "文化专业度极高，豪宅房源获得了应有的关注。",
          author: "张迈克",
          role: "总监，Stonebridge",
          rating: 5,
        },
        {
          quote: "成交更快，买家更优质，体验非常棒。",
          author: "王丽莎",
          role: "负责人，Elders",
          rating: 5,
        },
        {
          quote: "我们的品牌在华人社区家喻户晓。",
          author: "李大卫",
          role: "合伙人，Colliers",
          rating: 5,
        },
        {
          quote: "团队专业高效，值得信赖。",
          author: "孙艾米",
          role: "经纪人，Century 21",
          rating: 5,
        },
        {
          quote: "精准营销助力我们完成了最大一笔交易。",
          author: "吴凯文",
          role: "销售经理，Meriton",
          rating: 5,
        },
      ],
      agencies: [],
    },
  }

  // --- New: Infinite Sliding Testimonials Data ---
  const testimonials = [
    // English
    {
      quote: "Fang.com.au transformed our Chinese market reach. We've seen a 300% increase in qualified Chinese buyer inquiries.",
      author: "Sarah Chen",
      role: "Senior Agent, PPD Realty",
      rating: 5,
      language: "en",
    },
    {
      quote: "The cultural expertise and platform reach is unmatched. Our luxury listings now get the premium exposure they deserve.",
      author: "Michael Zhang",
      role: "Director, Stonebridge",
      rating: 5,
      language: "en",
    },
    {
      quote: "Finally, a service that understands both markets. The lead quality and conversion rates speak for themselves.",
      author: "Lisa Wang",
      role: "Principal, Elders",
      rating: 5,
      language: "en",
    },
    {
      quote: "Our agency's brand awareness in the Chinese community has never been higher.",
      author: "David Lee",
      role: "Partner, Colliers",
      rating: 5,
      language: "en",
    },
    {
      quote: "The team at Fang.com.au is responsive, professional, and delivers real results.",
      author: "Emily Sun",
      role: "Agent, Century 21",
      rating: 5,
      language: "en",
    },
    {
      quote: "We closed our biggest deal yet thanks to their targeted marketing.",
      author: "Kevin Wu",
      role: "Sales Manager, Meriton",
      rating: 5,
      language: "en",
    },
    // Chinese
    {
      quote: "Fang.com.au改变了我们在中国市场的影响力。我们看到合格的中国买家询问增加了300%。",
      author: "陈莎拉",
      role: "高级经纪人，PPD Realty",
      rating: 5,
      language: "zh",
    },
    {
      quote: "文化专业知识和平台覆盖面无与伦比。我们的豪华房源现在得到了应有的优质曝光。",
      author: "张迈克",
      role: "总监，Stonebridge",
      rating: 5,
      language: "zh",
    },
    {
      quote: "终于有了一个理解两个市场的服务。潜在客户质量和转化率不言而喻。",
      author: "王丽莎",
      role: "负责人，Elders",
      rating: 5,
      language: "zh",
    },
    {
      quote: "我们在华人社区的品牌知名度前所未有地提升了。",
      author: "李大卫",
      role: "合伙人，Colliers",
      rating: 5,
      language: "zh",
    },
    {
      quote: "Fang.com.au团队响应迅速，专业高效，带来了真正的效果。",
      author: "孙艾米",
      role: "经纪人，Century 21",
      rating: 5,
      language: "zh",
    },
    {
      quote: "多亏了他们的精准营销，我们完成了有史以来最大的一笔交易。",
      author: "吴凯文",
      role: "销售经理，Meriton",
      rating: 5,
      language: "zh",
    },
  ];

  // Helper: Render a testimonial card
  function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
    return (
      <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg border border-gray-100 relative drop-shadow-lg min-w-[240px] sm:min-w-[320px] max-w-xs mx-2 sm:mx-4 flex-shrink-0">
        {/* Stars */}
        <div className="flex mb-2">
          {[...Array(testimonial.rating)].map((_, starIndex) => (
            <Star key={starIndex} className="h-5 w-5 text-blue-500 fill-current" />
          ))}
        </div>
        {/* Quote */}
        <blockquote className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 italic drop-shadow" style={{textShadow: '0 1px 6px rgba(0,0,0,0.10)'}}>
          "{testimonial.quote}"
        </blockquote>
        {/* Author */}
        <div className="font-semibold text-gray-900 text-xs sm:text-base drop-shadow" style={{textShadow: '0 1px 6px rgba(0,0,0,0.10)'}}>{testimonial.author}</div>
        <div className="text-xs sm:text-sm text-gray-600 drop-shadow" style={{textShadow: '0 1px 6px rgba(0,0,0,0.10)'}}>{testimonial.role}</div>
      </div>
    );
  }

  // --- Infinite Sliding Wheel ---
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Filter testimonials by language
  const filteredTestimonials = testimonials.filter(t => t.language === language);
  // Duplicate for seamless loop
  const loopTestimonials = [...filteredTestimonials, ...filteredTestimonials];

  return (
    <section ref={ref} className="relative min-h-screen py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Animated Partner Logos Background - Grid Fill */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <div
          className="w-full h-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-0.5 place-items-center opacity-30"
          style={{ minHeight: '100%', minWidth: '100%' }}
        >
          {[
            "PPD3.jpg",
            "logo_Tracy Yap-1.jpg",
            "logo_The agency.jpg",
            "logo_TGC.jpg",
            "logo_Strathfield Partners.jpg",
            "logo_Stone.jpg",
            "logo_Shead.jpg",
            "logo_savills-1.jpg",
            "logo_Richard Matthews高清.jpg",
            "logo_Rich&Oliva-1.jpg",
            "logo_RE MAX METRO.jpg",
            "logo_Ray White.jpg",
            "logo_R&W-1.jpg",
            "logo_Murdoch Lee.jpg",
            "logo_Meriton.jpg",
            "logo-20.jpg",
            "logo_McGrath-2.jpg",
            "logo_McConnell Bourn1.jpg",
            "logo_LAWD Pty Ltd_高清.jpg",
            "logo_Knight Frank-1.jpg",
            "logo_JLL.jpg",
            "logo_Hudson_McHugh1.jpg",
            "logo_FORSYTH_高清.jpg",
            "logo_First National-1-12.jpg",
            "logo_First National-1-11.jpg",
            "logo_Di Jones-1.jpg",
            "logo_CW_Logo_Color_(002).jpg",
            "logo_consis.jpg",
            "logo_Colliers.jpg",
            "logo_CI.jpg",
            "logo_Century 21-1.jpg",
            "logo_CBRE.jpg",
            "logo_Byton Realty Group.jpg",
            "logo_Atlas_Logo_1.jpg",
            "logo_CENTURY 21.jpg",
            "Melrose.jpg",
            "Elders.jpg",
            "Raine & Horne logo.jpg",
            "Belle.jpg",
            "stonebridge.jpg",
            "Laing and Simmons.jpg",
          ].map((img, i) => (
            <div
              key={img}
              className="flex items-center justify-center"
              style={{ width: 192, height: 128 }}
            >
              <motion.img
                src={`/partners/${img}`}
                alt={img}
                className="object-cover w-full h-full"
                initial={{ filter: 'grayscale(1) blur(0.5px)', opacity: 0.7 }}
                animate={{
                  filter: [
                    'grayscale(1) blur(0.5px)',
                    'grayscale(0) blur(0.5px)',
                    'grayscale(1) blur(0.5px)'
                  ],
                  opacity: [0.7, 1, 0.7],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: 'loop',
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Overlay for text readability */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-white/30" />
      <div className="relative z-20 w-full px-0">
        <div className="max-w-7xl mx-auto px-2 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-5xl md:text-7xl font-extrabold text-gray-900 mb-3 sm:mb-6 tracking-tight drop-shadow-xl font-sans" style={{textShadow: '0 2px 8px rgba(0,0,0,0.18)'}}>{content[language].title}</h2>
            <p className="text-base sm:text-2xl text-gray-700 max-w-xs sm:max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg font-sans" style={{textShadow: '0 1px 6px rgba(0,0,0,0.12)'}}>{content[language].subtitle}</p>
          </motion.div>

          {/* Agency Logos */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 mb-8 sm:mb-16 opacity-60"
          >
            {content[language].agencies.map((agency, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.1, opacity: 1 }}
                className="bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-sm border border-gray-200 font-semibold text-gray-700"
              >
                {agency}
              </motion.div>
            ))}
          </motion.div>

          {/* Infinite Sliding Testimonials */}
          <div className="space-y-6 sm:space-y-8 my-8 sm:my-16 w-full">
            {/* Row 1: Left to Right */}
            <div className="overflow-x-auto hide-scrollbar w-full">
              {mounted && (
                <motion.div
                  className="flex"
                  style={{ minWidth: '100%' }}
                  animate={{ x: [0, filteredTestimonials.length * -340] }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 30,
                    ease: "linear",
                  }}
                >
                  {loopTestimonials.map((testimonial, idx) => (
                    <TestimonialCard testimonial={testimonial} key={idx + 'row1'} />
                  ))}
                </motion.div>
              )}
            </div>
            {/* Row 2: Right to Left */}
            <div className="overflow-x-auto hide-scrollbar w-full">
              {mounted && (
                <motion.div
                  className="flex"
                  style={{ minWidth: '100%' }}
                  animate={{ x: [filteredTestimonials.length * -340, 0] }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 30,
                    ease: "linear",
                  }}
                >
                  {loopTestimonials.map((testimonial, idx) => (
                    <TestimonialCard testimonial={testimonial} key={idx + 'row2'} />
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
