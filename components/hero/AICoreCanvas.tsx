"use client";

import { useEffect, useRef } from "react";
import { neuralGraphDesktop, neuralGraphMobile, headProfile } from "@/lib/hero-neural";

type Pulse = {
  edge: number;
  t: number;
  speed: number;
  reverse: boolean;
  active: boolean;
};

export default function AICoreCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const graph = isMobile ? neuralGraphMobile : neuralGraphDesktop;
    const { nodes, edges } = graph;
    const edgeCount = Math.max(edges.length, 1);

    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });
    if (!ctx) return;

    const node = canvas;
    const canvasCtx: CanvasRenderingContext2D = ctx;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5);
    let width = 1;
    let height = 1;
    let raf = 0;
    let running = !document.hidden && !reducedMotion;
    let nextBurst = 8000 + Math.random() * 4000;
    let burstUntil = 0;

    const basePulses = isMobile ? 5 : 8;
    const pulses: Pulse[] = Array.from({ length: isMobile ? 10 : 16 }, (_, i) => ({
      edge: Math.floor(Math.random() * edgeCount),
      t: Math.random(),
      speed: 0.0028 + Math.random() * 0.0055,
      reverse: Math.random() > 0.5,
      active: i < basePulses,
    }));

    function recycle(pulse: Pulse, forceActive = false) {
      pulse.t = 0;
      pulse.edge = Math.floor(Math.random() * edgeCount);
      pulse.speed = 0.0024 + Math.random() * 0.007;
      pulse.reverse = Math.random() > 0.45;
      pulse.active = forceActive || Math.random() > 0.22;
    }

    function resize() {
      const rect = node.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      node.width = Math.floor(width * dpr);
      node.height = Math.floor(height * dpr);
      canvasCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function project(
      x: number,
      y: number,
      z: number,
      breathe: number,
      ox: number,
      oy: number,
    ) {
      const cx = width / 2;
      const cy = height / 2;
      const scale = (Math.min(width, height) / 100) * breathe;
      return {
        x: cx + (x + ox - 50) * scale + z * 6,
        y: cy + (y + oy - 50) * scale + z * 3,
      };
    }

    function driftOf(index: number, t: number) {
      const item = nodes[index];
      const amp = item.rim ? 0.28 : 1.12;
      return {
        ox: Math.sin(t * 0.65 + index * 1.7) * amp,
        oy: Math.cos(t * 0.5 + index * 1.3) * amp * 0.8,
      };
    }

    function draw(time: number) {
      const burst = Math.max(0, (burstUntil - time) / 900);
      const breathe = 1 + Math.sin(time / 1500) * 0.03 + burst * 0.045;
      const t = time / 1000;
      canvasCtx.clearRect(0, 0, width, height);

      const core = project(50, 48, 0, breathe, 0, 0);
      const radius = Math.min(width, height) * (0.4 + burst * 0.08);
      const glow = canvasCtx.createRadialGradient(
        core.x,
        core.y,
        6,
        core.x,
        core.y,
        radius,
      );
      glow.addColorStop(0, `rgba(34,197,94,${0.26 + burst * 0.28})`);
      glow.addColorStop(0.4, `rgba(16,185,129,${0.08 + burst * 0.1})`);
      glow.addColorStop(1, "rgba(34,197,94,0)");
      canvasCtx.fillStyle = glow;
      canvasCtx.fillRect(0, 0, width, height);

      canvasCtx.beginPath();
      headProfile.forEach(([x, y], index) => {
        const point = project(x, y, 0, breathe, 0, 0);
        if (index === 0) canvasCtx.moveTo(point.x, point.y);
        else canvasCtx.lineTo(point.x, point.y);
      });
      canvasCtx.closePath();
      canvasCtx.fillStyle = `rgba(34,197,94,${0.07 + burst * 0.05})`;
      canvasCtx.fill();

      canvasCtx.lineCap = "round";
      for (let i = 0; i < edges.length; i += 1) {
        const edge = edges[i];
        const a = nodes[edge.a];
        const b = nodes[edge.b];
        const da = driftOf(edge.a, t);
        const db = driftOf(edge.b, t);
        const pa = project(a.x, a.y, a.z, breathe, da.ox, da.oy);
        const pb = project(b.x, b.y, b.z, breathe, db.ox, db.oy);
        const rim = a.rim && b.rim;
        const flicker = (rim ? 0.42 : 0.2) + Math.sin(t * 1.4 + i) * 0.08 + burst * 0.2;
        canvasCtx.beginPath();
        canvasCtx.moveTo(pa.x, pa.y);
        canvasCtx.lineTo(pb.x, pb.y);
        canvasCtx.strokeStyle = `rgba(74,222,128,${flicker})`;
        canvasCtx.lineWidth = (rim ? 1.35 : 0.9) + burst * 0.4;
        canvasCtx.stroke();
      }

      for (const pulse of pulses) {
        if (!pulse.active) continue;
        const edge = edges[pulse.edge];
        if (!edge) continue;
        const a = nodes[edge.a];
        const b = nodes[edge.b];
        const u = pulse.reverse ? 1 - pulse.t : pulse.t;
        const da = driftOf(edge.a, t);
        const db = driftOf(edge.b, t);
        const pa = project(a.x, a.y, a.z, breathe, da.ox, da.oy);
        const pb = project(b.x, b.y, b.z, breathe, db.ox, db.oy);
        const x = pa.x + (pb.x - pa.x) * u;
        const y = pa.y + (pb.y - pa.y) * u;
        canvasCtx.beginPath();
        canvasCtx.arc(x, y, 6 + burst * 4, 0, Math.PI * 2);
        canvasCtx.fillStyle = `rgba(34,197,94,${0.16 + burst * 0.2})`;
        canvasCtx.fill();
        canvasCtx.beginPath();
        canvasCtx.arc(x, y, 2.4 + burst * 1.2, 0, Math.PI * 2);
        canvasCtx.fillStyle = `rgba(190,242,100,${0.92})`;
        canvasCtx.fill();
      }

      for (let i = 0; i < nodes.length; i += 1) {
        const item = nodes[i];
        const d = driftOf(i, t);
        const p = project(item.x, item.y, item.z, breathe, d.ox, d.oy);
        const r = item.r * (Math.min(width, height) / 92) * (item.rim ? 1.08 : 1);
        const pulse = 0.75 + Math.sin(t * 2.1 + i) * 0.25;
        canvasCtx.beginPath();
        canvasCtx.arc(p.x, p.y, r + 2.8 + burst * 1.5, 0, Math.PI * 2);
        canvasCtx.fillStyle = `rgba(34,197,94,${0.14 + burst * 0.12})`;
        canvasCtx.fill();
        canvasCtx.beginPath();
        canvasCtx.arc(p.x, p.y, r * pulse, 0, Math.PI * 2);
        canvasCtx.fillStyle = "#4ade80";
        canvasCtx.fill();
      }
    }

    function loop(time: number) {
      if (!running) return;

      if (time >= nextBurst) {
        burstUntil = time + 900;
        nextBurst = time + 8000 + Math.random() * 4000;
        node.dispatchEvent(new CustomEvent("aicore:burst", { bubbles: true }));
        for (const pulse of pulses) {
          if (!pulse.active && Math.random() > 0.35) recycle(pulse, true);
        }
      }

      for (const pulse of pulses) {
        if (!pulse.active) continue;
        pulse.t += pulse.speed * (time < burstUntil ? 1.65 : 1);
        if (pulse.t > 1) recycle(pulse, time < burstUntil);
      }

      draw(time);
      raf = requestAnimationFrame(loop);
    }

    function onVisibility() {
      running = !document.hidden && !reducedMotion;
      if (running) raf = requestAnimationFrame(loop);
      else cancelAnimationFrame(raf);
    }

    resize();
    draw(0);

    const io = new IntersectionObserver(
      ([entry]) => {
        running =
          Boolean(entry?.isIntersecting) && !document.hidden && !reducedMotion;
        if (running) raf = requestAnimationFrame(loop);
        else cancelAnimationFrame(raf);
      },
      { threshold: 0.08 },
    );
    io.observe(node);

    const ro = new ResizeObserver(resize);
    ro.observe(node);
    document.addEventListener("visibilitychange", onVisibility);

    if (!reducedMotion) {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      data-ai-core="true"
      aria-hidden
      className="absolute inset-0 h-full w-full"
    />
  );
}
