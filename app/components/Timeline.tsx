"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  type: "work" | "education" | "project";
  current?: boolean;
}

const TIMELINE_DATA: TimelineItem[] = [
  {
    year: "2025",
    title: "Laurea Magistrale in Informatica",
    description: "Specializzazione in sistemi distribuiti, cloud computing e intelligenza artificiale.",
    type: "education",
    current: true,
  },
  {
    year: "2025",
    title: "Full Stack Developer",
    description: "Sviluppo di applicazioni web enterprise con React, Node.js e architetture cloud.",
    type: "work",
    current: true,
  },
  {
    year: "2025",
    title: "Laurea Triennale in Informatica",
    description: "Focus su ingegneria del software, sistemi distribuiti e machine learning.",
    type: "education",
  },
  {
    year: "2022",
    title: "Diploma in Informatica",
    description: "Diploma in Informatica, con forte focus su programmazione, logica computazionale, sistemi informatici e problem solving.",
    type: "education",
  },
  {
    year: "2021",
    title: "Robotics Trainee",
    description: "Tirocinio in robotica su UR3 (Universal Robots), con attività di analisi cinematica, controllo del movimento, utilizzo di encoder rotativi e sviluppo di logiche di controllo in MicroPython.",
    type: "education",
  },
  {
    year: "2016–2021",
    title: "Progetti Open Source",
    description: "Anni di pura pratica e sperimentazione. Ho gettato le basi del mio metodo scrivendo codice per ogni idea mi venisse in mente, dai tool CLI ai progetti personali.",
    type: "project",
  },
];

const STATUS_NOW = [
  { label: "Building", value: "Portfolio v2.0" },
  { label: "Learning", value: "System Design" },
  { label: "Reading", value: "GEB" },
];

const TECH_STACK = [
  "React", "TypeScript", "Node.js", "Python", "Next.js", "Git",
];

const typeColors: Record<string, string> = {
  work: "var(--accent)",
  education: "#8a8075",
  project: "#6b5a30",
};

export default function Timeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section">
      <div className="container">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="label mb-12 block"
        >
          02 // TIMELINE
        </motion.span>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Timeline */}
          <div className="relative max-w-xl flex-1">
            <motion.div
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute left-[7px] top-0 bottom-0 w-[1px] origin-top"
              style={{ background: "var(--border)" }}
            />

            <div className="space-y-10">
              {TIMELINE_DATA.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.08 }}
                  className="relative pl-10 group"
                >
                  {/* Dot */}
                  <div
                    className="absolute left-0 top-1 w-[15px] h-[15px] rounded-full border-2 transition-all duration-300 group-hover:scale-125"
                    style={{
                      borderColor: typeColors[item.type],
                      background: "var(--background)",
                    }}
                  >
                    <div
                      className="absolute inset-[3px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: typeColors[item.type] }}
                    />
                    {item.current && (
                      <motion.div
                        className="absolute -inset-1 rounded-full"
                        style={{ border: `1px solid ${typeColors[item.type]}` }}
                        animate={{ scale: [1, 1.8, 1.8], opacity: [0.6, 0, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                      />
                    )}
                  </div>

                  {/* Year + badge */}
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="font-mono text-xs tracking-wider"
                      style={{ color: typeColors[item.type] }}
                    >
                      {item.year}
                    </span>
                    {item.current && (
                      <span
                        className="px-2 py-0.5 text-[9px] font-mono tracking-wider rounded-full"
                        style={{
                          background: "var(--accent-subtle)",
                          color: "var(--accent)",
                          border: "1px solid var(--accent-glow)",
                        }}
                      >
                        IN CORSO
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-medium text-[var(--foreground)] mb-1 group-hover:text-[var(--accent)] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — clean status panel */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:w-72"
          >
            {/* Now */}
            <div
              className="p-5 mb-4"
              style={{
                background: "var(--background-subtle)",
                border: "1px solid var(--border)",
              }}
            >
              <span className="label block mb-4">Now</span>
              <div className="space-y-3">
                {STATUS_NOW.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.6 + i * 0.08 }}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-[var(--foreground-subtle)] font-mono tracking-wide">
                      {item.label}
                    </span>
                    <span className="text-xs text-[var(--foreground-muted)]">
                      {item.value}
                      {i === 0 && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                          className="ml-1"
                          style={{ color: "var(--accent)" }}
                        >
                          █
                        </motion.span>
                      )}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stack */}
            <div
              className="p-5"
              style={{
                background: "var(--background-subtle)",
                border: "1px solid var(--border)",
              }}
            >
              <span className="label block mb-4">Stack</span>
              <div className="flex flex-wrap gap-2">
                {TECH_STACK.map((tech, i) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.2, delay: 0.8 + i * 0.06 }}
                    className="text-xs font-mono px-2.5 py-1"
                    style={{
                      background: "var(--background-elevated)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground-muted)",
                    }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
