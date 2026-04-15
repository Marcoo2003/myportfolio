"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const projectsData = [
  {
    id: "01",
    title: "YouFlai",
    category: "Web App",
    description:
      "Piattaforma cloud per l'automazione della produzione di materiali editoriali per il settore retail (flyer, cataloghi, asset promozionali). Ho lavorato allo sviluppo di servizi backend e frontend e all'orchestrazione dei flussi di generazione automatica, integrando Adobe InDesign Server tramite RabbitMQ per la creazione asincrona di PDF e asset grafici.",
    stack: ["RabbitMQ", "Astro", "Nest.js"],
    tags: ["Async pipeline", "Job orchestration", "PDF generation"],
  },
  {
    id: "02",
    title: "RSA Chat",
    category: "Cryptography",
    description:
      "Chat realtime con supporto a multithreading e crittografia RSA per la sicurezza dei messaggi. Ogni sessione negozia le chiavi a runtime — nessun secret hardcoded.",
    stack: ["JavaScript", "Node.js", "Socket.io"],
    tags: ["RSA encryption", "Multithreading", "Realtime"],
  },
  {
    id: "03",
    title: "BigTycoon",
    category: "Game",
    description:
      "Gestionale sviluppato interamente in C# con Windows Forms. La sfida non è stata solo il gioco, ma gestire il rendering isometrico e la logica delle tile senza usare un game engine. Molta matematica e zero scorciatoie.",
    stack: ["C#", ".NET", "Windows Forms"],
    tags: ["Isometric rendering", "Zero engine", "Custom tile logic"],
  },
];

function ProjectRow({
  project,
  index,
}: {
  project: (typeof projectsData)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor="VIEW"
      style={{
        position: "relative",
        borderBottom: "1px solid var(--border)",
        cursor: "default",
      }}
    >
      {/* Amber left accent on hover */}
      <motion.div
        aria-hidden
        initial={{ scaleY: 0 }}
        animate={{ scaleY: hovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "2px",
          background: "var(--accent)",
          transformOrigin: "top",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "clamp(1.5rem, 4vw, 4rem)",
          padding: "clamp(2rem, 4vw, 3.5rem) 0 clamp(2rem, 4vw, 3.5rem) 1.25rem",
        }}
      >
        {/* Large decorative number */}
        <motion.span
          animate={{
            opacity: hovered ? 0.5 : 0.15,
            color: hovered ? "var(--accent)" : "var(--foreground-subtle)",
          }}
          transition={{ duration: 0.3 }}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(3.5rem, 7vw, 7rem)",
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            userSelect: "none",
            flexShrink: 0,
            marginTop: "0.1em",
          }}
        >
          {project.id}
        </motion.span>

        {/* Content */}
        <div style={{ flex: 1 }}>
          {/* Header row */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <motion.h3
              animate={{ color: hovered ? "var(--accent)" : "var(--foreground)" }}
              transition={{ duration: 0.25 }}
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              {project.title}
            </motion.h3>
            <span className="label" style={{ flexShrink: 0, paddingTop: "0.25rem" }}>
              {project.category}
            </span>
          </div>

          {/* Description */}
          <p
            className="body-text"
            style={{ fontSize: "1rem", maxWidth: "44rem", marginBottom: "1.25rem" }}
          >
            {project.description}
          </p>

          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
            {project.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "0.7rem",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: "0.25rem 0.6rem",
                  background: "var(--background-elevated)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground-subtle)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Stack */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="label" style={{ marginRight: "0.25rem" }}>Stack</span>
            <span
              style={{
                fontSize: "0.8rem",
                color: "var(--foreground-muted)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {project.stack.join(" · ")}
            </span>
          </div>
        </div>

        {/* Arrow — appears on hover */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -8 }}
          transition={{ duration: 0.25 }}
          style={{ flexShrink: 0, paddingTop: "0.5rem", color: "var(--accent)" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </motion.div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
            marginBottom: "clamp(2.5rem, 5vw, 5rem)",
          }}
        >
          <div>
            <span className="label block" style={{ marginBottom: "1rem" }}>03 // WORK</span>
            <h2
              className="headline"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              Selected Projects
            </h2>
          </div>
          <span className="label hidden md:block" style={{ color: "var(--foreground-subtle)" }}>
            {projectsData.length} systems
          </span>
        </motion.div>

        {/* Top border */}
        <div style={{ borderTop: "1px solid var(--border)" }} />

        {/* Project rows */}
        {projectsData.map((project, index) => (
          <ProjectRow key={project.id} project={project} index={index} />
        ))}

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{ marginTop: "3rem" }}
        >
          <a
            href="https://github.com/Marcozaa"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              color: "var(--foreground-muted)",
              transition: "color 0.25s ease",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ flexShrink: 0 }}
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span style={{ fontSize: "0.875rem" }}>Trovi di più su GitHub</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
