"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// Plays as soon as the element enters the viewport (required on mobile)
function AutoplayVideo({
  src,
  poster,
  style,
}: {
  src: string;
  poster?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        v.muted = true; // required by iOS Safari
        if (entry.isIntersecting) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(v);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="auto"
      style={style}
    />
  );
}

interface Project {
  title: string;
  category: string;
  tags: string[];
  media: { type: "image" | "video"; src: string; poster?: string };
  col: string; // CSS grid-column
  row: string; // CSS grid-row
}

const PROJECTS: Project[] = [
  {
    title: "YouFlai",
    category: "Web App",
    tags: ["RabbitMQ", "Nest.js", "Astro"],
    media: { type: "image", src: "/projects/web-1.png" },
    col: "1 / 3",
    row: "1",
  },
  {
    title: "RSA Chat",
    category: "Cryptography",
    tags: ["Node.js", "Socket.io", "RSA"],
    media: { type: "image", src: "/RSAchat.jpg" },
    col: "3",
    row: "1",
  },
  {
    title: "RediSensei",
    category: "Dev Tool",
    tags: ["Redis", "TypeScript"],
    media: { type: "video", src: "/RedisSensei.mp4" },
    col: "1",
    row: "2",
  },
  {
    title: "Cinemy",
    category: "Platform",
    tags: ["React.js", "Postgres", "Node.js"],
    media: { type: "video", src: "/projects/web-3.mov", poster: "/projects/web-3.png" },
    col: "2 / 4",
    row: "2",
  },
  {
    title: "TechTalk",
    category: "Talk",
    tags: ["Public Speaking"],
    media: { type: "image", src: "/techTalk.jpg" },
    col: "1",
    row: "3",
  },
  {
    title: "Minecraft Generator",
    category: "Tool",
    tags: ["Java", "Procedural"],
    media: { type: "image", src: "/minecraftGenerator.jpg" },
    col: "2",
    row: "3",
  },
  {
    title: "Web App",
    category: "Product",
    tags: ["React", "TypeScript"],
    media: { type: "image", src: "/projects/web-2.png" },
    col: "3",
    row: "3",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function ProjectCard({
  project,
  index,
  isParentInView,
}: {
  project: Project;
  index: number;
  isParentInView: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Play/pause video on hover
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (hovered) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [hovered]);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ opacity: 0, y: 28 }}
      animate={isParentInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: 0.08 + index * 0.07,
        ease: EASE,
      }}
      style={{
        gridColumn: project.col,
        gridRow: project.row,
        position: "relative",
        overflow: "hidden",
        background: "var(--background-elevated)",
        cursor: "default",
      }}
    >
      {/* Media */}
      <motion.div
        animate={{ scale: hovered ? 1.04 : 1 }}
        transition={{ duration: 0.55, ease: EASE }}
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: "center",
        }}
      >
        {project.media.type === "video" ? (
          <video
            ref={videoRef}
            src={project.media.src}
            poster={project.media.poster}
            muted
            loop
            playsInline
            preload="none"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <img
            src={project.media.src}
            alt={project.title}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />
        )}
      </motion.div>

      {/* Permanent subtle dark base */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(12,11,9,0.75) 0%, rgba(12,11,9,0.1) 50%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Hover overlay — deeper gradient + amber tint */}
      <motion.div
        aria-hidden
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(12,11,9,0.92) 0%, rgba(12,11,9,0.5) 55%, rgba(12,11,9,0.15) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Amber border on hover */}
      <motion.div
        aria-hidden
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 0 1px rgba(232,160,32,0.4)",
          pointerEvents: "none",
        }}
      />

      {/* Info overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "clamp(0.9rem, 2vw, 1.4rem)",
        }}
      >
        {/* Category — always visible */}
        <span
          className="label"
          style={{
            display: "block",
            marginBottom: "0.3rem",
            color: "var(--accent)",
          }}
        >
          {project.category}
        </span>

        {/* Title — always visible */}
        <motion.h3
          animate={{ color: hovered ? "var(--foreground)" : "rgba(240,235,227,0.85)" }}
          transition={{ duration: 0.25 }}
          style={{
            fontSize: "clamp(1rem, 2vw, 1.35rem)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: "0",
          }}
        >
          {project.title}
        </motion.h3>

        {/* Tags — appear on hover */}
        <motion.div
          animate={{
            opacity: hovered ? 1 : 0,
            y: hovered ? 0 : 6,
          }}
          transition={{ duration: 0.3, delay: hovered ? 0.05 : 0 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.3rem",
            marginTop: "0.6rem",
          }}
        >
          {project.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.58rem",
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                padding: "0.15rem 0.45rem",
                background: "rgba(232,160,32,0.15)",
                border: "1px solid rgba(232,160,32,0.3)",
                color: "var(--accent)",
              }}
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Video play indicator */}
      {project.media.type === "video" && !hovered && (
        <div
          style={{
            position: "absolute",
            top: "0.9rem",
            right: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="var(--accent)"
            opacity={0.7}
          >
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </div>
      )}
    </motion.div>
  );
}

export default function ProjectGallery() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section ref={ref} className="section">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "clamp(2rem, 4vw, 3.5rem)",
          }}
        >
          <div>
            <span className="label block" style={{ marginBottom: "0.75rem" }}>
              // SCREENSHOTS
            </span>
            <h2
              className="headline"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              Alcune cose che ho costruito.
            </h2>
          </div>
          <span className="label" style={{ color: "var(--foreground-subtle)" }}>
            {PROJECTS.length} progetti
          </span>
        </motion.div>

        {/* Bento grid */}
        {isMobile ? (
          // Mobile: 2-column simple grid
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "2px",
            }}
          >
            {PROJECTS.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
                style={{
                  position: "relative",
                  aspectRatio: "4/3",
                  overflow: "hidden",
                  background: "var(--background-elevated)",
                }}
              >
                {project.media.type === "video" ? (
                  <AutoplayVideo
                    src={project.media.src}
                    poster={project.media.poster}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <img
                    src={project.media.src}
                    alt={project.title}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
                  />
                )}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(12,11,9,0.8) 0%, transparent 60%)",
                  }}
                />
                <div style={{ position: "absolute", bottom: "0.6rem", left: "0.75rem" }}>
                  <span className="label" style={{ color: "var(--accent)", fontSize: "0.5rem" }}>
                    {project.category}
                  </span>
                  <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--foreground)", margin: 0 }}>
                    {project.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // Desktop: bento grid
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gridTemplateRows: "380px 340px 260px",
              gap: "2px",
            }}
          >
            {PROJECTS.map((project, i) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={i}
                isParentInView={isInView}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
