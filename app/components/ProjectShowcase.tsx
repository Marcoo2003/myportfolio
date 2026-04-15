"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { useRef, useState } from "react";

const PROJECTS = [
  {
    id: "01",
    title: "YouFlai",
    category: "Web App",
    description:
      "Automazione cloud della produzione di materiali editoriali per il retail. Pipeline asincrona via RabbitMQ, integrazione Adobe InDesign Server.",
    stack: ["RabbitMQ", "Astro", "Nest.js"],
    media: { type: "image" as const, src: "/projects/web-1.png" },
  },
  {
    id: "02",
    title: "RSA Chat",
    category: "Cryptography",
    description:
      "Chat realtime con crittografia RSA end-to-end. Le chiavi vengono negoziate a runtime — nessun secret hardcoded.",
    stack: ["Node.js", "Socket.io", "JavaScript"],
    media: { type: "image" as const, src: "/projects/web-2.png" },
  },
  {
    id: "03",
    title: "BigTycoon",
    category: "Game",
    description:
      "Gestionale isometrico in C# senza game engine. Rendering tile custom, logica di pathfinding, molta matematica.",
    stack: ["C#", ".NET", "Windows Forms"],
    media: {
      type: "video" as const,
      src: "/projects/web-3.mov",
      poster: "/projects/web-3.png",
    },
  },
];

// ── Per-project opacity ranges: fade in → hold → fade out ─────────────────
// scrollYProgress 0→1 mapped across 3 projects
const OPACITY_RANGES = [
  { range: [0, 0, 0.28, 0.36], values: [1, 1, 1, 0] },
  { range: [0.28, 0.36, 0.61, 0.69], values: [0, 1, 1, 0] },
  { range: [0.61, 0.69, 1, 1], values: [0, 1, 1, 1] },
];

function MediaLayer({
  project,
}: {
  project: (typeof PROJECTS)[number];
}) {
  if (project.media.type === "video") {
    return (
      <video
        src={project.media.src}
        poster={project.media.poster}
        muted
        loop
        playsInline
        autoPlay
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
    );
  }
  return (
    <img
      src={project.media.src}
      alt={project.title}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center top",
        display: "block",
      }}
    />
  );
}

export default function ProjectShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Track active project for progress indicator
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v < 0.36) setActive(0);
    else if (v < 0.69) setActive(1);
    else setActive(2);
  });

  // Individual opacities
  const opacities = OPACITY_RANGES.map(({ range, values }) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTransform(scrollYProgress, range, values)
  );

  return (
    <section
      ref={sectionRef}
      style={{ height: "300vh", position: "relative" }}
    >
      {/* ── Sticky viewport ─────────────────────────────────────────────── */}
      <div
        style={{
          position: "sticky",
          top: 32, // below system header
          height: "calc(100vh - 32px)",
          overflow: "hidden",
        }}
      >
        {/* ── Project layers ──────────────────────────────────────────── */}
        {PROJECTS.map((project, i) => (
          <motion.div
            key={project.id}
            style={{
              position: "absolute",
              inset: 0,
              opacity: opacities[i],
            }}
          >
            {/* Media full-bleed */}
            <MediaLayer project={project} />

            {/* Dark vignette for legibility */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(12,11,9,0.88) 0%, rgba(12,11,9,0.3) 45%, rgba(12,11,9,0.15) 100%)",
                pointerEvents: "none",
              }}
            />

            {/* Subtle amber left accent */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                width: "3px",
                background:
                  "linear-gradient(to bottom, transparent, var(--accent), transparent)",
                opacity: 0.6,
                pointerEvents: "none",
              }}
            />

            {/* ── Project info — bottom left ──────────────────────────── */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "clamp(2rem, 4vw, 3.5rem)",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: "2rem",
                flexWrap: "wrap",
              }}
            >
              <div>
                {/* Ghost number */}
                <div
                  aria-hidden
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "clamp(5rem, 14vw, 11rem)",
                    fontWeight: 700,
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                    color: "rgba(255,255,255,0.04)",
                    marginBottom: "-0.15em",
                    userSelect: "none",
                  }}
                >
                  {project.id}
                </div>

                {/* Category label */}
                <span
                  className="label"
                  style={{ display: "block", marginBottom: "0.5rem", color: "var(--accent)" }}
                >
                  {project.category}
                </span>

                {/* Title */}
                <h3
                  className="headline"
                  style={{
                    fontSize: "clamp(2.5rem, 6vw, 5rem)",
                    color: "var(--foreground)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {project.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: "clamp(0.85rem, 1.3vw, 1rem)",
                    color: "rgba(240,235,227,0.7)",
                    lineHeight: 1.6,
                    maxWidth: "36rem",
                    marginBottom: "1rem",
                  }}
                >
                  {project.description}
                </p>

                {/* Stack tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {project.stack.map((s) => (
                    <span
                      key={s}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.65rem",
                        letterSpacing: "0.07em",
                        textTransform: "uppercase",
                        padding: "0.2rem 0.55rem",
                        background: "rgba(232,160,32,0.12)",
                        border: "1px solid rgba(232,160,32,0.25)",
                        color: "var(--accent)",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Scroll hint — only on first project */}
              {i === 0 && (
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.4rem",
                    flexShrink: 0,
                    marginBottom: "0.5rem",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                    opacity={0.7}
                  >
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                  <span className="label" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.55rem" }}>
                    SCROLL
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}

        {/* ── Section label — top left ─────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            top: "1.5rem",
            left: "clamp(1.5rem, 4vw, 3rem)",
            zIndex: 10,
          }}
        >
          <span className="label" style={{ color: "rgba(255,255,255,0.35)" }}>
            // SCREENSHOTS
          </span>
        </div>

        {/* ── Progress indicator — top right ───────────────────────────── */}
        <div
          style={{
            position: "absolute",
            top: "1.5rem",
            right: "clamp(1.5rem, 4vw, 3rem)",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {PROJECTS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === active ? "1.75rem" : "0.4rem",
                height: "2px",
                background: i === active ? "var(--accent)" : "rgba(255,255,255,0.2)",
                transition: "width 0.4s cubic-bezier(0.22,1,0.36,1), background 0.3s ease",
                borderRadius: "1px",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
