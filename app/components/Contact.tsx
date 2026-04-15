"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const links = [
  { label: "marcozanchin2@gmail.com", href: "mailto:marcozanchin2@gmail.com" },
  { label: "GitHub", href: "https://github.com/Marcozaa", external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/marco-zanchin/", external: true },
];

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section">
      <div className="container">
        {/* Label */}
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="label block"
          style={{ marginBottom: "clamp(2rem, 5vw, 4rem)" }}
        >
          06 // CONTACT
        </motion.span>

        {/* Big headline */}
        <motion.h2
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="headline"
          style={{ fontSize: "clamp(3rem, 9vw, 7.5rem)", maxWidth: "16ch", marginBottom: "clamp(3rem, 6vw, 5rem)" }}
        >
          Costruiamo qualcosa che{" "}
          <span style={{ color: "var(--foreground-muted)" }}>
            faccia la differenza.
          </span>
        </motion.h2>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{ display: "flex", flexDirection: "column", gap: "0" }}
        >
          {links.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, x: -12 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
              className="group"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1.25rem 0",
                borderBottom: "1px solid var(--border)",
                color: "var(--foreground-muted)",
                fontSize: "clamp(1rem, 2.5vw, 1.35rem)",
                fontWeight: 500,
                transition: "color 0.25s ease",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--foreground-muted)";
              }}
            >
              <span>{link.label}</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                style={{
                  opacity: 0,
                  transform: "translateX(-8px)",
                  transition: "opacity 0.25s ease, transform 0.25s ease",
                }}
                ref={(el) => {
                  if (!el) return;
                  el.closest("a")?.addEventListener("mouseenter", () => {
                    el.style.opacity = "1";
                    el.style.transform = "translateX(0)";
                  });
                  el.closest("a")?.addEventListener("mouseleave", () => {
                    el.style.opacity = "0";
                    el.style.transform = "translateX(-8px)";
                  });
                }}
              >
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </motion.a>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{ marginTop: "5rem", paddingTop: "2rem", borderTop: "1px solid var(--border)" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <span className="label" style={{ color: "var(--foreground-subtle)" }}>
              {new Date().getFullYear()} // Marco Zanchin
            </span>
            <span className="label" style={{ color: "var(--foreground-subtle)" }}>
              Designed & built with precision
            </span>
          </div>
        </motion.footer>
      </div>
    </section>
  );
}
