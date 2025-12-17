"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          {/* Section label */}
          <span className="label mb-8 block">06 // CONTACT</span>

          {/* Main statement */}
          <h2 className="headline text-4xl md:text-5xl lg:text-6xl mb-8">
            Let&apos;s build something
            <br />
            <span className="text-[var(--foreground-muted)]">that lasts.</span>
          </h2>

          {/* Contact links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col gap-4 mt-12"
          >
            <a
              href="mailto:hello@example.com"
              className="group inline-flex items-center gap-3 text-lg 
                       text-[var(--foreground-muted)] hover:text-[var(--accent)] 
                       transition-colors duration-300"
            >
              <span className="w-8 h-[1px] bg-[var(--border)] group-hover:bg-[var(--accent)] 
                             group-hover:w-12 transition-all duration-300" />
              hello@example.com
            </a>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 text-lg 
                       text-[var(--foreground-muted)] hover:text-[var(--accent)] 
                       transition-colors duration-300"
            >
              <span className="w-8 h-[1px] bg-[var(--border)] group-hover:bg-[var(--accent)] 
                             group-hover:w-12 transition-all duration-300" />
              GitHub
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 text-lg 
                       text-[var(--foreground-muted)] hover:text-[var(--accent)] 
                       transition-colors duration-300"
            >
              <span className="w-8 h-[1px] bg-[var(--border)] group-hover:bg-[var(--accent)] 
                             group-hover:w-12 transition-all duration-300" />
              LinkedIn
            </a>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-32 pt-8 border-t border-[var(--border)]"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <span className="label text-[var(--foreground-subtle)]">
              {new Date().getFullYear()} // Systems Engineer
            </span>
            <span className="label text-[var(--foreground-subtle)]">
              Designed & Built with precision
            </span>
          </div>
        </motion.footer>
      </div>
    </section>
  );
}
