"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

// ─── Techy background elements ───
const HEX_CHARS = "0123456789ABCDEF";
const CODE_SNIPPETS = [
  "model.fit(x)",
  "torch.cuda()",
  "loss.backward()",
  "np.array([])",
  "def train():",
  "async def run()",
  "import torch",
  "batch_size=32",
  "lr=0.001",
  "epochs=100",
  "GPU:0 ACTIVE",
  "MEM: 847MB",
  "CPU: 42%",
  "latency: 12ms",
  " throughput: 1.4k",
];

interface DataStream {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  opacity: number;
}

interface CircuitTrace {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  progress: number;
  speed: number;
  opacity: number;
}

interface FloatingShape {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotSpeed: number;
  type: "square" | "diamond" | "cross" | "circle";
  opacity: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
}

interface CodeFloat {
  x: number;
  y: number;
  text: string;
  speed: number;
  opacity: number;
  size: number;
}

// ─── Pipeline stages ───
const STAGES = [
  { label: "DATA", sub: "Ingest" },
  { label: "PROCESS", sub: "Clean" },
  { label: "AI", sub: "Model", main: true },
  { label: "BUILD", sub: "System" },
  { label: "DEPLOY", sub: "Ship" },
];

interface Dot {
  id: number;
  progress: number;
  speed: number;
  lane: number;
  size: number;
}

interface Molecule {
  id: number;
  angle: number;
  radius: number;
  speed: number;
  size: number;
  opacity: number;
  color: string;
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [loadStage, setLoadStage] = useState(0);
  const [tick, setTick] = useState(0);
  const timeRef = useRef(0);

  // Background elements
  const streamsRef = useRef<DataStream[]>([]);
  const tracesRef = useRef<CircuitTrace[]>([]);
  const shapesRef = useRef<FloatingShape[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const codeFloatsRef = useRef<CodeFloat[]>([]);

  // Pipeline elements
  const dotsRef = useRef<Dot[]>([]);
  const moleculesRef = useRef<Molecule[]>([]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setLoadStage(1), 400),
      setTimeout(() => setLoadStage(2), 800),
      setTimeout(() => setLoadStage(3), 1200),
      setTimeout(() => setLoadStage(4), 1600),
      setTimeout(() => setLoadStage(5), 2000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Init all elements
  useEffect(() => {
    // Data streams (vertical falling hex)
    const streams: DataStream[] = [];
    for (let i = 0; i < 12; i++) {
      const len = 4 + Math.floor(Math.random() * 8);
      const chars: string[] = [];
      for (let j = 0; j < len; j++) {
        chars.push(HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)]);
      }
      streams.push({
        x: Math.random(),
        y: -Math.random() * 0.5,
        speed: 0.0003 + Math.random() * 0.0008,
        chars,
        opacity: 0.06 + Math.random() * 0.1,
      });
    }
    streamsRef.current = streams;

    // Circuit traces
    const traces: CircuitTrace[] = [];
    for (let i = 0; i < 8; i++) {
      traces.push({
        x1: Math.random() * 0.8 + 0.1,
        y1: Math.random() * 0.8 + 0.1,
        x2: 0,
        y2: 0,
        progress: Math.random(),
        speed: 0.002 + Math.random() * 0.004,
        opacity: 0.04 + Math.random() * 0.06,
      });
      // L-shaped traces
      const horizontal = Math.random() > 0.5;
      if (horizontal) {
        traces[i].x2 = traces[i].x1 + (Math.random() * 0.2 - 0.1);
        traces[i].y2 = traces[i].y1;
      } else {
        traces[i].x2 = traces[i].x1;
        traces[i].y2 = traces[i].y1 + (Math.random() * 0.2 - 0.1);
      }
    }
    tracesRef.current = traces;

    // Floating geometric shapes
    const shapes: FloatingShape[] = [];
    const shapeTypes: FloatingShape["type"][] = ["square", "diamond", "cross", "circle"];
    for (let i = 0; i < 15; i++) {
      shapes.push({
        x: Math.random(),
        y: Math.random(),
        size: 4 + Math.random() * 12,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
        opacity: 0.03 + Math.random() * 0.06,
      });
    }
    shapesRef.current = shapes;

    // Particles
    const parts: Particle[] = [];
    for (let i = 0; i < 30; i++) {
      parts.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0003,
        vy: (Math.random() - 0.5) * 0.0003,
        size: 0.5 + Math.random() * 1.5,
        opacity: 0.1 + Math.random() * 0.2,
        life: Math.random(),
      });
    }
    particlesRef.current = parts;

