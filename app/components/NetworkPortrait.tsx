"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface FloatingNode {
  id: string;
  label: string;
  headerColor: string;
  inputs: string[];
  outputs: string[];
  // Fixed position
  baseX: number;
  baseY: number;
  // Floating animation parameters
  floatAmplitudeX: number;
  floatAmplitudeY: number;
  floatSpeedX: number;
  floatSpeedY: number;
  floatPhase: number;
}

const FLOATING_NODES: FloatingNode[] = [
  {
    id: "image",
    label: "Image",
    headerColor: "#6b3d7a",
    inputs: ["UV"],
    outputs: ["Color"],
    baseX: -145,
    baseY: -70,
    floatAmplitudeX: 6,
    floatAmplitudeY: 8,
    floatSpeedX: 0.0008,
    floatSpeedY: 0.001,
    floatPhase: 0,
  },
  {
    id: "noise",
    label: "Noise",
    headerColor: "#6b3d7a",
    inputs: [],
    outputs: ["Fac"],
    baseX: 130,
    baseY: -85,
    floatAmplitudeX: 7,
    floatAmplitudeY: 5,
    floatSpeedX: 0.0009,
    floatSpeedY: 0.0007,
    floatPhase: Math.PI * 0.5,
  },
  {
    id: "mix",
    label: "Mix",
    headerColor: "#6b8e4e",
    inputs: ["A", "B"],
    outputs: ["Out"],
    baseX: -155,
    baseY: 65,
    floatAmplitudeX: 5,
    floatAmplitudeY: 7,
    floatSpeedX: 0.0007,
    floatSpeedY: 0.0009,
    floatPhase: Math.PI,
  },
  {
    id: "bsdf",
    label: "BSDF",
    headerColor: "#4b6e9e",
    inputs: ["Color"],
    outputs: ["Shader"],
    baseX: 140,
    baseY: 75,
    floatAmplitudeX: 6,
    floatAmplitudeY: 6,
    floatSpeedX: 0.00085,
    floatSpeedY: 0.0011,
    floatPhase: Math.PI * 1.5,
  },
];

