"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function SignalVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const timeRef = useRef(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const width = 400;
    const height = 500;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Signal parameters
    const signals = [
      { freq: 0.02, amp: 40, phase: 0, speed: 0.015, color: "rgba(74, 158, 255, 0.6)" },
      { freq: 0.035, amp: 25, phase: Math.PI / 3, speed: 0.02, color: "rgba(74, 158, 255, 0.35)" },
      { freq: 0.015, amp: 55, phase: Math.PI / 2, speed: 0.01, color: "rgba(74, 158, 255, 0.2)" },
    ];

    // Particles floating around
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    // Data points for the grid
    const gridPoints: { x: number; y: number; pulse: number }[] = [];
    const gridSpacing = 40;
    for (let x = 20; x < width - 20; x += gridSpacing) {
      for (let y = 20; y < height - 20; y += gridSpacing) {
        gridPoints.push({ x, y, pulse: Math.random() * Math.PI * 2 });
      }
    }

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      timeRef.current += 1;
      const t = timeRef.current;

      // Clear with fade trail
      ctx.fillStyle = "rgba(10, 10, 10, 0.15)";
      ctx.fillRect(0, 0, width, height);

      // Draw grid dots with pulsing
      gridPoints.forEach((point) => {
        const pulse = Math.sin(t * 0.02 + point.pulse) * 0.5 + 0.5;
        const size = 1 + pulse * 1.5;
        const alpha = 0.1 + pulse * 0.15;
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74, 158, 255, ${alpha})`;
        ctx.fill();
      });

      // Draw flowing signal waves
      const centerY = height / 2;
      signals.forEach((signal, idx) => {
        ctx.beginPath();
        ctx.strokeStyle = signal.color;
        ctx.lineWidth = 1.5 - idx * 0.3;

        for (let x = 0; x < width; x += 2) {
          // Create complex wave with noise
          const noise = Math.sin(x * 0.1 + t * 0.05) * 10;
          const wave = Math.sin(x * signal.freq + t * signal.speed + signal.phase) * signal.amp;
          const y = centerY + wave + noise;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      // Draw scanning line
      const scanY = (t * 1.5) % (height + 100) - 50;
      const gradient = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      gradient.addColorStop(0, "transparent");
      gradient.addColorStop(0.5, "rgba(74, 158, 255, 0.15)");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanY - 30, width, 60);

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74, 158, 255, ${p.alpha})`;
        ctx.fill();
      });

      // Draw data readout bars on the side
      const barCount = 12;
      const barWidth = 3;
      const barSpacing = 8;
      const barStartX = width - 50;
      const barStartY = 80;
      
      for (let i = 0; i < barCount; i++) {
        const barHeight = Math.abs(Math.sin(t * 0.03 + i * 0.5)) * 30 + 5;
        const alpha = 0.3 + Math.sin(t * 0.05 + i) * 0.2;
        
        ctx.fillStyle = `rgba(74, 158, 255, ${alpha})`;
        ctx.fillRect(barStartX, barStartY + i * barSpacing, barWidth + barHeight, 2);
      }

      // Draw corner brackets
      ctx.strokeStyle = "rgba(74, 158, 255, 0.3)";
      ctx.lineWidth = 1;
      
      // Top left
      ctx.beginPath();
      ctx.moveTo(20, 50);
      ctx.lineTo(20, 20);
      ctx.lineTo(50, 20);
      ctx.stroke();
      
      // Top right
      ctx.beginPath();
      ctx.moveTo(width - 50, 20);
      ctx.lineTo(width - 20, 20);
      ctx.lineTo(width - 20, 50);
      ctx.stroke();
      
      // Bottom left
      ctx.beginPath();
      ctx.moveTo(20, height - 50);
      ctx.lineTo(20, height - 20);
      ctx.lineTo(50, height - 20);
      ctx.stroke();
      
      // Bottom right
      ctx.beginPath();
      ctx.moveTo(width - 50, height - 20);
      ctx.lineTo(width - 20, height - 20);
      ctx.lineTo(width - 20, height - 50);
      ctx.stroke();

      // Draw coordinate labels
      ctx.font = "10px 'SF Mono', 'Fira Code', monospace";
      ctx.fillStyle = "rgba(74, 158, 255, 0.4)";
      ctx.textAlign = "left";
      ctx.fillText("0x00", 25, 35);
      ctx.textAlign = "right";
      ctx.fillText(`${width.toString(16).toUpperCase()}h`, width - 25, 35);
      ctx.fillText(`${height.toString(16).toUpperCase()}h`, width - 25, height - 25);
      ctx.textAlign = "left";
      ctx.fillText("0x00", 25, height - 25);

      // Draw center crosshair
      const crossSize = 15;
      const crossAlpha = 0.2 + Math.sin(t * 0.03) * 0.1;
      ctx.strokeStyle = `rgba(74, 158, 255, ${crossAlpha})`;
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      ctx.moveTo(width / 2 - crossSize, centerY);
      ctx.lineTo(width / 2 + crossSize, centerY);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(width / 2, centerY - crossSize);
      ctx.lineTo(width / 2, centerY + crossSize);
      ctx.stroke();
      
      // Center dot
      ctx.beginPath();
      ctx.arc(width / 2, centerY, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(74, 158, 255, ${crossAlpha + 0.2})`;
      ctx.fill();
    };

    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 1.5, delay: 0.5 }}
      className="relative"
    >
      {/* Glow effect behind */}
      <div
        className="absolute inset-0 blur-3xl opacity-30 -z-10"
        style={{
          background: "radial-gradient(circle at center, rgba(74, 158, 255, 0.2), transparent 70%)",
        }}
      />
      
      {/* Main canvas */}
      <canvas
        ref={canvasRef}
        className="w-[400px] h-[500px]"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 1s ease",
        }}
      />
      
      {/* Label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-0 left-0 right-0 flex justify-center"
      >
        <span className="label text-[10px] tracking-[0.3em]">
          [ SIGNAL.MONITOR ]
        </span>
      </motion.div>

      {/* Status indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute top-6 left-6 flex items-center gap-2"
      >
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"
        />
        <span className="label text-[9px]">ACTIVE</span>
      </motion.div>
    </motion.div>
  );
}
