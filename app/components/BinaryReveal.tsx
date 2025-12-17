"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  imageSrc: string;
  className?: string;
}

// Code snippets to display
const CODE_SNIPPETS = [
  "const init = async () => {",
  "  await connect();",
  "  return system.ready;",
  "};",
  "export default function",
  "interface Config {",
  "  readonly id: string;",
  "  status: boolean;",
  "}",
  "const [state, setState]",
  "useEffect(() => {",
  "  // initialize",
  "}, []);",
  "async function fetch() {",
  "  const res = await api",
  "  return res.data;",
  "}",
  "type Props = {",
  "  children: ReactNode;",
  "  className?: string;",
  "};",
  "const router = useRouter",
  "import { motion }",
  "from 'framer-motion'",
  ".then(data => data)",
  ".catch(err => null)",
  "module.exports = cfg",
  "npm run build",
  "git commit -m 'fix'",
  "docker compose up",
  "SELECT * FROM users",
  "WHERE id = $1",
  "ORDER BY created_at",
  "fn main() -> Result",
  "pub struct System {",
  "  nodes: Vec<Node>,",
  "}",
  "impl Iterator for",
  "match result {",
  "  Ok(v) => v,",
  "  Err(_) => panic!",
  "}",
];

// Syntax highlighting color palette (outside component to avoid recreation)
const COLORS = [
  "rgba(129, 162, 190, 0.9)",
  "rgba(181, 206, 168, 0.9)",
  "rgba(206, 145, 120, 0.9)",
  "rgba(156, 220, 254, 0.9)",
  "rgba(220, 220, 170, 0.85)",
  "rgba(197, 134, 192, 0.9)",
];

interface CodeRow {
  text: string;
  color: string;
  x: number;
}