export default function NetworkPortrait() {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [positions, setPositions] = useState(() => {
    // Initial positions
    const initial: { [key: string]: { x: number; y: number } } = {};
    FLOATING_NODES.forEach((node) => {
      initial[node.id] = {
        x: node.baseX,
        y: node.baseY,
      };
    });
    return initial;
  });

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = "/portrait.png";
    
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Animate floating nodes - gentle floating in place
  useEffect(() => {
    let animationId: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;

      const newPositions: { [key: string]: { x: number; y: number } } = {};
      
      FLOATING_NODES.forEach((node) => {
        // Gentle floating motion around base position
        const floatX = Math.sin(elapsed * node.floatSpeedX + node.floatPhase) * node.floatAmplitudeX;
        const floatY = Math.cos(elapsed * node.floatSpeedY + node.floatPhase) * node.floatAmplitudeY;
        
        newPositions[node.id] = {
          x: node.baseX + floatX,
          y: node.baseY + floatY,
        };
      });

      setPositions(newPositions);
      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Generate bezier curve path from node to center
  const getConnectionPath = (nodePos: { x: number; y: number }) => {
    const startX = 225 + nodePos.x; // center of container + offset
    const startY = 250 + nodePos.y;
    const endX = 225; // center
    const endY = 250;
    
    // Control points for smooth curve
    const midX = (startX + endX) / 2;
    const cp1X = startX + (endX - startX) * 0.3;
    const cp1Y = startY;
    const cp2X = endX - (endX - startX) * 0.3;
    const cp2Y = endY;
    
    return `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.6 }}
      className="relative select-none"
      style={{ width: '450px', height: '500px' }}
    >
      {/* Connection lines SVG layer */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 3 }}
      >
        <defs>
          {FLOATING_NODES.map((node) => (
            <linearGradient
              key={`grad-${node.id}`}
              id={`gradient-${node.id}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={node.headerColor} stopOpacity="0.7" />
              <stop offset="100%" stopColor={node.headerColor} stopOpacity="0.2" />
            </linearGradient>
          ))}
        </defs>
        
        {FLOATING_NODES.map((node, index) => {
          const pos = positions[node.id];
          const isHovered = hoveredNode === node.id;
          const path = getConnectionPath(pos);
          
          return (
            <motion.path
              key={`connection-${node.id}`}
              d={path}
              fill="none"
              stroke={isHovered ? node.headerColor : `url(#gradient-${node.id})`}
              strokeWidth={isHovered ? 2.5 : 1.5}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: isVisible ? 1 : 0, 
                opacity: isVisible ? (isHovered ? 1 : 0.6) : 0 
              }}
              transition={{ 
                pathLength: { duration: 0.8, delay: 0.4 + index * 0.1 },
                opacity: { duration: 0.3 }
              }}
              style={{
                filter: isHovered ? `drop-shadow(0 0 6px ${node.headerColor})` : 'none',
              }}
            />
          );
        })}
        
        {/* Center connection point */}
        <motion.circle
          cx={225}
          cy={250}
          r={6}
          fill="#2a2a2a"
          stroke="rgba(100, 150, 200, 0.6)"
          strokeWidth={2}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: isVisible ? 1 : 0, opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 0.8, duration: 0.3 }}
        />
      </svg>

      {/* macOS Window - Behind portrait */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="absolute left-1/2 top-[calc(50%+10px)] -translate-x-1/2 -translate-y-1/2"
        style={{ zIndex: 1 }}
      >
        <div 
          className="relative rounded-lg overflow-hidden"
          style={{
            width: '260px',
            height: '260px',
            background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)',
            boxShadow: '0 20px 50px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          }}
        >
          {/* Window Title Bar */}
          <div 
            className="flex items-center px-2.5 h-6"
            style={{
              background: 'linear-gradient(180deg, #3a3a3a 0%, #2d2d2d 100%)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
            }}
          >
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
              <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
              <div className="w-2 h-2 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-[9px] text-[#777]">Shader Editor - marco_blend.glb</span>
            </div>
            <div className="w-10" />
          </div>

          {/* Grid content */}
          <div 
            className="absolute inset-0 top-6"
            style={{
              backgroundSize: '14px 14px',
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
            }}
          />
        </div>
      </motion.div>

      {/* Portrait - Floating above window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ 
          opacity: imageLoaded ? 1 : 0, 
          scale: imageLoaded ? 1 : 0.9,
          y: imageLoaded ? [0, -8, 0] : 30,
        }}
        transition={{ 
          opacity: { duration: 0.5, delay: 0.3 },
          scale: { duration: 0.5, delay: 0.3 },
          y: { 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 0.3,
          },
        }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ zIndex: 10 }}
      >
        {/* Glow behind portrait */}
        <div 
          className="absolute -inset-10 blur-3xl opacity-30"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(80, 80, 80, 0.9), transparent 70%)',
          }}
        />
        
        {/* Portrait image */}
        <div 
          className="relative rounded-lg overflow-hidden"
          style={{
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)',
          }}
        >
          <img
            src="/portrait.png"
            alt="Portrait"
            className="w-[200px] h-auto object-contain"
            style={{
              filter: "contrast(1.02) brightness(1.01)",
            }}
          />
        </div>
      </motion.div>

      {/* Floating Nodes */}
      {FLOATING_NODES.map((node, index) => {
        const pos = positions[node.id];
        const isHovered = hoveredNode === node.id;
        const nodeWidth = 85;
        const nodeHeight = 50;
        
        return (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: isVisible ? (isHovered ? 1 : 0.85) : 0,
              scale: isVisible ? (isHovered ? 1.08 : 1) : 0.5,
            }}
            transition={{ 
              opacity: { duration: 0.4, delay: 0.3 + index * 0.1 },
              scale: { duration: 0.2 },
            }}
            className="absolute"
            style={{
              left: `calc(50% + ${pos.x}px)`,
              top: `calc(50% + ${pos.y}px)`,
              transform: 'translate(-50%, -50%)',
              zIndex: isHovered ? 20 : 5,
            }}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Node container */}
            <div 
              className="relative cursor-pointer transition-all duration-200"
              style={{
                width: nodeWidth,
                filter: isHovered ? 'drop-shadow(0 4px 20px rgba(0,0,0,0.5))' : 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
              }}
            >
              {/* Node body */}
              <div 
                className="rounded overflow-hidden"
                style={{
                  background: isHovered ? '#3a3a3a' : '#282828',
                  border: `1px solid ${isHovered ? 'rgba(255,255,255,0.2)' : 'rgba(70,70,70,0.8)'}`,
                }}
              >
                {/* Header */}
                <div 
                  className="px-2 py-1 text-[9px] font-medium text-white/90"
                  style={{ background: node.headerColor }}
                >
                  {node.label}
                </div>
                
                {/* Content */}
                <div className="p-1.5 space-y-1">
                  {node.inputs.map((input, i) => (
                    <div key={`in-${i}`} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#1a1a1a] border border-[rgba(130,130,130,0.6)]" />
                      <span className="text-[8px] text-[#999]">{input}</span>
                    </div>
                  ))}
                  {node.outputs.map((output, i) => (
                    <div key={`out-${i}`} className="flex items-center justify-end gap-1.5">
                      <span className="text-[8px] text-[#999]">{output}</span>
                      <div 
                        className="w-2 h-2 rounded-full border border-[rgba(180,180,180,0.5)]"
                        style={{ background: node.headerColor }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-2 left-0 right-0 text-center"
        style={{ zIndex: 15 }}
      >
        <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--foreground-subtle)] opacity-40">
          NODE.RENDER
        </span>
      </motion.div>
    </motion.div>
  );
}
