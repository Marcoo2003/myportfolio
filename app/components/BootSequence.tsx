"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_SEQUENCE = [
  { text: "BIOS v2.4.1 — Initializing...", delay: 0 },
  { text: "Memory: 32768 MB OK | CPU: 8 cores @ 3.2GHz", delay: 100 },
  { text: "", delay: 180 },
  { text: "Loading kernel...", delay: 250 },
  { text: "  [OK] net.core | fs.ext4 | crypto.aes256", delay: 350 },
  { text: "", delay: 420 },
  { text: "Mounting /dev/sda1... OK", delay: 500 },
  { text: "Network: eth0 up — 192.168.1.42", delay: 620 },
  { text: "", delay: 700 },
  { text: "Loading portfolio.sys...", delay: 800 },
  { text: "  [OK] Config | Assets | Shaders", delay: 950 },
  { text: "", delay: 1050 },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", delay: 1150 },
  { text: "SYSTEM READY", delay: 1250, highlight: true },
  { text: "Launching interface...", delay: 1400 },
];

const TOTAL_BOOT_TIME = 2000;

export default function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [isComplete, setIsComplete] = useState(false);
  const [shouldShow, setShouldShow] = useState<boolean | null>(null); // null = checking
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user has seen boot sequence before (session)
    const hasBooted = sessionStorage.getItem("hasBooted");
    if (hasBooted) {
      setShouldShow(false);
      onComplete();
      return;
    }
    
    // Show boot sequence
    setShouldShow(true);

    // Progressive line reveal
    BOOT_SEQUENCE.forEach((line, index) => {
      setTimeout(() => {
        setVisibleLines(index + 1);
        // Auto-scroll to bottom
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      }, line.delay);
    });

    // Complete animation
    setTimeout(() => {
      sessionStorage.setItem("hasBooted", "true");
      setIsComplete(true);
      setTimeout(onComplete, 800);
    }, TOTAL_BOOT_TIME);
  }, [onComplete]);

  const handleSkip = () => {
    sessionStorage.setItem("hasBooted", "true");
    setIsComplete(true);
    onComplete();
  };

  // Don't render while checking or if already booted
  if (shouldShow === null || shouldShow === false) return null;

  return (
    <AnimatePresence>
      {!isComplete ? (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] bg-[#050505] flex flex-col"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          {/* Terminal header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27ca3f]" />
            </div>
            <span className="text-[10px] text-[var(--foreground-subtle)] tracking-wider">
              SYSTEM BOOT — v2.4.1
            </span>
            <button
              onClick={handleSkip}
              className="text-[10px] text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] 
                       tracking-wider transition-colors duration-200 px-2 py-1 border border-transparent
                       hover:border-[var(--border)]"
            >
              SKIP →
            </button>
          </div>

          {/* Terminal content */}
          <div
            ref={containerRef}
            className="flex-1 p-6 overflow-y-auto"
            style={{ scrollBehavior: "smooth" }}
          >
            <div className="max-w-3xl">
              {BOOT_SEQUENCE.slice(0, visibleLines).map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.1 }}
                  className={`text-sm leading-relaxed ${
                    line.highlight
                      ? "text-[var(--accent)] font-medium"
                      : line.text.startsWith("  [OK]")
                      ? "text-[#27ca3f]"
                      : line.text.startsWith("  ")
                      ? "text-[var(--foreground-muted)]"
                      : "text-[var(--foreground)]"
                  }`}
                  style={{
                    minHeight: line.text === "" ? "1rem" : "auto",
                  }}
                >
                  {line.text}
                </motion.div>
              ))}
              
              {/* Blinking cursor */}
              {!isComplete && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="inline-block w-2 h-4 bg-[var(--foreground)] ml-1 align-middle"
                />
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-[rgba(255,255,255,0.03)]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: TOTAL_BOOT_TIME / 1000, ease: "linear" }}
              className="h-full bg-[var(--accent)]"
              style={{ opacity: 0.6 }}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
