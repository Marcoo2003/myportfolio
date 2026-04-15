"use client";

import { useEffect, useState } from "react";

function calculateUptime() {
  const deployDate = new Date();
  deployDate.setDate(deployDate.getDate() - 142);
  deployDate.setHours(deployDate.getHours() - 6);
  deployDate.setMinutes(deployDate.getMinutes() - 19);

  const diff = Date.now() - deployDate.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${days}d ${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m`;
}

function SunIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function SystemHeader() {
  const [uptime, setUptime] = useState("---d --h --m");
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    setMounted(true);
    setUptime(calculateUptime());

    const saved = localStorage.getItem("theme") as "dark" | "light" | null;
    const initial = saved ?? "dark";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);

    const interval = setInterval(() => setUptime(calculateUptime()), 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  if (!mounted) {
    return (
      <header className="system-header">
        <div className="system-header-inner">
          <div className="system-header-item">
            <span className="system-header-label">STATUS:</span>
            <span className="system-header-status">
              <span className="system-header-value">INITIALIZING</span>
            </span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="system-header">
      <div className="system-header-inner">
        {/* Status */}
        <div className="system-header-item">
          <span className="system-header-label">STATUS:</span>
          <span className="system-header-status">
            <span className="system-header-value">OPERATIONAL</span>
          </span>
        </div>

        {/* Telemetry */}
        <div className="system-header-item">
          <span className="system-header-label system-header-hide-mobile">UPTIME:</span>
          <span className="system-header-value system-header-hide-mobile">{uptime}</span>
          <span className="system-header-separator system-header-hide-mobile" />
          <span className="system-header-label">DEPLOY:</span>
          <span className="system-header-value">00:11:34 UTC</span>
        </div>

        {/* Right: env + theme toggle */}
        <div className="system-header-item" style={{ gap: "0.75rem" }}>
          <span className="system-header-label system-header-hide-mobile">ENV:</span>
          <span className="system-header-value system-header-hide-mobile">PROD</span>

          <span className="system-header-separator system-header-hide-mobile" />

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--foreground-muted)",
              padding: "0 0.25rem",
              transition: "color 0.2s ease",
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.06em",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground-muted)")}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            <span className="system-header-hide-mobile">
              {theme === "dark" ? "LIGHT" : "DARK"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
