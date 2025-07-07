"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play, ArrowRight } from "lucide-react"
import React, { useEffect, useState } from "react"
import ContactDrawer from "@/components/ContactDrawer"

interface HeroSectionProps {
  language: "en" | "zh"
}

export default function HeroSection({ language }: HeroSectionProps) {
  const content = {
    en: {
      headline: "Unlock the Power of Chinese Buyers.",
      subheadline: "",
      cta1: "Explore Packages",
      cta2: "List Your Property",
    },
    zh: {
      headline: "让您的房源直达中国买家",
      subheadline: "在微信、小红书、今日悉尼等主流平台，精准触达高意向中国买家，助力快速成交。",
      cta1: "查看方案",
      cta2: "立即发布",
    },
  }

  // Animated logo coloring logic
  const logoCount = 14; // [1,2,3,4,5,6,7,1,2,3,4,5,6,7]
  const [coloredIndexes, setColoredIndexes] = useState<number[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let isMounted = true;
    function animate() {
      if (!isMounted) return;
      // Pick 2-3 random indexes
      const numToColor = Math.floor(Math.random() * 2) + 2; // 2 or 3
      const newColoredIndexes: number[] = [];
      
      for (let i = 0; i < numToColor; i++) {
        let randomIdx;
        do {
          randomIdx = Math.floor(Math.random() * logoCount);
        } while (newColoredIndexes.includes(randomIdx));
        newColoredIndexes.push(randomIdx);
      }
      
      setColoredIndexes(newColoredIndexes);
      timeout = setTimeout(animate, 1200);
    }
    animate();
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/hero.webm"
      />
      {/* Background Overlays and Floating UI Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-blue-800/20 z-10" />
        {/* Floating UI Elements removed */}
      </div>

      {/* Content */}
      <div className="relative z-20 text-center max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-extrabold text-white mb-8 leading-tight tracking-tight drop-shadow-xl font-sans"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {content[language].headline}
          </motion.h1>

          <motion.p
            className="text-2xl md:text-3xl text-blue-100 mb-14 max-w-4xl mx-auto leading-relaxed font-medium tracking-tight drop-shadow-lg font-sans"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            {content[language].subheadline}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-8 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-white to-white hover:from-white hover:to-white text-blue-900 font-bold px-10 py-5 text-xl rounded-full shadow-2xl tracking-tight font-sans"
                onClick={() => {
                  const el = document.getElementById('pricing-packages');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {content[language].cta1}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-900 font-bold px-10 py-5 text-xl rounded-full backdrop-blur-sm bg-transparent tracking-tight font-sans"
                onClick={() => setDrawerOpen(true)}
              >
                <Play className="mr-2 h-5 w-5" />
                {content[language].cta2}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Infinite Scrolling Logo Strip */}
      <div className="absolute left-0 right-0 bottom-0 z-30 overflow-hidden select-none">
        <motion.div
          className="flex gap-12 w-max"
          style={{ minWidth: '100vw' }}
          animate={{ x: [0, -700] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        >
          {[1,2,3,4,5,6,7,1,2,3,4,5,6,7].map((num, idx) => (
            <img
              key={idx}
              src={`/logoscroll/${num}.svg`}
              alt={`Logo ${num}`}
              className={`h-56 w-auto opacity-80 logo-greyscale${coloredIndexes.includes(idx) ? ' logo-colored' : ''}`}
              draggable={false}
              style={{ minWidth: 320 }}
            />
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>
      </motion.div>

      <ContactDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </section>
  )
}
