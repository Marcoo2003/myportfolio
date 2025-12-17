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
    category: "SYSTEMS",
    description:
      "Chat realtime con supporto a multithreading e crittografia RSA per la sicurezza dei messaggi.",
    metrics: ["RSA ENCRYPTION", "MULTITHREADING", "REALTIME MESSAGING"],
    stack: ["Javascript", "Node.js", "Socket.io"],
  },
  {
    id: "03",
    title: "Observability Platform",
    category: "RELIABILITY",
    description:
      "Internal observability stack providing real-time metrics, distributed tracing, and intelligent alerting across 200+ services.",
    metrics: ["200+ services", "2TB/day", "15ms query time"],
    stack: ["Rust", "ClickHouse", "Prometheus", "Grafana"],
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
            <span className="label mb-4 block">04 // WORK</span>
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
      </div>
    </section>
  );
}
