"use client";

import { useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Glyph characters - technical, monospace
const GLYPHS = "01234567890ABCDEF#$:./-\\|_[]{}()<>+=*&%@!?~^";
const GLYPH_COLS = 8;
const GLYPH_ROWS = 6;
const GLYPH_SIZE = 64; // texture cell size

// Grid configuration - denser for more detail
const GRID_WIDTH = 80;
const GRID_HEIGHT = 55;
const TILE_SIZE = 0.35;
const TILE_SPACING = 0.65;
const DENSITY = 0.25; // 25% of tiles visible for richer background

// Create glyph atlas texture from canvas
function createGlyphTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = GLYPH_COLS * GLYPH_SIZE;
  canvas.height = GLYPH_ROWS * GLYPH_SIZE;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "transparent";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `${GLYPH_SIZE * 0.7}px "Geist Mono", "SF Mono", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";

  for (let i = 0; i < GLYPHS.length && i < GLYPH_COLS * GLYPH_ROWS; i++) {
    const col = i % GLYPH_COLS;
    const row = Math.floor(i / GLYPH_COLS);
    const x = col * GLYPH_SIZE + GLYPH_SIZE / 2;
    const y = row * GLYPH_SIZE + GLYPH_SIZE / 2;
    ctx.fillText(GLYPHS[i], x, y);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

interface GlyphInstance {
  visible: boolean;
  glyphIndex: number;
  jitterTimer: number;
  jitterInterval: number;
  opacity: number;
}

function GlyphPlane() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  const scrollRef = useRef(0);
  const timeRef = useRef(0);

  // Create glyph texture
  const glyphTexture = useMemo(() => createGlyphTexture(), []);

  // Calculate total instances
  const instanceCount = GRID_WIDTH * GRID_HEIGHT;

  // Instance data
  const instanceData = useMemo(() => {
    const data: GlyphInstance[] = [];
    for (let i = 0; i < instanceCount; i++) {
      data.push({
        visible: Math.random() < DENSITY,
        glyphIndex: Math.floor(Math.random() * GLYPHS.length),
        jitterTimer: 0,
        jitterInterval: 1500 + Math.random() * 5000, // 1.5-6.5 seconds - faster changes
        opacity: 0.03 + Math.random() * 0.07, // Higher opacity 3-10%
      });
    }
    return data;
  }, [instanceCount]);

  // UV offsets for each glyph in atlas
  const getGlyphUV = (index: number) => {
    const col = index % GLYPH_COLS;
    const row = Math.floor(index / GLYPH_COLS);
    return {
      u: col / GLYPH_COLS,
      v: 1 - (row + 1) / GLYPH_ROWS,
      uSize: 1 / GLYPH_COLS,
      vSize: 1 / GLYPH_ROWS,
    };
  };

  // Custom shader material for UV offset per instance
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        map: { value: glyphTexture },
        time: { value: 0 },
        scroll: { value: 0 },
      },
      vertexShader: `
        attribute vec4 uvOffset;
        attribute float instanceOpacity;
        varying vec2 vUv;
        varying float vOpacity;
        
        void main() {
          vUv = uv * uvOffset.zw + uvOffset.xy;
          vOpacity = instanceOpacity;
          
          vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        varying vec2 vUv;
        varying float vOpacity;
        
        void main() {
          vec4 texColor = texture2D(map, vUv);
          // Muted green-gray color, zero neon
          vec3 color = vec3(0.45, 0.55, 0.45);
          gl_FragColor = vec4(color, texColor.a * vOpacity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
  }, [glyphTexture]);

  // Setup instance attributes
  useEffect(() => {
    if (!meshRef.current) return;

    const mesh = meshRef.current;
    const uvOffsets = new Float32Array(instanceCount * 4);
    const opacities = new Float32Array(instanceCount);

    instanceData.forEach((inst, i) => {
      const uv = getGlyphUV(inst.glyphIndex);
      uvOffsets[i * 4] = uv.u;
      uvOffsets[i * 4 + 1] = uv.v;
      uvOffsets[i * 4 + 2] = uv.uSize;
      uvOffsets[i * 4 + 3] = uv.vSize;
      opacities[i] = inst.visible ? inst.opacity : 0;
    });

    mesh.geometry.setAttribute(
      "uvOffset",
      new THREE.InstancedBufferAttribute(uvOffsets, 4)
    );
    mesh.geometry.setAttribute(
      "instanceOpacity",
      new THREE.InstancedBufferAttribute(opacities, 1)
    );

    // Set initial transforms
    const dummy = new THREE.Object3D();
    const gridOffsetX = (GRID_WIDTH * TILE_SPACING) / 2;
    const gridOffsetY = (GRID_HEIGHT * TILE_SPACING) / 2;

    for (let i = 0; i < instanceCount; i++) {
      const col = i % GRID_WIDTH;
      const row = Math.floor(i / GRID_WIDTH);

      dummy.position.set(
        col * TILE_SPACING - gridOffsetX,
        row * TILE_SPACING - gridOffsetY,
        0
      );
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [instanceCount, instanceData]);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    timeRef.current += delta * 1000;
    const mesh = meshRef.current;
    const scroll = scrollRef.current;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollProgress = maxScroll > 0 ? scroll / maxScroll : 0;

    // Update shader uniforms
    material.uniforms.time.value = timeRef.current;
    material.uniforms.scroll.value = scrollProgress;

    // Jitter: swap glyphs occasionally
    const uvOffsetAttr = mesh.geometry.getAttribute("uvOffset") as THREE.InstancedBufferAttribute;
    const opacityAttr = mesh.geometry.getAttribute("instanceOpacity") as THREE.InstancedBufferAttribute;
    
    let needsUpdate = false;
    const jitterMultiplier = 1 + (1 - scrollProgress) * 2; // More jitter at top

    instanceData.forEach((inst, i) => {
      if (!inst.visible) return;

      inst.jitterTimer += delta * 1000;
      
      if (inst.jitterTimer > inst.jitterInterval / jitterMultiplier) {
        inst.jitterTimer = 0;
        inst.glyphIndex = Math.floor(Math.random() * GLYPHS.length);
        
        const uv = getGlyphUV(inst.glyphIndex);
        uvOffsetAttr.setXYZW(i, uv.u, uv.v, uv.uSize, uv.vSize);
        needsUpdate = true;
      }
    });

    if (needsUpdate) {
      uvOffsetAttr.needsUpdate = true;
    }

    // Slow vertical drift
    const dummy = new THREE.Object3D();
    const gridOffsetX = (GRID_WIDTH * TILE_SPACING) / 2;
    const gridOffsetY = (GRID_HEIGHT * TILE_SPACING) / 2;
    const driftSpeed = 0.01;
    const driftAmount = (timeRef.current * driftSpeed) % TILE_SPACING;

    for (let i = 0; i < instanceCount; i++) {
      const col = i % GRID_WIDTH;
      const row = Math.floor(i / GRID_WIDTH);

      dummy.position.set(
        col * TILE_SPACING - gridOffsetX,
        (row * TILE_SPACING - gridOffsetY + driftAmount) % (GRID_HEIGHT * TILE_SPACING) - GRID_HEIGHT * TILE_SPACING / 2,
        -scroll * 0.001 // Subtle z-shift on scroll
      );
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, instanceCount]}
      material={material}
    >
      <planeGeometry args={[TILE_SIZE, TILE_SIZE]} />
    </instancedMesh>
  );
}

function Scene() {
  return (
    <>
      <GlyphPlane />
    </>
  );
}

export default function AsciiMatrix() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 20], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
