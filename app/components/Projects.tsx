"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const projectsData = [
  {
    id: "01",
    title: "YouFlai",
    category: "Web App",
    description:
      "piattaforma cloud per l’automazione della produzione di materiali editoriali per il settore retail (flyer, cataloghi, asset promozionali). Ho lavorato allo sviluppo di servizi backend e frontend e all’orchestrazione dei flussi di generazione automatica, integrando Adobe InDesign Server tramite code RabbitMQ per la creazione asincrona di PDF e asset grafici",
    metrics: ["PIPELINE TYPE: Asynchronous", "JOB ORCHESTRATION: RabbitMQ", "RENDER ENGINE: Adobe InDesign Server"],
    stack: ["RabbitMQ", "Astro", "Nest.js"],
  },
  {
    id: "02",
    title: "RSA Chat",
    category: "Cryptography",
    description:
      "Chat realtime con supporto a multithreading e crittografia RSA per la sicurezza dei messaggi.",
    metrics: ["RSA ENCRYPTION", "MULTITHREADING", "REALTIME MESSAGING"],
    stack: ["Javascript", "Node.js", "Socket.io"],
  },
  {
    id: "03",
    title: "BigTycoon",
    category: "Game",
    description:
      "Un gestionale sviluppato interamente in C# con Windows Forms. La sfida non è stata solo il gioco, ma gestire il rendering isometrico e la logica delle tile senza usare un game engine. Molta matematica e zero scorciatoie.",
    metrics: [
        "Rendering isometrico pixel-by-pixel",
        "Logica di gioco scritta da zero",
        "Tanto refactoring per farlo girare"
    ],
    stack: ["C#", ".NET", "Windows Forms"],
  },
];

function ProjectCard({ project, index }: { project: typeof projectsData[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative border border-[var(--border)] rounded-sm overflow-hidden
                 bg-[var(--background-subtle)] cursor-pointer
                 transition-all duration-700 ease-out
                 hover:border-[var(--border-hover)]"
    >
      {/* Hover glow effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-gradient-to-b from-[var(--accent-subtle)] to-transparent pointer-events-none"
      />

      <div className="relative p-8 md:p-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <span className="label text-[var(--foreground-subtle)]">
              {project.category}
            </span>
            <h3 className="headline text-2xl md:text-3xl mt-2 group-hover:text-[var(--accent)] transition-colors duration-500">
              {project.title}
            </h3>
          </div>
          <span className="label text-[var(--foreground-subtle)]">
            {project.id}
          </span>
        </div>

        {/* Description */}
        <p className="text-[var(--foreground-muted)] leading-relaxed mb-8 max-w-2xl">
          {project.description}
        </p>

        {/* Metrics */}
        <div className="flex flex-wrap gap-4 mb-8">
          {project.metrics.map((metric) => (
            <span
              key={metric}
              className="px-3 py-1.5 text-xs font-mono bg-[var(--background-elevated)] 
                       border border-[var(--border)] rounded-sm text-[var(--foreground-muted)]"
            >
              {metric}
            </span>
          ))}
        </div>

        {/* Stack - secondary */}
        <div className="flex items-center gap-2 pt-6 border-t border-[var(--border)]">
          <span className="label text-[var(--foreground-subtle)] mr-2">Stack:</span>
          <span className="text-sm text-[var(--foreground-muted)]">
            {project.stack.join(" / ")}
          </span>
        </div>

        {/* Arrow indicator on hover */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-8 right-8 text-[var(--accent)]"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
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
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex items-end justify-between mb-16"
        >
          <div>
            <span className="label mb-4 block">03 // WORK</span>
            <h2 className="headline text-3xl md:text-4xl">
              Selected Projects
            </h2>
          </div>
          <span className="label text-[var(--foreground-subtle)] hidden md:block">
            {projectsData.length} SYSTEMS
          </span>
        </motion.div>

        {/* Projects grid */}
        <div className="space-y-6">
          {projectsData.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 pt-8 border-t border-[var(--border)]"
        >
          <a
            href="https://github.com/Marcozaa"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 w-fit"
          >
            <div className="flex items-center gap-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-[var(--foreground-muted)] group-hover:text-[var(--accent)] transition-colors duration-300"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="text-[var(--foreground-muted)] group-hover:text-[var(--foreground)] transition-colors duration-300">
                Trovi di più su GitHub
              </span>
            </div>
            <motion.span
              className="text-[var(--accent)]"
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.span>
          </a>
        </motion.div>
      </div>
      
    </section>
  );
}
