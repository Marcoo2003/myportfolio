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
    description: "Diploma in Informatica, con forte focus su programmazione, logica computazionale, sistemi informatici e problem solving",
    type: "education",
  },
  {
    year: "2021",
    title: "Robotics Trainee",
    description: "Tirocinio in robotica su UR3 (Universal Robots), con attività di analisi cinematica, controllo del movimento, utilizzo di encoder rotativi e sviluppo di logiche di controllo in MicroPython per la gestione di I/O e automazione.",
    type: "education",
  },
  {
    year: "2020",
    title: "Progetti Open Source",
    description: "Contribuzioni a librerie JavaScript e creazione di tool CLI.",
    type: "project",
  },
];

const STATUS_NOW = [
  { icon: "▶", label: "Building", value: "Portfolio v2.0", color: "#6b8e4e" },
  { icon: "◉", label: "Learning", value: "System Design", color: "#4b6e9e" },
  { icon: "♫", label: "Listening", value: "Lo-fi beats", color: "#6b3d7a" },
];

const TECH_STACK = [
  { name: "React", icon: "⚛" },
  { name: "TypeScript", icon: "TS" },
  { name: "Node.js", icon: "⬢" },
  { name: "Python", icon: "🐍" },
  { name: "Next.js", icon: "▲" },
  { name: "Git", icon: "⎇" },
];

const typeColors = {
  work: "#4b6e9e",
  education: "#6b8e4e",
  project: "#6b3d7a",
};

export default function Timeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section">
      <div className="container">
        {/* Section label */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="label mb-12 block"
        >
          02 // TIMELINE
        </motion.span>

        {/* Main content - two columns */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Timeline container - Left */}
          <div className="relative max-w-xl flex-1">
            {/* Vertical line */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute left-[7px] top-0 bottom-0 w-[1px] origin-top"
              style={{ background: "rgba(255, 255, 255, 0.1)" }}
            />

            {/* Timeline items */}
            <div className="space-y-10">
              {TIMELINE_DATA.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="relative pl-10 group"
                >
                  {/* Dot with pulse animation for current items */}
                  <div
                    className="absolute left-0 top-1 w-[15px] h-[15px] rounded-full border-2 transition-all duration-300 group-hover:scale-125"
                    style={{
                      borderColor: typeColors[item.type],
                      background: "var(--background)",
                    }}
                  >
                    {/* Inner dot on hover */}
                    <div
                      className="absolute inset-[3px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: typeColors[item.type] }}
                    />
                    
                    {/* Pulse ring for current items */}
                    {item.current && (
                      <motion.div
                        className="absolute -inset-1 rounded-full"
                        style={{ border: `1px solid ${typeColors[item.type]}` }}
                        animate={{ 
                          scale: [1, 1.8, 1.8],
                          opacity: [0.6, 0, 0],
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                      />
                    )}
                  </div>

                  {/* Year + Current badge */}
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="font-mono text-xs tracking-wider transition-colors duration-300"
                      style={{ color: typeColors[item.type] }}
                    >
                      {item.year}
                    </span>
                    
                    {item.current && (
                      <span 
                        className="px-2 py-0.5 text-[9px] font-mono tracking-wider rounded-full"
                        style={{ 
                          background: `${typeColors[item.type]}20`,
                          color: typeColors[item.type],
                          border: `1px solid ${typeColors[item.type]}40`,
                        }}
                      >
                        IN CORSO
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-medium text-[var(--foreground)] mb-1 group-hover:text-white transition-colors duration-300">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
                    {item.description}
                  </p>

                  {/* Hover line effect */}
                  <motion.div
                    className="absolute left-0 top-0 w-[2px] h-full origin-top"
                    initial={{ scaleY: 0 }}
                    whileHover={{ scaleY: 1 }}
                    style={{ background: typeColors[item.type] }}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right side - Terminal Status Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:w-80"
          >
            {/* Terminal window */}
            <div 
              className="rounded-lg overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(30,30,30,0.9) 0%, rgba(20,20,20,0.95) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)',
              }}
            >
              {/* Terminal header */}
              <div 
                className="flex items-center gap-2 px-3 py-2"
                style={{ 
                  background: 'rgba(255,255,255,0.03)',
                  borderBottom: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                </div>
                <span className="flex-1 text-center text-[10px] font-mono text-[#666]">status.sh</span>
              </div>

              {/* Terminal content */}
              <div className="p-4 font-mono text-xs space-y-4">
                {/* Now section */}
                <div>
                  <div className="text-[#666] mb-2">$ now --status</div>
                  <div className="space-y-2 pl-2">
                    {STATUS_NOW.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <span style={{ color: item.color }}>{item.icon}</span>
                        <span className="text-[#666]">{item.label}:</span>
                        <span className="text-[var(--foreground)]">{item.value}</span>
                        {index === 0 && (
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="text-[#6b8e4e]"
                          >
                            █
                          </motion.span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[rgba(255,255,255,0.05)]" />

                {/* Tech stack with icons */}
                <div>
                  <div className="text-[#666] mb-3">$ skills --list --short</div>
                  <div className="grid grid-cols-3 gap-2 pl-2">
                    {TECH_STACK.map((tech, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.3, delay: 0.9 + index * 0.08 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="flex flex-col items-center gap-1 p-2 rounded bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.15)] transition-colors cursor-default"
                      >
                        <span className="text-base">{tech.icon}</span>
                        <span className="text-[9px] text-[var(--foreground-muted)]">{tech.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-2 border-t border-[rgba(255,255,255,0.05)]">
                  <div className="flex items-center gap-2 text-[#666]">
                    <span>$</span>
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      _
                    </motion.span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
