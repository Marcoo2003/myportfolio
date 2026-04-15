"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Heavy canvas component — client only, no SSR
const MaskedTextHero = dynamic(() => import("./MaskedTextHero"), {
  ssr: false,
  loading: () => null,
});

const EASE = [0.22, 1, 0.36, 1] as const;

const BIO_WORDS = "Mi piace smontare i problemi complessi per capire come funzionano e ricostruirli in modo più semplice.".split(" ");

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100svh",
        overflow: "hidden",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      {/* ── LEFT PANEL: Portrait ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
        style={{
          position: "relative",
          width: isMobile ? "100%" : "clamp(240px, 38vw, 460px)",
          height: isMobile ? "52svh" : "auto",
          flexShrink: 0,
          borderRight: isMobile ? "none" : "1px solid var(--border)",
          borderBottom: isMobile ? "1px solid var(--border)" : "none",
          overflow: "hidden",
        }}
      >
        {/* Portrait image — amber duotone treatment */}
        <img
          src="/ritratto.png"
          alt="Marco Zanchin"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            filter:
              "grayscale(1) sepia(0.45) hue-rotate(6deg) saturate(2.8) brightness(0.68) contrast(1.08)",
            display: "block",
          }}
        />

        {/* Gradient: bottom fade */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(12,11,9,0.92) 0%, rgba(12,11,9,0.35) 38%, transparent 62%)",
            pointerEvents: "none",
          }}
        />

        {/* Right-edge fade into text panel */}
        {!isMobile && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "4rem",
              background: "linear-gradient(to right, transparent, var(--background))",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Top-left label */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          style={{
            position: "absolute",
            top: "1.25rem",
            left: "1.5rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--foreground-subtle)",
          }}
        >
          01 // ID
        </motion.span>

        {/* Bottom caption: name + role */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.95, ease: EASE }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: isMobile ? "1.25rem 1.5rem" : "1.75rem 2rem",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(0.75rem, 1.4vw, 0.95rem)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--foreground)",
              fontWeight: 600,
              marginBottom: "0.3rem",
            }}
          >
            Marco Zanchin
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(0.6rem, 0.9vw, 0.72rem)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--accent)",
            }}
          >
            Software Engineer
          </div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 1.2, ease: EASE }}
            style={{
              marginTop: "0.85rem",
              width: "2.5rem",
              height: "1px",
              background: "var(--accent)",
              opacity: 0.55,
              transformOrigin: "left",
            }}
          />
        </motion.div>
      </motion.div>

      {/* ── RIGHT PANEL: FBM text animation ─────────────────────────────── */}
      <div
        style={{
          position: "relative",
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          minHeight: isMobile ? "48svh" : undefined,
        }}
      >
        {/* Canvas fills the right panel */}
        <div style={{ position: "absolute", inset: 0 }}>
          <MaskedTextHero line1="BUILD" line2="THINGS." />
        </div>

        {/* ── Bio overlay — floats over the letterforms ─────────────────── */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 1.3 }}
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              left: "clamp(2rem, 5vw, 4rem)",
              zIndex: 3,
              maxWidth: "clamp(16rem, 32vw, 24rem)",
              pointerEvents: "none",
              borderLeft: "1px solid var(--accent)",
              paddingLeft: "1rem",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "clamp(0.9rem, 1.5vw, 1.15rem)",
                lineHeight: 1.65,
                color: "rgba(240, 235, 227, 0.9)",
                textShadow:
                  "0 1px 4px rgba(0,0,0,0.95), 0 0 40px rgba(0,0,0,0.85), 0 0 80px rgba(0,0,0,0.6)",
                fontWeight: 400,
              }}
            >
              {BIO_WORDS.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: 1.5 + i * 0.055,
                    ease: EASE,
                  }}
                  style={{ display: "inline-block", marginRight: "0.28em" }}
                >
                  {word}
                </motion.span>
              ))}
            </p>
          </motion.div>
        )}

        {/* Bottom gradient — bleeds canvas into next section */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "35%",
            background:
              "linear-gradient(to top, var(--background) 0%, transparent 100%)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* Bottom UI: label + scroll cue */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            marginTop: "auto",
            padding: `0 clamp(1.5rem, 4vw, 3rem) clamp(2rem, 4vw, 3.5rem)`,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "2rem",
          }}
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
            className="label"
          >
            INITIALIZATION
          </motion.span>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}
          >
            <div
              style={{
                position: "relative",
                width: 1,
                height: 40,
                background: "rgba(255,255,255,0.1)",
                overflow: "hidden",
              }}
            >
              <motion.div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  background: "var(--accent)",
                }}
                animate={{
                  height: ["0%", "100%", "100%", "0%"],
                  top: ["0%", "0%", "0%", "100%"],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
            <span className="label">Scroll</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