    // Code floats
    const codes: CodeFloat[] = [];
    for (let i = 0; i < 6; i++) {
      codes.push({
        x: Math.random() * 0.9 + 0.05,
        y: Math.random() * 0.9 + 0.05,
        text: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)],
        speed: 0.0001 + Math.random() * 0.0003,
        opacity: 0.04 + Math.random() * 0.06,
        size: 8 + Math.random() * 3,
      });
    }
    codeFloatsRef.current = codes;

    // Pipeline dots
    const dots: Dot[] = [];
    for (let i = 0; i < 35; i++) {
      dots.push({
        id: i,
        progress: Math.random(),
        speed: 0.001 + Math.random() * 0.004,
        lane: Math.floor(Math.random() * 3),
        size: 1 + Math.random() * 2,
      });
    }
    dotsRef.current = dots;

    // Molecules
    const colors = ["#FF7200", "#FF8C33", "#FFa855", "#5B7CFF", "#ffffff"];
    const mols: Molecule[] = [];
    for (let i = 0; i < 18; i++) {
      mols.push({
        id: i,
        angle: (Math.PI * 2 * i) / 18 + Math.random() * 0.5,
        radius: 22 + Math.random() * 45,
        speed: 0.006 + Math.random() * 0.012,
        size: 1 + Math.random() * 2.5,
        opacity: 0.3 + Math.random() * 0.7,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    moleculesRef.current = mols;
  }, []);

  // Draw
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    timeRef.current += 0.016;
    const t = timeRef.current;

    if (Math.floor(t * 10) !== Math.floor((t - 0.016) * 10)) {
      setTick(Math.floor(t * 10));
    }

    ctx.clearRect(0, 0, w, h);

    // ═══════════════════════════════════════
    // BACKGROUND TECHY ELEMENTS
    // ═══════════════════════════════════════

    // ─── Data streams (vertical falling hex columns) ───
    if (loadStage >= 1) {
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      streamsRef.current.forEach((stream) => {
        stream.y += stream.speed;
        if (stream.y > 1.3) {
          stream.y = -0.2;
          stream.x = Math.random();
          // Randomize chars
          for (let j = 0; j < stream.chars.length; j++) {
            if (Math.random() < 0.3) {
              stream.chars[j] = HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
            }
          }
        }

        const sx = stream.x * w;
        stream.chars.forEach((char, ci) => {
          const sy = (stream.y + ci * 0.025) * h;
          if (sy < -20 || sy > h + 20) return;
          const fade = 1 - Math.abs(sy - h * 0.5) / (h * 0.5);
          const alpha = stream.opacity * Math.max(0, fade) * (1 - ci * 0.08);
          ctx.fillStyle = `rgba(255, 114, 0, ${alpha})`;
          ctx.fillText(char, sx, sy);
        });
      });
    }

    // ─── Circuit traces ───
    if (loadStage >= 1) {
      tracesRef.current.forEach((trace) => {
        trace.progress = (trace.progress + trace.speed) % 1;
        const x1 = trace.x1 * w;
        const y1 = trace.y1 * h;
        const x2 = trace.x2 * w;
        const y2 = trace.y2 * h;

        // Full line
        ctx.strokeStyle = `rgba(255, 114, 0, ${trace.opacity * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Traveling dot
        const dx = x2 - x1;
        const dy = y2 - y1;
        const px = x1 + dx * trace.progress;
        const py = y1 + dy * trace.progress;

        ctx.fillStyle = `rgba(255, 114, 0, ${trace.opacity * 2})`;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();

        // Glow at dot
        const glow = ctx.createRadialGradient(px, py, 0, px, py, 6);
        glow.addColorStop(0, `rgba(255, 114, 0, ${trace.opacity})`);
        glow.addColorStop(1, "rgba(255, 114, 0, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();

        // Junction dots at endpoints
        ctx.fillStyle = `rgba(255, 114, 0, ${trace.opacity})`;
        ctx.beginPath();
        ctx.arc(x1, y1, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x2, y2, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // ─── Floating geometric shapes ───
    if (loadStage >= 2) {
      shapesRef.current.forEach((shape) => {
        shape.rotation += shape.rotSpeed;
        const sx = shape.x * w;
        const sy = shape.y * h;
        const s = shape.size;

        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(shape.rotation);
        ctx.strokeStyle = `rgba(255, 114, 0, ${shape.opacity})`;
        ctx.lineWidth = 0.5;

        switch (shape.type) {
          case "square":
            ctx.strokeRect(-s / 2, -s / 2, s, s);
            break;
          case "diamond":
            ctx.beginPath();
            ctx.moveTo(0, -s / 2);
            ctx.lineTo(s / 2, 0);
            ctx.lineTo(0, s / 2);
            ctx.lineTo(-s / 2, 0);
            ctx.closePath();
            ctx.stroke();
            break;
          case "cross":
            ctx.beginPath();
            ctx.moveTo(-s / 2, 0);
            ctx.lineTo(s / 2, 0);
            ctx.moveTo(0, -s / 2);
            ctx.lineTo(0, s / 2);
            ctx.stroke();
            break;
          case "circle":
            ctx.beginPath();
            ctx.arc(0, 0, s / 2, 0, Math.PI * 2);
            ctx.stroke();
            break;
        }
        ctx.restore();
      });
    }

    // ─── Floating code snippets ───
    if (loadStage >= 2) {
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.textAlign = "left";
      codeFloatsRef.current.forEach((cf) => {
        cf.y -= cf.speed;
        if (cf.y < -0.1) {
          cf.y = 1.1;
          cf.x = Math.random() * 0.9 + 0.05;
          cf.text = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
        }
        const cx = cf.x * w;
        const cy = cf.y * h;
        ctx.fillStyle = `rgba(255, 114, 0, ${cf.opacity})`;
        ctx.fillText(cf.text, cx, cy);
      });
    }

    // ─── Particles (drifting) ───
    if (loadStage >= 2) {
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 0.002;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;

        const px = p.x * w;
        const py = p.y * h;
        const alpha = p.opacity * (0.5 + 0.5 * Math.sin(p.life * 3));

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // ─── Scan lines (horizontal) ───
    if (loadStage >= 3) {
      const scanY = ((t * 30) % h);
      const grad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      grad.addColorStop(0, "rgba(255, 114, 0, 0)");
      grad.addColorStop(0.5, "rgba(255, 114, 0, 0.03)");
      grad.addColorStop(1, "rgba(255, 114, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 30, w, 60);
    }

    // ═══════════════════════════════════════
    // PIPELINE VISUALIZATION (right side)
    // ═══════════════════════════════════════

    if (loadStage >= 3) {
      const pipeY = h * 0.38;
      const pipeLeft = w * 0.52;
      const pipeRight = w * 0.94;
      const pipeLen = pipeRight - pipeLeft;

      // Connection line
      ctx.strokeStyle = "rgba(255, 114, 0, 0.08)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(pipeLeft, pipeY);
      ctx.lineTo(pipeRight, pipeY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Stage nodes
      STAGES.forEach((stage, i) => {
        const nx = pipeLeft + (pipeLen * i) / (STAGES.length - 1);
        const ny = pipeY;

        if (stage.main) {
          const glowR = 30 + Math.sin(t * 2) * 4;
          const glow = ctx.createRadialGradient(nx, ny, 0, nx, ny, glowR);
          glow.addColorStop(0, "rgba(255, 114, 0, 0.18)");
          glow.addColorStop(1, "rgba(255, 114, 0, 0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(nx, ny, glowR, 0, Math.PI * 2);
          ctx.fill();

          const pulseR = 20 + Math.sin(t * 3) * 5;
          ctx.strokeStyle = `rgba(255, 114, 0, ${0.12 + Math.sin(t * 2.5) * 0.06})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(nx, ny, pulseR, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = "rgba(255, 114, 0, 0.1)";
          ctx.strokeStyle = "rgba(255, 114, 0, 0.5)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(nx, ny, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#FF7200";
          ctx.beginPath();
          ctx.arc(nx, ny, 5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
          ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(nx, ny, 11, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
          ctx.beginPath();
          ctx.arc(nx, ny, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = stage.main ? "#FF7200" : "rgba(255, 255, 255, 0.25)";
        ctx.font = "600 8px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(stage.label, nx, ny + 24);
        ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
        ctx.font = "400 7px 'JetBrains Mono', monospace";
        ctx.fillText(stage.sub, nx, ny + 34);
      });

      // Flow dots
      if (loadStage >= 4) {
        dotsRef.current.forEach((dot) => {
          dot.progress = (dot.progress + dot.speed) % 1;
          const x = pipeLeft + pipeLen * dot.progress;
          const yOff = (dot.lane - 1) * 5;
          const y = pipeY + yOff;

          const glow = ctx.createRadialGradient(x, y, 0, x, y, 5);
          glow.addColorStop(0, "rgba(255, 114, 0, 0.35)");
          glow.addColorStop(1, "rgba(255, 114, 0, 0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(255, 114, 0, ${0.4 + dot.size * 0.2})`;
          ctx.beginPath();
          ctx.arc(x, y, dot.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    }

    // ─── Molecule cluster (bottom-right) ───
    if (loadStage >= 4) {
      const cx = w * 0.75;
      const cy = h * 0.72;

      const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 22);
      coreGlow.addColorStop(0, "rgba(255, 114, 0, 0.18)");
      coreGlow.addColorStop(1, "rgba(255, 114, 0, 0)");
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(255, 114, 0, 0.08)";
      ctx.strokeStyle = "rgba(255, 114, 0, 0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#FF7200";
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();

      [32, 52, 72].forEach((r, ri) => {
        ctx.strokeStyle = `rgba(255, 114, 0, ${0.03 + ri * 0.01})`;
        ctx.lineWidth = 0.5;
        ctx.setLineDash([2, 6]);
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * 0.55, ri * 0.35, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      moleculesRef.current.forEach((p) => {
        p.angle += p.speed;
        const ox = cx + Math.cos(p.angle) * p.radius;
        const oy = cy + Math.sin(p.angle) * p.radius * 0.55;

        ctx.strokeStyle = `rgba(255, 114, 0, ${p.opacity * 0.06})`;
        ctx.lineWidth = 0.4;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(ox, oy);
        ctx.stroke();

        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, p.size * 3);
        const a = Math.round(p.opacity * 55).toString(16).padStart(2, "0");
        g.addColorStop(0, `${p.color}${a}`);
        g.addColorStop(1, `${p.color}00`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(ox, oy, p.size * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(ox, oy, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    }

    animRef.current = requestAnimationFrame(draw);
  }, [loadStage]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const t = tick * 0.1;
  const pulse = (base: number, phase: number, speed = 2, amp = 0.2) =>
    base + Math.sin(t * speed + phase) * amp;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-[#080808]" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Gradient orbs */}
      <div className="absolute top-[25%] left-[8%] w-[500px] h-[500px] bg-[#FF7200]/[0.02] rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[8%] w-[400px] h-[400px] bg-[#5B7CFF]/[0.015] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-28 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 items-center">

          {/* ─── LEFT: Company name + content ─── */}
          <div>
            {/* Full-size 3D Logo */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 30, rotateX: 15 }}
              animate={loadStage >= 1 ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="inline-block relative"
                style={{ perspective: "800px" }}
              >
                <motion.img
                  src="/brand-logo.png"
                  alt="ASRT"
                  className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 object-contain"
                  style={{
                    filter: "drop-shadow(0 8px 24px rgba(255, 114, 0, 0.25)) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5))",
                    transform: "perspective(800px) rotateY(-5deg) rotateX(3deg)",
                  }}
                  animate={{
                    filter: [
                      "drop-shadow(0 8px 24px rgba(255, 114, 0, 0.25)) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5))",
                      "drop-shadow(0 12px 32px rgba(255, 114, 0, 0.35)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.6))",
                      "drop-shadow(0 8px 24px rgba(255, 114, 0, 0.25)) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5))",
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Glow ring behind logo */}
                <div
                  className="absolute inset-0 -m-4 rounded-full pointer-events-none"
                  style={{
                    background: "radial-gradient(circle, rgba(255, 114, 0, 0.08) 0%, transparent 70%)",
                  }}
                />
              </div>
            </motion.div>

            <motion.div
              className="inline-flex items-center gap-2.5 mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={loadStage >= 2 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div className="w-8 h-px bg-[#FF7200]/40" />
              <span className="tech-label text-[10px] tracking-[0.25em] text-[#FF7200]/70">
                APPLIED AI RESEARCH
              </span>
            </motion.div>

            <motion.h1
              className="mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={loadStage >= 2 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="block text-[2.2rem] sm:text-4xl md:text-5xl lg:text-[3.4rem] font-bold text-white leading-[1.08] tracking-tight">
                APPLIED SYSTEMS
              </span>
              <span className="block text-[2.2rem] sm:text-4xl md:text-5xl lg:text-[3.4rem] font-bold leading-[1.08] tracking-tight">
                <span className="bg-gradient-to-r from-[#FF7200] via-[#FF8C33] to-[#FFa855] bg-clip-text text-transparent">
                  RESEARCH AND
                </span>
              </span>
              <span className="block text-[2.2rem] sm:text-4xl md:text-5xl lg:text-[3.4rem] font-bold text-white/80 leading-[1.08] tracking-tight">
                TECHNOLOGY
              </span>
              <span className="block text-base sm:text-lg font-medium text-white/15 mt-3 tracking-wider">
                (OPC) PRIVATE LIMITED
              </span>
            </motion.h1>

            <motion.p
              className="text-base md:text-lg text-white/30 leading-relaxed mb-10 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={loadStage >= 3 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Building intelligent systems through AI, machine learning,
              robotics, and advanced computing — from research to production.
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={loadStage >= 3 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.45 }}
            >
              <button
                onClick={() => scrollTo("solutions")}
                className="group px-7 py-3.5 bg-[#FF7200] hover:bg-[#E66800] text-white font-medium rounded-xl transition-all magnetic-btn flex items-center gap-2.5 text-[14px] tracking-wide"
              >
                <span>Book a demo</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button
                onClick={() => scrollTo("about")}
                className="px-7 py-3.5 text-white/30 border border-white/[0.06] hover:border-[#FF7200]/25 hover:text-white/50 rounded-xl transition-all text-[14px] tracking-wide"
              >
                Learn More
              </button>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 15 }}
              animate={loadStage >= 4 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {["AI / ML", "Robotics", "Software", "Advanced Computing"].map((label, i) => (
                <button
                  key={label}
                  className={`px-4 py-2 text-[12px] rounded-full border transition-all ${
                    i === 0
                      ? "border-[#FF7200]/30 text-white bg-[#FF7200]/[0.05]"
                      : "border-white/[0.05] text-white/30 hover:text-white/45 hover:border-white/[0.1]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </motion.div>
          </div>

          {/* ─── RIGHT: Tech visualization panel ─── */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 40 }}
            animate={loadStage >= 3 ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <span className="tech-label text-[9px] tracking-[0.2em] text-white/20">PIPELINE</span>
                  <div className="w-px h-3 bg-white/8" />
                  <span className="tech-label text-[9px] tracking-[0.2em] text-white/20">RESEARCH → PRODUCTION</span>
                </div>
                <span className="tech-label text-[9px] text-[#FF7200]/40">ACTIVE</span>
              </div>

              <div className="px-5 py-5">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/10" style={{ opacity: pulse(0.25, i * 0.4, 2, 0.15) }} />
                  ))}
                  <div className="mx-2 w-8 h-5 rounded border border-white/8 bg-white/[0.02] flex items-center justify-center">
                    <div className="w-4 h-px bg-white/10" />
                  </div>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/8" />
                  ))}
                </div>
              </div>

              <div className="px-5">
                <div className="h-px bg-gradient-to-r from-transparent via-[#FF7200]/15 to-transparent" />
              </div>

              <div className="px-5 py-3 border-b border-white/[0.04]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="tech-label text-[9px] tracking-[0.2em] text-[#FF7200]/50">SAME INPUT</span>
                    <div className="w-px h-3 bg-[#FF7200]/15" />
                    <span className="tech-label text-[9px] tracking-[0.2em] text-[#FF7200]/50">ASRT · BUILT FOR THE PROBLEM</span>
                  </div>
                  <span className="tech-label text-[9px] text-[#FF7200]/40">3× FASTER</span>
                </div>
              </div>

              <div className="px-5 py-5 relative">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: `rgba(255, 114, 0, ${pulse(0.3, i * 0.8, 3, 0.3)})`,
                        boxShadow: `0 0 ${4 + Math.sin(t + i) * 2}px rgba(255, 114, 0, 0.25)`,
                      }}
                    />
                  ))}

                  <div className="relative mx-2">
                    <div className="w-12 h-8 rounded-lg border border-[#FF7200]/25 bg-[#FF7200]/[0.05] flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 flex flex-col justify-center gap-1 px-2">
                        {[0.6, 0.85, 0.5].map((wf, i) => (
                          <div key={i} className="h-px bg-[#FF7200]/25 rounded-full" style={{ width: `${wf * 100}%`, opacity: pulse(0.3, i * 1.2, 4, 0.3) }} />
                        ))}
                      </div>
                      <div className="w-2 h-2 rounded-full bg-[#FF7200]" style={{ boxShadow: `0 0 ${6 + Math.sin(t * 3) * 3}px rgba(255, 114, 0, 0.5)` }} />
                    </div>
                    <div className="absolute -inset-2 bg-[#FF7200]/[0.03] rounded-xl blur-md" />
                  </div>

                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#FF7200]/35" style={{ opacity: pulse(0.3, i * 0.6, 2.5, 0.3) }} />
                  ))}
                </div>

                <div className="absolute right-3 bottom-3 w-16 h-16">
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#FF7200]/50 border border-[#FF7200]/30" />
                  {Array.from({ length: 5 }).map((_, i) => {
                    const angle = t * 0.7 + (Math.PI * 2 * i) / 5;
                    const r = 24;
                    const x = 32 + Math.cos(angle) * r;
                    const y = 32 + Math.sin(angle) * r * 0.65;
                    return (
                      <div key={i}>
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 64 64">
                          <line x1={32} y1={32} x2={x} y2={y} stroke="rgba(255,114,0,0.08)" strokeWidth="0.4" />
                        </svg>
                        <div className="absolute w-1 h-1 rounded-full bg-[#FF7200]/40" style={{ left: x - 2, top: y - 2 }} />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="px-5 py-3 border-t border-white/[0.04]">
                <p className="tech-label text-[10px] text-white/15 leading-relaxed">
                  From data ingestion to deployment — systems engineered for the problem, not the platform.
                </p>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#FF7200]/[0.02] rounded-full blur-2xl pointer-events-none" />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={loadStage >= 5 ? { opacity: 1 } : {}}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="w-5 h-9 border border-white/10 rounded-full flex justify-center pt-2"
          animate={{ borderColor: ["rgba(255,255,255,0.08)", "rgba(255,114,0,0.2)", "rgba(255,255,255,0.08)"] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <motion.div
            className="w-[3px] h-2 bg-[#FF7200]/40 rounded-full"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
