"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// ── GLSL — molten amber FBM, rendered into the letter shapes ──────────────
const VERT = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0); // bypass projection — fill clip space
  }
`;

const FRAG = /* glsl */`
  uniform float uTime;
  uniform vec2  uMouse;
  varying vec2  vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(127.34, 311.7));
    p += dot(p, p + 41.57);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
               mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }

  float fbm(vec2 p) {
    float v=0.0, a=0.5;
    vec2 shift=vec2(100.0);
    mat2 rot=mat2(cos(.5),sin(.5),-sin(.5),cos(.5));
    for(int i=0;i<7;i++){v+=a*noise(p);p=rot*p*2.1+shift;a*=.5;}
    return v;
  }

  void main() {
    vec2 uv = vUv + uMouse * 0.12;

    vec2 q = vec2(fbm(uv + uTime*0.06),
                  fbm(uv + vec2(1.7,9.2) + uTime*0.05));

    vec2 r = vec2(fbm(uv + 1.5*q + vec2(1.7,9.2) + uTime*0.04),
                  fbm(uv + 1.5*q + vec2(8.3,2.8) + uTime*0.03));

    float f = fbm(uv + 2.5*r);

    // Molten amber palette — vivid inside the letterforms
    vec3 c0 = vec3(0.10, 0.04, 0.00);  // near-black amber
    vec3 c1 = vec3(0.40, 0.18, 0.01);  // dark amber
    vec3 c2 = vec3(0.91, 0.57, 0.07);  // #e89112 — core amber
    vec3 c3 = vec3(1.00, 0.88, 0.52);  // gold-white peak

    vec3 col = mix(c0, c1, smoothstep(0.00, 0.35, f));
    col      = mix(col,c2, smoothstep(0.35, 0.65, f));
    col      = mix(col,c3, smoothstep(0.76, 0.94, f));

    gl_FragColor = vec4(col, 1.0);
  }
`;

interface Props {
  line1?: string;
  line2?: string;
}

export default function MaskedTextHero({ line1 = "BUILD", line2 = "THINGS." }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas2d = canvasRef.current;
    if (!canvas2d) return;

    let rafId      = 0;
    let renderer: THREE.WebGLRenderer | null = null;
    let mounted    = true;

    const mouse = { x: 0.5, y: 0.5, sx: 0.5, sy: 0.5 };

    const onMove = (e: MouseEvent) => {
      const rect = canvas2d.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const run = async () => {
      await document.fonts.ready;
      // One rAF to let the browser complete layout before measuring
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      if (!mounted) return;

      // Measure the canvas's actual rendered container, not the full window
      const containerRect = canvas2d.getBoundingClientRect();
      const W = Math.max(1, Math.floor(containerRect.width  || canvas2d.offsetWidth  || window.innerWidth));
      const H = Math.max(1, Math.floor(containerRect.height || canvas2d.offsetHeight || window.innerHeight));

      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas2d.width  = W * dpr;
      canvas2d.height = H * dpr;
      // Don't override CSS dimensions — let parent layout control them

      const ctx = canvas2d.getContext("2d")!;
      ctx.scale(dpr, dpr);

      // ── offscreen WebGL canvas ────────────────────────────────────────
      const glCanvas = document.createElement("canvas");
      glCanvas.width  = W;
      glCanvas.height = H;

      renderer = new THREE.WebGLRenderer({
        canvas: glCanvas,
        antialias: false,
        alpha: false,
        preserveDrawingBuffer: true, // required for drawImage cross-canvas
      });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

      const scene    = new THREE.Scene();
      const camera   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      camera.position.z = 1;

      const uniforms = {
        uTime:  { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
      };

      scene.add(new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms }),
      ));

      // ── fit font size so each word fills the full width ───────────────
      const PAD   = W * 0.03;
      const TGT_W = W - PAD * 2;
      const FONT  = `"Space Grotesk", system-ui, sans-serif`;

      const fitSize = (text: string, targetW: number) => {
        let lo = 10, hi = 3000;
        for (let i = 0; i < 32; i++) {
          const mid = (lo + hi) * 0.5;
          ctx.font = `700 ${mid}px ${FONT}`;
          (ctx.measureText(text).width < targetW) ? (lo = mid) : (hi = mid);
        }
        return (lo + hi) * 0.5;
      };

      const sz1 = fitSize(line1, TGT_W);
      const sz2 = fitSize(line2, TGT_W);

      // Cap heights (roughly 72 % of em for Space Grotesk)
      const cap1 = sz1 * 0.72;
      const cap2 = sz2 * 0.72;
      const GAP  = H * 0.025;

      // Center block vertically with slight upward bias
      const totalH = cap1 + GAP + cap2;
      const baseY1 = (H - totalH) * 0.5 + cap1;
      const baseY2 = baseY1 + GAP + cap2;

      const t0 = performance.now();

      const draw = () => {
        rafId = requestAnimationFrame(draw);
        const elapsed = (performance.now() - t0) / 1000;

        // smooth mouse
        mouse.sx += (mouse.x - mouse.sx) * 0.05;
        mouse.sy += (mouse.y - mouse.sy) * 0.05;

        // update WebGL uniforms
        uniforms.uTime.value = elapsed;
        uniforms.uMouse.value.set(mouse.sx * 2 - 1, -(mouse.sy * 2 - 1));
        renderer!.render(scene, camera);

        // ── 2D compositing ──────────────────────────────────────────────
        ctx.clearRect(0, 0, W, H);
        ctx.textBaseline = "alphabetic";
        ctx.textAlign    = "left";

        // 1. Amber glow bleeding outside the letters (drawn FIRST, behind)
        ctx.save();
        ctx.shadowBlur  = Math.round(sz1 * 0.15);
        ctx.shadowColor = "rgba(232,160,32,0.35)";
        ctx.fillStyle   = "rgba(232,160,32,0.12)";
        ctx.font = `700 ${sz1}px ${FONT}`;
        ctx.fillText(line1, PAD, baseY1);
        ctx.font = `700 ${sz2}px ${FONT}`;
        ctx.fillText(line2, PAD, baseY2);
        ctx.restore();

        // 2. White text shape → this becomes the alpha mask
        ctx.fillStyle = "white";
        ctx.font = `700 ${sz1}px ${FONT}`;
        ctx.fillText(line1, PAD, baseY1);
        ctx.font = `700 ${sz2}px ${FONT}`;
        ctx.fillText(line2, PAD, baseY2);

        // 3. Composite WebGL output inside the mask ONLY
        ctx.globalCompositeOperation = "source-in";
        ctx.drawImage(glCanvas, 0, 0, W, H);
        ctx.globalCompositeOperation = "source-over";
      };

      draw();
    };

    run();

    return () => {
      mounted = false;
      cancelAnimationFrame(rafId);
      renderer?.dispose();
      window.removeEventListener("mousemove", onMove);
    };
  }, [line1, line2]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ display: "block", width: "100%", height: "100%", position: "absolute", inset: 0 }}
    />
  );
}
