"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const principles = [
  {
    number: "01",
    statement: "I sistemi falliscono. La vera domanda è: come?",
    detail: "Non progettare solo per il successo ('happy path'). Gestisci le eccezioni e i casi limite: un buon codice si vede da come reagisce agli errori.",
  },
  {
    number: "02",
    statement: "La complessità è un debito. La chiarezza è ricchezza.",
    detail: "Ogni astrazione inutile aumenta il carico cognitivo. Scrivi codice che sia facile da leggere per gli altri, non solo per il compilatore.",
  },
  {
    number: "03",
    statement: "Analizza bene, scrivi una volta. Poi automatizza.",
    detail: "Comprendi il problema prima di toccare la tastiera. I processi manuali e ripetitivi sono bug latenti: lasciali fare alle macchine.",
  },
  {
    number: "04",
    statement: "La documentazione è una funzionalità primaria.",
    detail: "Se non è scritto da nessuna parte, non esiste. Documentare significa rispettare il tempo dei tuoi colleghi e del 'te stesso' del futuro.",
  },
  {
    number: "05",
    statement: "Rilascia piccoli pezzi. Impara ad ogni commit.",
    detail: "Il software perfetto è quello che non esce mai. Punta al valore incrementale: meglio una feature semplice e funzionante che una complessa e incompleta.",
  },
];

function PrincipleRow({
  principle,
  index,
  isInView,
}: {
  principle: (typeof principles)[0];
  index: number;
  isInView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.15 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderBottom: "1px solid var(--border)",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      {/* Giant decorative number — background layer */}
      <motion.span
        aria-hidden
        animate={{ opacity: hovered ? 0.07 : 0.035 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "absolute",
          right: "-0.1em",
          bottom: "-0.15em",
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(6rem, 14vw, 12rem)",
          fontWeight: 700,
          lineHeight: 1,
          color: "var(--foreground)",
          userSelect: "none",
          pointerEvents: "none",
          letterSpacing: "-0.05em",
        }}
      >
        {principle.number}
      </motion.span>

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "flex-start",
          gap: "clamp(1.5rem, 4vw, 4rem)",
          padding: "clamp(1.75rem, 3.5vw, 2.75rem) 0",
        }}
      >
        {/* Small label number */}
        <span
          className="label"
          style={{ paddingTop: "0.3em", width: "2rem", flexShrink: 0, color: "var(--foreground-subtle)" }}
        >
          {principle.number}
        </span>

        {/* Text */}
        <div style={{ flex: 1 }}>
          <motion.p
            animate={{ color: hovered ? "var(--accent)" : "var(--foreground)" }}
            transition={{ duration: 0.25 }}
            style={{
              fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1.35,
              marginBottom: 0,
            }}
          >
            {principle.statement}
          </motion.p>

          {/* Detail — reveals on hover */}
          <div
            style={{
              display: "grid",
              gridTemplateRows: hovered ? "1fr" : "0fr",
              transition: "grid-template-rows 0.3s ease",
            }}
          >
            <div style={{ overflow: "hidden" }}>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--foreground-muted)",
                  lineHeight: 1.65,
                  marginTop: "0.6rem",
                  paddingBottom: "0.25rem",
                }}
              >
                {principle.detail}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Approach() {
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
          style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }}
        >
          <span className="label block" style={{ marginBottom: "1rem" }}>05 // SYSTEMS</span>
          <h2
            className="headline"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", maxWidth: "28rem" }}
          >
            Come penso alla costruzione del software.
          </h2>
        </motion.div>

        {/* Top border */}
        <div style={{ borderTop: "1px solid var(--border)" }} />

        {/* Principles */}
        {principles.map((p, i) => (
          <PrincipleRow key={p.number} principle={p} index={i} isInView={isInView} />
        ))}
      </div>
    </section>
  );
}
