"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";

interface Project {
  src: string;
  alt: string;
  type: "image" | "video";
}

// Placeholder - replace with your actual projects
const webProjects: Project[] = [
  { src: "/projects/web-1.png", alt: "YouFlai", type: "image" },
  { src: "/projects/web-2.png", alt: "MANOMADE", type: "image" },
  { src: "/projects/web-3.mov", alt: "CineMy", type: "video" },
  // Example video: { src: "/projects/demo.mp4", alt: "Demo Video", type: "video" },
];

const mobileProjects: Project[] = [
  { src: "/projects/mobile-1.png", alt: "Mobile Project 1", type: "image" },
  { src: "/projects/mobile-2.png", alt: "Mobile Project 2", type: "image" },
  { src: "/projects/mobile-3.png", alt: "Mobile Project 3", type: "image" },
];

interface CarouselProps {
  projects: Project[];
  interval?: number;
}

// Transition variants for smooth animations
const slideVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 100 : -100,
    opacity: 0,
    scale: 0.95,
    filter: "blur(4px)",
  }),
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
  exit: (direction: number) => ({
    y: direction < 0 ? 100 : -100,
    opacity: 0,
    scale: 0.95,
    filter: "blur(4px)",
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

function ProjectMedia({ project, className }: { project: Project; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (project.type === "video" && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [project]);

  if (project.type === "video") {
    return (
      <video
        ref={videoRef}
        src={project.src}
        className={className}
        muted
        loop
        playsInline
        autoPlay
      />
    );
  }

  return (
    <Image
      src={project.src}
      alt={project.alt}
      fill
      className={className}
      priority
    />
  );
}

function DesktopCarousel({ projects, interval = 4000 }: CarouselProps) {
  const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    
    const timer = setInterval(() => {
      setCurrentIndex(([prev]) => [(prev + 1) % projects.length, 1]);
    }, interval);

    return () => clearInterval(timer);
  }, [projects.length, interval, isHovered]);

  const goToSlide = (index: number) => {
    const newDirection = index > currentIndex ? 1 : -1;
    setCurrentIndex([index, newDirection]);
  };

  return (
    <div 
      className="relative w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main content */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          {/* Project label */}
          <motion.div 
            className="absolute top-3 left-3 z-20"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <span className="label text-[10px] bg-[rgba(0,0,0,0.7)] backdrop-blur-sm px-2.5 py-1 rounded border border-[rgba(255,255,255,0.1)]">
              {projects[currentIndex].alt.toUpperCase()}
            </span>
          </motion.div>

          {/* Media */}
          <ProjectMedia 
            project={projects[currentIndex]} 
            className="object-cover opacity-90"
          />
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="group p-1"
          >
            <div 
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-6 bg-white' 
                  : 'w-1.5 bg-white/30 group-hover:bg-white/50'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[rgba(255,255,255,0.1)]">
        <motion.div
          key={currentIndex}
          className="h-full bg-white/50"
          initial={{ width: "0%" }}
          animate={{ width: isHovered ? "0%" : "100%" }}
          transition={{ duration: interval / 1000, ease: "linear" }}
        />
      </div>
    </div>
  );
}

function MobileCarousel({ projects, interval = 5000 }: CarouselProps) {
  const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    
    const timer = setInterval(() => {
      setCurrentIndex(([prev]) => [(prev + 1) % projects.length, 1]);
    }, interval);

    return () => clearInterval(timer);
  }, [projects.length, interval, isHovered]);

  return (
    <div 
      className="relative w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          {/* Project label */}
          <motion.div 
            className="absolute top-2 left-2 z-20"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <span className="label text-[7px] bg-[rgba(0,0,0,0.7)] backdrop-blur-sm px-1.5 py-0.5 rounded border border-[rgba(255,255,255,0.1)]">
              {projects[currentIndex].alt.toUpperCase()}
            </span>
          </motion.div>

          {/* Media */}
          <ProjectMedia 
            project={projects[currentIndex]} 
            className="object-cover opacity-90"
          />
        </motion.div>
      </AnimatePresence>

      {/* Side dots */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1">
        {projects.map((_, index) => (
          <div
            key={index}
            className={`w-1 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'h-4 bg-white' 
                : 'h-1 bg-white/30'
            }`}
          />
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
                  <DesktopCarousel projects={webProjects} interval={4000} />
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
                  <MobileCarousel projects={mobileProjects} interval={5000} />
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
