"use client";

import { motion, useInView, useAnimationFrame } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";

// Placeholder images - replace with your actual project screenshots
const webProjects = [
  { src: "/projects/web-1.png", alt: "YouFlai" },
  { src: "/projects/web-2.png", alt: "MANOMADE" },
  { src: "/projects/web-3.png", alt: "Web Project 3" },
  { src: "/projects/web-4.png", alt: "Web Project 4" },
  { src: "/projects/web-5.png", alt: "Web Project 5" },
];

const mobileProjects = [
  { src: "/projects/mobile-1.png", alt: "Mobile Project 1" },
  { src: "/projects/mobile-2.png", alt: "Mobile Project 2" },
  { src: "/projects/mobile-3.png", alt: "Mobile Project 3" },
  { src: "/projects/mobile-4.png", alt: "Mobile Project 4" },
  { src: "/projects/mobile-5.png", alt: "Mobile Project 5" },
];

interface CarouselProps {
  images: { src: string; alt: string }[];
  direction?: "up" | "down";
  speed?: number;
}

function VerticalCarousel({ images, direction = "up", speed = 0.5 }: CarouselProps) {
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setOffset(prev => {
        const newOffset = direction === "up" ? prev - speed : prev + speed;
        // Reset when scrolled through all images
        const resetPoint = images.length * 300; // Approximate height per image
        if (Math.abs(newOffset) > resetPoint) {
          return 0;
        }
        return newOffset;
      });
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [direction, speed, images.length]);

  // Triple the images for seamless loop
  const tripleImages = [...images, ...images, ...images];

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Scrolling content */}
      <div 
        ref={containerRef}
        className="flex flex-col gap-4"
        style={{
          transform: `translateY(${offset}px)`,
        }}
      >
        {tripleImages.map((image, index) => (
          <div 
            key={`${image.src}-${index}`}
            className="relative w-full shrink-0 overflow-hidden bg-[var(--background-subtle)] border border-[var(--border)]"
            style={{ aspectRatio: "16/10" }}
          >
            {/* Project label overlay */}
            <div className="absolute top-0 left-0 right-0 z-10 p-2 md:p-3">
              <span className="label text-[8px] md:text-[10px] bg-[var(--background)] px-2 py-1 border border-[var(--border)]">
                {image.alt.toUpperCase()}
              </span>
            </div>
            
            {/* Image */}
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover opacity-80"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function VerticalCarouselMobile({ images, direction = "down", speed = 0.4 }: CarouselProps) {
  const [offset, setOffset] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setOffset(prev => {
        const newOffset = direction === "up" ? prev - speed : prev + speed;
        const resetPoint = images.length * 400;
        if (Math.abs(newOffset) > resetPoint) {
          return 0;
        }
        return newOffset;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [direction, speed, images.length]);

  const tripleImages = [...images, ...images, ...images];

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div 
        className="flex flex-col gap-3"
        style={{
          transform: `translateY(${offset}px)`,
        }}
      >
        {tripleImages.map((image, index) => (
          <div 
            key={`${image.src}-${index}`}
            className="relative w-full shrink-0 overflow-hidden bg-[var(--background-subtle)] border border-[var(--border)]"
            style={{ aspectRatio: "9/19" }}
          >
            {/* Project label overlay */}
            <div className="absolute top-0 left-0 right-0 z-10 p-1.5">
              <span className="label text-[6px] bg-[var(--background)] px-1.5 py-0.5 border border-[var(--border)]">
                {image.alt.toUpperCase()}
              </span>
            </div>
            
            {/* Image */}
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover opacity-80"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DeviceShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section overflow-hidden">
      <div className="container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <span className="label mb-4 block">// INTERFACES</span>
          <h2 className="headline text-3xl md:text-4xl max-w-xl">
            Designed for every screen.
          </h2>
        </motion.div>

        {/* Devices container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16"
        >
          {/* Desktop/Monitor silhouette */}
          <div className="relative">
            {/* Monitor frame */}
            <div 
              className="relative bg-[var(--background-elevated)] rounded-lg border border-[var(--border)]"
              style={{
                width: "min(500px, 70vw)",
                aspectRatio: "16/10",
              }}
            >
              {/* Screen bezel */}
              <div className="absolute inset-2 md:inset-3 rounded overflow-hidden bg-[var(--background)]">
                {/* Top bar - browser chrome */}
                <div className="h-6 md:h-8 bg-[var(--background-subtle)] border-b border-[var(--border)] flex items-center px-3 gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#ff5f56] opacity-60" />
                  <div className="w-2 h-2 rounded-full bg-[#ffbd2e] opacity-60" />
                  <div className="w-2 h-2 rounded-full bg-[#27ca3f] opacity-60" />
                  <div className="flex-1 mx-4">
                    <div className="h-3 md:h-4 bg-[var(--background)] rounded-sm max-w-[200px] mx-auto" />
                  </div>
                </div>
                
                {/* Screen content - carousel */}
                <div className="absolute top-6 md:top-8 left-0 right-0 bottom-0">
                  <VerticalCarousel images={webProjects} direction="up" speed={0.3} />
                </div>
              </div>
            </div>
            
            {/* Monitor stand */}
            <div className="mx-auto mt-1">
              <div 
                className="mx-auto bg-[var(--background-elevated)] border-x border-b border-[var(--border)]"
                style={{ width: "60px", height: "30px" }}
              />
              <div 
                className="mx-auto bg-[var(--background-elevated)] border border-[var(--border)] rounded-b-sm"
                style={{ width: "120px", height: "8px" }}
              />
            </div>
            
            {/* Label */}
            <div className="text-center mt-6">
              <span className="label">WEB</span>
            </div>
          </div>

          {/* iPhone silhouette */}
          <div className="relative">
            {/* Phone frame */}
            <div 
              className="relative bg-[var(--background-elevated)] rounded-[2.5rem] border border-[var(--border)]"
              style={{
                width: "min(180px, 40vw)",
                aspectRatio: "9/19",
              }}
            >
              {/* Dynamic Island / Notch */}
              <div 
                className="absolute top-3 left-1/2 -translate-x-1/2 bg-[var(--background)] rounded-full z-20"
                style={{ width: "80px", height: "24px" }}
              />
              
              {/* Screen area */}
              <div className="absolute inset-2 rounded-[2rem] overflow-hidden bg-[var(--background)]">
                {/* Status bar */}
                <div className="h-8 flex items-center justify-between px-6 text-[8px] font-mono text-[var(--foreground-subtle)]">
                  <span>9:41</span>
                  <span>●●●●○</span>
                </div>
                
                {/* Screen content - carousel */}
                <div className="absolute top-8 left-0 right-0 bottom-0">
                  <VerticalCarouselMobile images={mobileProjects} direction="down" speed={0.25} />
                </div>
              </div>
              
              {/* Home indicator */}
              <div 
                className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[var(--foreground-subtle)] rounded-full"
                style={{ width: "100px", height: "4px", opacity: 0.3 }}
              />
            </div>
            
            {/* Label */}
            <div className="text-center mt-6">
              <span className="label">MOBILE</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
