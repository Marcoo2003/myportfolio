"use client";

import { motion } from "framer-motion";
import NetworkPortrait from "./NetworkPortrait";

export default function Hero() {
  return (
    <section className="section min-h-screen flex items-center gradient-subtle relative overflow-hidden">
      {/* Extra visual layers for hero */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial gradient pulse */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 30% 40%, rgba(74, 158, 255, 0.03), transparent 70%)',
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Moving gradient accent */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, transparent 0%, rgba(74, 158, 255, 0.02) 50%, transparent 100%)',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        {/* Depth fog at bottom */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-64"
          style={{
            background: 'linear-gradient(to top, rgba(10, 10, 10, 0.8), transparent)',
          }}
        />
      </div>
      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="max-w-2xl flex-1"
          >
            {/* Section label */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="label mb-8 block"
            >
              01 // INITIALIZATION
            </motion.span>

            {/* Main headline - editorial, split */}
            <motion.h1
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="headline text-5xl md:text-6xl lg:text-7xl mb-6"
            >
              Signal in the
              <br />
              <span className="text-[var(--foreground-muted)]">noise.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="body-text max-w-xl mt-12"
            >
              Lavoro su sistemi dove la chiarezza conta.
              Imparo progettando, sbagliando, migliorando.
              Architettura prima dell&apos;improvvisazione.
              Affidabilità prima della velocità.
            </motion.p>

            {/* Scroll indicator - animated */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="mt-24 flex items-center gap-4"
            >
              {/* Animated line */}
              <div className="relative w-[1px] h-16 bg-[var(--border)] overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 w-full bg-[var(--accent)]"
                  animate={{
                    height: ["0%", "100%", "100%", "0%"],
                    top: ["0%", "0%", "0%", "100%"],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ height: "30%" }}
                />
              </div>
              
              {/* Text and arrow */}
              <div className="flex flex-col gap-2">
                <span className="label">Scroll to explore</span>
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-[var(--foreground-subtle)]"
                >
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                  >
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Network Portrait */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="relative flex-shrink-0 hidden lg:flex items-center justify-center"
          >
            <NetworkPortrait />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