export default function BinaryReveal({ imageSrc, className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const frameRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const targetMouseRef = useRef({ x: -1000, y: -1000 });
  const hoverRef = useRef(0);
  const targetHoverRef = useRef(0);
  const scrollOffsetRef = useRef(0);
  const codeRowsRef = useRef<CodeRow[]>([]);
  const configRef = useRef({ fontSize: 0, lineHeight: 0, totalHeight: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize code rows - multiple columns to cover full figure
  const initCodeRows = (width: number, height: number): CodeRow[] => {
    const fontSize = Math.max(7, Math.floor(height / 60));
    const lineHeight = fontSize * 1.3;
    const totalRows = Math.ceil(height / lineHeight) * 2;
    
    // Create multiple columns of code
    const columns = 3;
    const columnWidth = width / columns;
    
    const rows: CodeRow[] = [];
    for (let col = 0; col < columns; col++) {
      for (let i = 0; i < totalRows; i++) {
        rows.push({
          text: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)],
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          x: columnWidth * col + 10 + (Math.random() * 15),
        });
      }
    }
    
    configRef.current = {
      fontSize,
      lineHeight,
      totalHeight: totalRows * lineHeight,
    };
    
    return rows;
  };

  // Load image and setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageRef.current = img;
      
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = img.width * dpr;
      canvas.height = img.height * dpr;
      
      // Initialize code rows
      codeRowsRef.current = initCodeRows(canvas.width, canvas.height);
      
      // Create mask canvas
      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = canvas.width;
      maskCanvas.height = canvas.height;
      const maskCtx = maskCanvas.getContext("2d")!;
      maskCtx.drawImage(img, 0, 0, canvas.width, canvas.height);
      maskCanvasRef.current = maskCanvas;
      
      setIsLoaded(true);
    };
    img.src = imageSrc;

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, [imageSrc]);

  // Animation loop
  useEffect(() => {
    if (!isLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imageRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !ctx || !img || !maskCanvas) return;

    const { fontSize, lineHeight, totalHeight } = configRef.current;
    const scrollSpeed = 0.5;

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      // Smooth mouse interpolation
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.15;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.15;
      
      // Smooth hover transition
      hoverRef.current += (targetHoverRef.current - hoverRef.current) * 0.1;

      // Update scroll offset (only when hovering)
      if (hoverRef.current > 0.1) {
        scrollOffsetRef.current += scrollSpeed;
        if (scrollOffsetRef.current >= totalHeight / 2) {
          scrollOffsetRef.current = 0;
        }
      }

      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (hoverRef.current > 0.01) {
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const baseRadius = Math.min(canvas.width, canvas.height) * 0.25;
        const radius = baseRadius * hoverRef.current;
        
        // Create code canvas with cascade
        const codeCanvas = document.createElement("canvas");
        codeCanvas.width = canvas.width;
        codeCanvas.height = canvas.height;
        const codeCtx = codeCanvas.getContext("2d")!;
        
        codeCtx.fillStyle = "#0a0a0a";
        codeCtx.fillRect(0, 0, canvas.width, canvas.height);
        
        codeCtx.font = `500 ${fontSize}px "SF Mono", "Fira Code", "Consolas", monospace`;
        codeCtx.textBaseline = "top";
        codeCtx.textAlign = "left";
        
        const rows = codeRowsRef.current;
        const columns = 3;
        const rowsPerColumn = rows.length / columns;
        
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const columnIndex = Math.floor(i / rowsPerColumn);
          const rowInColumn = i % rowsPerColumn;
          
          // Offset each column slightly for visual variety
          const columnScrollOffset = scrollOffsetRef.current * (1 + columnIndex * 0.15);
          let y = (rowInColumn * lineHeight) - (columnScrollOffset % totalHeight);
          
          if (y < -lineHeight) {
            y += totalHeight;
          }
          
          if (y > -lineHeight && y < canvas.height + lineHeight) {
            codeCtx.fillStyle = row.color;
            codeCtx.fillText(row.text, row.x, y);
          }
        }
        
        // Create masked result
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext("2d")!;
        
        // Circle mask
        tempCtx.beginPath();
        tempCtx.arc(mx, my, radius, 0, Math.PI * 2);
        tempCtx.fill();
        
        tempCtx.globalCompositeOperation = "source-in";
        tempCtx.drawImage(codeCanvas, 0, 0);
        
        // Silhouette mask
        tempCtx.globalCompositeOperation = "destination-in";
        tempCtx.drawImage(maskCanvas, 0, 0);
        
        // Draw result
        ctx.save();
        ctx.globalAlpha = hoverRef.current * 0.95;
        ctx.drawImage(tempCanvas, 0, 0);
        ctx.restore();
        
        // Ring glow
        ctx.save();
        const glowSize = 15;
        const outerGlow = ctx.createRadialGradient(mx, my, radius - glowSize, mx, my, radius + glowSize);
        outerGlow.addColorStop(0, "transparent");
        outerGlow.addColorStop(0.5, `rgba(74, 158, 255, ${0.2 * hoverRef.current})`);
        outerGlow.addColorStop(1, "transparent");
        
        ctx.beginPath();
        ctx.arc(mx, my, radius, 0, Math.PI * 2);
        ctx.lineWidth = glowSize * 2;
        ctx.strokeStyle = outerGlow;
        ctx.stroke();
        
        // Main ring
        ctx.beginPath();
        ctx.arc(mx, my, radius, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = `rgba(74, 158, 255, ${0.6 * hoverRef.current})`;
        ctx.stroke();
        ctx.restore();
        
        // Targeting brackets
        ctx.save();
        ctx.strokeStyle = `rgba(74, 158, 255, ${0.7 * hoverRef.current})`;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        const bracketSize = 12;
        const bracketOffset = radius * 0.72;
        
        ctx.beginPath();
        ctx.moveTo(mx - bracketOffset, my - bracketOffset + bracketSize);
        ctx.lineTo(mx - bracketOffset, my - bracketOffset);
        ctx.lineTo(mx - bracketOffset + bracketSize, my - bracketOffset);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(mx + bracketOffset - bracketSize, my - bracketOffset);
        ctx.lineTo(mx + bracketOffset, my - bracketOffset);
        ctx.lineTo(mx + bracketOffset, my - bracketOffset + bracketSize);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(mx - bracketOffset, my + bracketOffset - bracketSize);
        ctx.lineTo(mx - bracketOffset, my + bracketOffset);
        ctx.lineTo(mx - bracketOffset + bracketSize, my + bracketOffset);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(mx + bracketOffset - bracketSize, my + bracketOffset);
        ctx.lineTo(mx + bracketOffset, my + bracketOffset);
        ctx.lineTo(mx + bracketOffset, my + bracketOffset - bracketSize);
        ctx.stroke();
        ctx.restore();
        
        // Center dot
        ctx.save();
        ctx.beginPath();
        ctx.arc(mx, my, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74, 158, 255, ${0.8 * hoverRef.current})`;
        ctx.fill();
        ctx.restore();
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, [isLoaded]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    targetMouseRef.current = {
      x: (x / rect.width) * canvas.width,
      y: (y / rect.height) * canvas.height,
    };
  };

  const handleMouseEnter = () => {
    targetHoverRef.current = 1;
  };

  const handleMouseLeave = () => {
    targetHoverRef.current = 0;
    targetMouseRef.current = { x: -1000, y: -1000 };
  };

  return (
    <div
      ref={containerRef}
      className={`${className} relative overflow-hidden`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: "crosshair" }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain"
        style={{ 
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      />
    </div>
  );
}
