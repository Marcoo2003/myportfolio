"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import NetworkPortrait from "./NetworkPortrait";

// Elegant matrix text reveal component
function MatrixText({ 
  text, 
  delay = 0,
  className = "" 
}: { 
  text: string; 
  delay?: number;
  className?: string;
}) {
  const [characters, setCharacters] = useState<{ char: string; revealed: boolean }[]>([]);
  const [started, setStarted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // More subtle character set - binary + symbols
  const matrixChars = "01█▓▒░╳○●◆◇";
  
  // Wait for component to be mounted and page to be loaded
  useEffect(() => {
    // Wait for page to be fully loaded
    const handleLoad = () => {
      // Small extra delay to ensure everything is rendered
      setTimeout(() => {
        setIsMounted(true);
      }, 100);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      // Fallback in case load already fired
      setTimeout(() => setIsMounted(true), 500);
    }

    return () => window.removeEventListener('load', handleLoad);
  }, []);

  // Initialize characters only after mounted
  useEffect(() => {
    if (!isMounted) return;
    
    // Initialize with matrix characters
    setCharacters(text.split("").map(char => ({ 
      char: char === " " ? " " : matrixChars[Math.floor(Math.random() * matrixChars.length)], 
      revealed: false 
    })));
    
    const startTimeout = setTimeout(() => {
      setStarted(true);
    }, delay * 1000);
    
    return () => clearTimeout(startTimeout);
  }, [delay, text, isMounted]);
  
  useEffect(() => {
    if (!isMounted || characters.length === 0) return;
    
    if (!started) {
      // Subtle noise animation before start
      const noiseInterval = setInterval(() => {
        setCharacters(prev => prev.map((item, i) => ({
          ...item,
          char: item.revealed ? text[i] : (text[i] === " " ? " " : matrixChars[Math.floor(Math.random() * matrixChars.length)])
        })));
      }, 80);
      
      return () => clearInterval(noiseInterval);
    }
    
    // Reveal characters one by one with some randomness
    const revealOrder = text.split("").map((_, i) => i).sort(() => Math.random() - 0.5);
    let currentIndex = 0;
    
    const revealInterval = setInterval(() => {
      if (currentIndex >= revealOrder.length) {
        clearInterval(revealInterval);
        return;
      }
      
      const indexToReveal = revealOrder[currentIndex];
      
      setCharacters(prev => prev.map((item, i) => {
        if (i === indexToReveal) {
          return { char: text[i], revealed: true };
        }
        if (!item.revealed && text[i] !== " ") {
          return { ...item, char: matrixChars[Math.floor(Math.random() * matrixChars.length)] };
        }
        return item;
      }));
      
      currentIndex++;
    }, 60);
    
    return () => clearInterval(revealInterval);
  }, [started, text, isMounted, characters.length]);
  
  // Show nothing until mounted, then show the animation
  if (!isMounted) {
    return (
      <span className={`relative ${className}`} style={{ opacity: 0 }}>
        {text}
      </span>
    );
  }
  
  return (
    <span className={`relative ${className}`}>
      {characters.map((item, i) => (
        <motion.span 
          key={i}
          className="relative inline-block"
          initial={{ opacity: 0.3 }}
          animate={{ 
            opacity: item.revealed ? 1 : 0.4,
          }}
          transition={{ duration: 0.3 }}
          style={{
            width: text[i] === " " ? "0.3em" : "auto",
          }}
        >
          {text[i] === " " ? (
            // Preserve space
            <span>&nbsp;</span>
          ) : (
            <>
              {/* Matrix character (background) */}
              <span 
                className={`
                  transition-all duration-300
                  ${item.revealed 
                    ? "opacity-0 absolute" 
                    : "text-[var(--accent)] opacity-60"
                  }
                `}
                style={{
                  fontFamily: "monospace",
                }}
              >
                {item.char}
              </span>
              
              {/* Revealed character */}
              <motion.span
                className={item.revealed ? "relative" : "absolute left-0 opacity-0"}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={item.revealed ? { 
                  opacity: 1, 
                  y: 0, 
                  filter: "blur(0px)" 
                } : {}}
                transition={{ 
                  duration: 0.4,
                  ease: "easeOut"
                }}
              >
                {text[i]}
              </motion.span>
              
              {/* Reveal flash effect */}
              {item.revealed && (
                <motion.span
                  className="absolute inset-0 bg-[var(--accent)]"
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ 
                    mixBlendMode: "overlay",
                    borderRadius: "2px",
                  }}
                />
              )}
            </>
          )}
        </motion.span>
      ))}
      
      {/* Scanning line effect */}
      {started && (
        <motion.span
          className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[var(--accent)] to-transparent pointer-events-none"
          initial={{ left: 0, opacity: 0.8 }}
          animate={{ left: "100%", opacity: 0 }}
          transition={{ 
            duration: text.length * 0.05,
            ease: "linear"
          }}
        />
      )}
    </span>
  );
}

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

            {/* Main headline - matrix reveal */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="headline text-5xl md:text-6xl lg:text-7xl mb-6"
            >
              <MatrixText text="Building things with" delay={0.6} />
              <br />
              <span className="text-[var(--foreground-muted)]">
                <MatrixText text="code." delay={1.4} />
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="body-text max-w-xl mt-12"
            >
              Mi piace smontare i problemi complessi per capire come funzionano e ricostruirli in modo più semplice. Credo che la buona programmazione sia fatta di tanto ascolto, molta pratica e la giusta dose di umiltà nel saper cambiare idea.
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
