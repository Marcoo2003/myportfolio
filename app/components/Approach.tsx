"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

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

export default function Approach() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section gradient-subtle">
      <div className="container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <span className="label mb-4 block">05 // SYSTEMS</span>
          <h2 className="headline text-3xl md:text-4xl max-w-xl">
            Come penso alla costruzione del software.
          </h2>
        </motion.div>

        {/* Principles - manifesto style */}
        <div className="space-y-1">
          {principles.map((principle, index) => (
            <motion.div
              key={principle.number}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.2 + index * 0.1,
                ease: "easeOut",
              }}
              className="group py-6 border-b border-[var(--border)] 
                         hover:border-[var(--border-hover)] transition-colors duration-500"
            >
              <div className="flex items-start gap-6 md:gap-12">
                {/* Number */}
                <span className="label text-[var(--foreground-subtle)] pt-1 w-8 shrink-0">
                  {principle.number}
                </span>

                {/* Content */}
                <div className="flex-1">
                  <p className="text-xl md:text-2xl font-medium tracking-tight 
                              group-hover:text-[var(--accent)] transition-colors duration-500">
                    {principle.statement}
                  </p>
                  <p className="text-[var(--foreground-muted)] text-sm mt-2 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {principle.detail}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
