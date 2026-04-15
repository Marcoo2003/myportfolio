"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

interface Line {
  kind: "cmd" | "output" | "success" | "blank";
  text: string;
  partial?: boolean; // true while still being typed
}

const CHAR_DELAY  = 44; // ms per character (with jitter)
const OUT_DELAY   = 55; // ms between output lines
const AFTER_CMD   = 220;
const IDLE_PAUSE  = 720;
const RESTART_GAP = 3800;

const SEQUENCE = [
  {
    cmd: "whoami",
    output: [
      { kind: "output" as const, text: "marco zanchin — software engineer" },
    ],
  },
  {
    cmd: "ls ~/projects",
    output: [
      { kind: "output" as const, text: "youflai/    rsa-chat/   bigtycoon/   portfolio/" },
    ],
  },
  {
    cmd: "git log --oneline -4",
    output: [
      { kind: "output" as const, text: "39eefe9  feat: vercel analytics" },
      { kind: "output" as const, text: "e6e8db7  fix: responsive layout" },
      { kind: "output" as const, text: "c960594  feat: portfolio v2 redesign" },
      { kind: "output" as const, text: "76364b1  init: create next app" },
    ],
  },
  {
    cmd: "npm run build",
    output: [
      { kind: "blank"   as const, text: "" },
      { kind: "output"  as const, text: "> portfolio@0.1.0 build" },
      { kind: "output"  as const, text: "> next build" },
      { kind: "blank"   as const, text: "" },
      { kind: "success" as const, text: "✓  Compiled successfully in 1.9s" },
      { kind: "success" as const, text: "✓  Type checking passed" },
      { kind: "success" as const, text: "✓  4 static pages generated" },
    ],
  },
  {
    cmd: 'echo "sempre in costruzione"',
    output: [
      { kind: "output" as const, text: "sempre in costruzione" },
    ],
  },
];

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

function Cursor({ on }: { on: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: "0.52em",
        height: "1.05em",
        background: on ? "var(--accent)" : "transparent",
        verticalAlign: "text-bottom",
        marginLeft: "1px",
      }}
    />
  );
}

export default function TerminalBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [lines, setLines]     = useState<Line[]>([]);
  const [idle, setIdle]       = useState(false);
  const [blink, setBlink]     = useState(true);
  const alive = useRef(true);

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setBlink(v => !v), 520);
    return () => clearInterval(id);
  }, []);

  const runSequence = useCallback(async () => {
    while (alive.current) {
      setLines([]);
      setIdle(false);

      for (const step of SEQUENCE) {
        if (!alive.current) return;

        // ── Type the command ─────────────────────────────────────
        setLines(prev => [...prev, { kind: "cmd", text: "", partial: true }]);

        for (let i = 0; i < step.cmd.length; i++) {
          if (!alive.current) return;
          await sleep(CHAR_DELAY + Math.random() * 18);
          setLines(prev => {
            const next = [...prev];
            next[next.length - 1] = {
              kind: "cmd",
              text: step.cmd.slice(0, i + 1),
              partial: true,
            };
            return next;
          });
        }

        // Finish typing — remove blinking cursor on cmd line
        setLines(prev => {
          const next = [...prev];
          next[next.length - 1] = { kind: "cmd", text: step.cmd, partial: false };
          return next;
        });

        await sleep(AFTER_CMD);

        // ── Output lines ─────────────────────────────────────────
        for (const out of step.output) {
          if (!alive.current) return;
          setLines(prev => [...prev, { kind: out.kind, text: out.text }]);
          if (out.kind !== "blank") await sleep(OUT_DELAY);
        }

        // ── Idle pause before next command ────────────────────────
        setIdle(true);
        await sleep(IDLE_PAUSE);
        setIdle(false);
      }

      // Long pause before restart
      setIdle(true);
      await sleep(RESTART_GAP);
      setIdle(false);
    }
  }, []);

  useEffect(() => {
    if (!isInView) return;
    alive.current = true;
    runSequence();
    return () => { alive.current = false; };
  }, [isInView, runSequence]);

  return (
    <section ref={ref} className="section">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}
        >
          <span className="label block" style={{ marginBottom: "1rem" }}>
            // TERMINAL
          </span>
          <h2
            className="headline"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", maxWidth: "22rem" }}
          >
            Come la vedo dall&apos;interno.
          </h2>
        </motion.div>

        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            maxWidth: "660px",
            border: "1px solid var(--border)",
            background: "var(--background-subtle)",
          }}
        >
          {/* Title bar */}
          <div
            style={{
              padding: "0.55rem 1.1rem",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "var(--accent)",
                boxShadow: "0 0 5px var(--accent-glow)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.58rem",
                letterSpacing: "0.09em",
                color: "var(--foreground-subtle)",
                userSelect: "none",
              }}
            >
              marco@portfolio: ~
            </span>
          </div>

          {/* Body */}
          <div
            style={{
              padding: "1.1rem 1.4rem 1.4rem",
              minHeight: "260px",
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(0.7rem, 1.15vw, 0.8rem)",
              lineHeight: 1.75,
            }}
          >
            {lines.map((line, i) => {
              const isLast = i === lines.length - 1;

              if (line.kind === "blank") {
                return <div key={i} style={{ height: "0.4rem" }} />;
              }

              if (line.kind === "cmd") {
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center" }}>
                    <span
                      style={{
                        color: "var(--accent)",
                        marginRight: "0.55em",
                        userSelect: "none",
                      }}
                    >
                      $
                    </span>
                    <span style={{ color: "var(--foreground)" }}>{line.text}</span>
                    {line.partial && isLast && <Cursor on={blink} />}
                  </div>
                );
              }

              return (
                <div
                  key={i}
                  style={{
                    paddingLeft: "1.15em",
                    color:
                      line.kind === "success"
                        ? "var(--accent)"
                        : "var(--foreground-muted)",
                  }}
                >
                  {line.text}
                </div>
              );
            })}

            {/* Idle prompt — waiting for next command */}
            {idle && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    color: "var(--accent)",
                    marginRight: "0.55em",
                    userSelect: "none",
                  }}
                >
                  $
                </span>
                <Cursor on={blink} />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
