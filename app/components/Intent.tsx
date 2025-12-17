"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Intent() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-3xl"
        >
          {/* Section label */}
          <span className="label mb-8 block">02 // INTENT</span>

          {/* Manifesto paragraph - dry, direct */}
          <p className="text-2xl md:text-3xl lg:text-4xl font-medium leading-tight tracking-tight text-[var(--foreground)]">
            I engineer digital systems where{" "}
            <span className="text-[var(--foreground-muted)]">
              reliability matters more than speed.
            </span>
          </p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="body-text mt-8 max-w-xl"
          >
 
Progetto sistemi digitali dando priorità all’affidabilità.
Meno rumore, più struttura.
Architetture pensate per durare, codice mantenibile,
sistemi che funzionano anche quando non sono sotto osservazione.

          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
