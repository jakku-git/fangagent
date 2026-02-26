"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";

export function GallerySection() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sectionHeight, setSectionHeight] = useState("100vh");
  const [translateX, setTranslateX] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastScrollRef = useRef(0);

  const images = [
    { src: "/media/images/casestudy1.webp", alt: "Case study 1" },
    { src: "/media/images/casestudy2.webp", alt: "Case study 2" },
    { src: "/media/images/casestudy3.webp", alt: "Case study 3" },
    { src: "/media/images/casestudy4.webp", alt: "Case study 4" },
    { src: "/media/images/casestudy5.webp", alt: "Case study 5" },
    { src: "/media/images/casestudy6.webp", alt: "Case study 6" },
    { src: "/media/images/casestudy7.webp", alt: "Case study 7" },
    { src: "/media/images/casestudy8.webp", alt: "Case study 8" },
  ];

  // Calculate section height based on content width
  useEffect(() => {
    const calculateHeight = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      // Height = viewport height + the extra scroll needed to reveal all content
      const totalHeight = viewportHeight + (containerWidth - viewportWidth);
      setSectionHeight(`${totalHeight}px`);
    };

    // Small delay to ensure container is rendered
    const timer = setTimeout(calculateHeight, 100);
    window.addEventListener("resize", calculateHeight);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculateHeight);
    };
  }, []);

  const updateTransform = useCallback(() => {
    if (!galleryRef.current || !containerRef.current) return;
    
    const rect = galleryRef.current.getBoundingClientRect();
    const containerWidth = containerRef.current.scrollWidth;
    const viewportWidth = window.innerWidth;
    
    // Total scroll distance needed to reveal all images
    const totalScrollDistance = containerWidth - viewportWidth;
    
    // Current scroll position within this section
    const scrolled = Math.max(0, -rect.top);
    
    // Progress from 0 to 1
    const progress = Math.min(1, scrolled / totalScrollDistance);
    
    // Calculate new translateX
    const newTranslateX = progress * -totalScrollDistance;
    
    setTranslateX(newTranslateX);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Cancel any pending animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      // Use requestAnimationFrame for smooth updates
      rafRef.current = requestAnimationFrame(updateTransform);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateTransform();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updateTransform]);

  return (
    <section id="case-study" className="relative bg-background">

      {/* ── MOBILE: touch-swipeable horizontal scroll ── */}
      <div className="md:hidden px-5 py-12">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">Case Studies</p>
        <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2" style={{ touchAction: 'pan-x' }}>
          {images.map((image, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 overflow-hidden rounded-2xl"
              style={{ width: '80vw', height: '80vw' }}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-contain"
                priority={index < 2}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── DESKTOP: scroll-driven horizontal animation ── */}
      <div
        ref={galleryRef}
        className="relative hidden md:block"
        style={{ height: sectionHeight }}
      >
        {/* Sticky container */}
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="flex h-full items-center">
            <div 
              ref={containerRef}
              className="flex gap-6 px-6"
              style={{
                transform: `translate3d(${translateX}px, 0, 0)`,
                WebkitTransform: `translate3d(${translateX}px, 0, 0)`,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                perspective: 1000,
                WebkitPerspective: 1000,
                touchAction: 'pan-y',
              }}
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative flex-shrink-0 overflow-hidden rounded-2xl"
                  style={{
                    height: 'min(80vw, 70vh)',
                    width: 'min(80vw, 70vh)',
                    transform: 'translateZ(0)',
                    WebkitTransform: 'translateZ(0)',
                  }}
                >
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    className="object-contain"
                    priority={index < 3}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
