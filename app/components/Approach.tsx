"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const principles = [
  {
    number: "01",
    statement: "Systems fail. The question is how.",
    detail: "Design for failure modes, not happy paths.",
  },
  {
    number: "02",
    statement: "Complexity is debt. Clarity is wealth.",
    detail: "Every abstraction has a cost. Pay it consciously.",
  },
  {
    number: "03",
    statement: "Measure twice, cut once. Then automate.",
    detail: "Manual processes are bugs waiting to happen.",
  },
  {
    number: "04",
    statement: "Documentation is a feature.",
    detail: "If it's not written down, it doesn't exist.",
  },
  {
    number: "05",
    statement: "Ship incrementally. Learn continuously.",
    detail: "Perfect is the enemy of deployed.",
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
            How I think about building.
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
