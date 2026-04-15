"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const interests = [
  {
    name: "Fitness",
    files: [
      { name: "workout_routine.md", desc: "routine" },
      { name: "progress.log", desc: "un passo alla volta" },
    ],
  },
  {
    name: "Books",
    files: [
      { name: "Gödel, Escher, Bach", desc: "Sistemi formali, logica e loop infiniti" },
      { name: "Thinking Fast and Slow", desc: "Come ragioniamo (spesso male)" },
      { name: "Sapiens", desc: "Storia dell'umanità" },
    ],
  },
  {
    name: "Learning",
    files: [
      { name: "3Blue1Brown", desc: "Matematica visualizzata" },
      { name: "Veritasium", desc: "Scienza raccontata bene" },
    ],
  },
];

const facts = [
  { label: "Editor", value: "VS Code" },
  { label: "Theme", value: "Dark" },
  { label: "Coffee / day", value: "≥ 3" },
  { label: "Indent", value: "Tab" },
];

export default function Identity() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [open, setOpen] = useState<string[]>(["Fitness"]);

  const toggle = (name: string) => {
    setOpen((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  return (
    <section ref={ref} className="section">
      <div className="container">
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="label mb-12 block"
        >
          04 // ABOUT ME
        </motion.span>

        {/* Bio + facts */}
        <div
          style={{
            marginBottom: "clamp(3rem, 5vw, 5rem)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2
              className="headline"
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                marginBottom: "1.5rem",
              }}
            >
              Non solo codice.
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                color: "var(--foreground-muted)",
                lineHeight: 1.75,
                marginBottom: "2rem",
              }}
            >
              <p>
                Non c&apos;è solo il codice. Mi piace tenermi attivo e cambiare
                prospettiva: che sia un allenamento in palestra o un libro di
                saggistica, cerco solo di imparare qualcosa di nuovo ogni giorno.
              </p>
              <p>
                Sono un fan dei video che spiegano concetti complessi in modo
                visivo (come quelli di 3Blue1Brown) perché, in fondo, mi piace
                semplicemente capire come funzionano le cose, senza troppi giri
                di parole.
              </p>
            </div>

            {/* Quick facts */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{
                padding: "1.25rem 1.5rem",
                background: "var(--background-subtle)",
                border: "1px solid var(--border)",
              }}
            >
              <span className="label" style={{ display: "block", marginBottom: "1rem" }}>
                Quick facts
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {facts.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.07 }}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontFamily: "var(--font-mono)",
                        color: "var(--foreground-subtle)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {f.label}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--foreground-muted)",
                      }}
                    >
                      {f.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Interests accordion */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <span className="label" style={{ display: "block", marginBottom: "1rem" }}>
            ~/interests
          </span>
          <div style={{ border: "1px solid var(--border)" }}>
            {interests.map((folder, fi) => {
              const isExpanded = open.includes(folder.name);
              return (
                <motion.div
                  key={folder.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + fi * 0.08 }}
                  style={{
                    borderBottom:
                      fi < interests.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                  }}
                >
                  <button
                    onClick={() => toggle(folder.name)}
                    className="w-full group"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.875rem 1.25rem",
                      background: isExpanded
                        ? "var(--background-subtle)"
                        : "transparent",
                      border: "none",
                      width: "100%",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <motion.span
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          fontSize: "0.6rem",
                          color: "var(--foreground-subtle)",
                        }}
                      >
                        ▶
                      </motion.span>
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: "var(--foreground)",
                        }}
                      >
                        {folder.name}
                      </span>
                    </div>
                    <span className="label">{folder.files.length}</span>
                  </button>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateRows: isExpanded ? "1fr" : "0fr",
                      transition: "grid-template-rows 0.28s ease",
                    }}
                  >
                    <div style={{ overflow: "hidden" }}>
                      <div
                        style={{
                          borderTop: "1px solid var(--border)",
                          background: "var(--background)",
                        }}
                      >
                        {folder.files.map((file, fii) => (
                          <div
                            key={fii}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              padding: "0.6rem 1.25rem 0.6rem 2.5rem",
                              borderBottom:
                                fii < folder.files.length - 1
                                  ? "1px solid var(--border)"
                                  : "none",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "0.8rem",
                                color: "var(--foreground-muted)",
                              }}
                            >
                              {file.name}
                            </span>
                            <span
                              style={{
                                fontSize: "0.7rem",
                                fontFamily: "var(--font-mono)",
                                color: "var(--foreground-subtle)",
                              }}
                            >
                              {file.desc}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
