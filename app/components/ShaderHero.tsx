"use client";

import { useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    // bypass projection — plane fills clip space
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const frag = /* glsl */ `
  uniform float uTime;
  uniform vec2  uMouse;
  varying vec2  vUv;

  // Hash (value noise building block)
  float hash(vec2 p) {
    p = fract(p * vec2(127.34, 311.7));
    p += dot(p, p + 41.57);
    return fract(p.x * p.y);
  }

  // Smooth value noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1,0)), f.x),
      mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
      f.y
    );
  }

  // Fractal Brownian Motion
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2  shift = vec2(100.0);
    mat2  rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p  = rot * p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;

    // gentle mouse pull on the domain
    uv += uMouse * 0.08;

    // domain-warped FBM — gives organic flowing look
    vec2 q = vec2(fbm(uv + uTime * 0.04),
                  fbm(uv + vec2(1.7, 9.2) + uTime * 0.035));

    vec2 r = vec2(fbm(uv + 1.4 * q + vec2(1.7, 9.2) + uTime * 0.025),
                  fbm(uv + 1.4 * q + vec2(8.3, 2.8) + uTime * 0.020));

    float f = fbm(uv + 2.2 * r);

    // ── palette ─────────────────────────────────────────────────────────
    // base dark: #0c0b09
    vec3 cDark  = vec3(0.047, 0.043, 0.035);
    // warm mid: #1c1612
    vec3 cMid   = vec3(0.11,  0.086, 0.071);
    // amber vein: #e8a020 — used very sparingly
    vec3 cAmber = vec3(0.91,  0.627, 0.125);

    vec3 col = mix(cDark, cMid, smoothstep(0.0, 0.6, f));
    // faint amber bleed only at the brightest noise peaks
    col = mix(col, cAmber, smoothstep(0.72, 0.88, f) * 0.18);

    // soft radial vignette (darker at edges)
    float vig = 1.0 - smoothstep(0.3, 1.2, length(vUv - 0.5) * 1.6);
    col *= vig;

    gl_FragColor = vec4(col, 1.0);
  }
`;

// Uniforms live outside the component so React re-renders don't recreate them
const uniforms = {
  uTime:  { value: 0 },
  uMouse: { value: new THREE.Vector2(0, 0) },
};

function Plane() {
  const smoothMouse = useRef(new THREE.Vector2(0, 0));
  const rawMouse    = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawMouse.current.set(
        (e.clientX / window.innerWidth)  * 2 - 1,
       -(e.clientY / window.innerHeight) * 2 + 1,
      );
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(({ clock }) => {
    // lerp mouse for smoothness
    smoothMouse.current.lerp(rawMouse.current, 0.04);
    uniforms.uTime.value  = clock.getElapsedTime();
    uniforms.uMouse.value.copy(smoothMouse.current);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function ShaderHero() {
  return (
    <Canvas
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
      frameloop="always"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <Plane />
    </Canvas>
  );
}
