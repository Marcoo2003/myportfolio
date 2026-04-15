"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const SPRING = { damping: 22, stiffness: 320, mass: 0.4 };

export default function SpringCursor() {
  const dotX   = useMotionValue(-200);
  const dotY   = useMotionValue(-200);
  const ringX  = useSpring(dotX, SPRING);
  const ringY  = useSpring(dotY, SPRING);

  const [hovered,    setHovered]    = useState(false);
  const [cursorLabel, setCursorLabel] = useState("");
  const [visible,    setVisible]    = useState(false);

  // Only activate on pointer-capable devices
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    setVisible(true);

    const onMove = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const el = (e.target as Element).closest("a, button, [data-cursor]");
      if (el) {
        setHovered(true);
        setCursorLabel((el as HTMLElement).dataset?.cursor ?? "");
      }
    };

    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button, [data-cursor]")) {
        setHovered(false);
        setCursorLabel("");
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover",  onOver);
    document.addEventListener("mouseout",   onOut);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover",  onOver);
      document.removeEventListener("mouseout",   onOut);
    };
  }, [dotX, dotY]);

  if (!visible) return null;

  const ringSize = hovered ? 44 : 24;

  return (
    <>
      {/* Dot — exact position, no spring */}
      <motion.div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: dotX,
          y: dotY,
          marginTop: -3,
          marginLeft: -3,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "var(--accent)",
          pointerEvents: "none",
          zIndex: 99999,
          mixBlendMode: "normal",
        }}
      />

      {/* Ring — springs behind */}
      <motion.div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: ringX,
          y: ringY,
          marginTop: -ringSize / 2,
          marginLeft: -ringSize / 2,
          width: ringSize,
          height: ringSize,
          borderRadius: "50%",
          border: "1px solid var(--accent)",
          pointerEvents: "none",
          zIndex: 99998,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "width 0.2s ease, height 0.2s ease, margin 0.2s ease",
        }}
      >
        {cursorLabel && (
          <span
            style={{
              fontSize: "0.45rem",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent)",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            {cursorLabel}
          </span>
        )}
      </motion.div>
    </>
  );
}
