"use client";

import { useEffect, useRef } from "react";
import { neuralGraphDesktop, neuralGraphMobile } from "@/lib/hero-neural";

type Pulse = {
  edge: number;
  t: number;
  speed: number;
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

    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });
    if (!ctx) return;

    const node = canvas;
    const canvasCtx: CanvasRenderingContext2D = ctx;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.6);
    let width = 1;
    let height = 1;
    let raf = 0;
    let running = !document.hidden && !reducedMotion;
    const pulses: Pulse[] = Array.from({ length: isMobile ? 5 : 9 }, (_, i) => ({
      edge: i % Math.max(edges.length, 1),
      t: (i * 0.17) % 1,
      speed: 0.004 + (i % 4) * 0.0012,
    }));

    function resize() {
      const rect = node.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      node.width = Math.floor(width * dpr);
      node.height = Math.floor(height * dpr);
      canvasCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function project(x: number, y: number, z: number, breathe: number) {
      const cx = width / 2;
      const cy = height / 2;
      const scale = (Math.min(width, height) / 100) * breathe;
      return {
        x: cx + (x - 50) * scale + z * 6,
        y: cy + (y - 50) * scale + z * 3,
      };
    }

    function draw(time: number) {
      const breathe = reducedMotion ? 1 : 1 + Math.sin(time / 1400) * 0.028;
      canvasCtx.clearRect(0, 0, width, height);

      const core = project(50, 48, 0, breathe);
      const glow = canvasCtx.createRadialGradient(
        core.x,
        core.y,
        8,
        core.x,
        core.y,
        Math.min(width, height) * 0.42,
      );
      glow.addColorStop(0, "rgba(34,197,94,0.28)");
      glow.addColorStop(0.45, "rgba(16,185,129,0.08)");
      glow.addColorStop(1, "rgba(34,197,94,0)");
      canvasCtx.fillStyle = glow;
      canvasCtx.fillRect(0, 0, width, height);

      canvasCtx.lineCap = "round";
      for (const edge of edges) {
        const a = nodes[edge.a];
        const b = nodes[edge.b];
        const pa = project(a.x, a.y, a.z, breathe);
        const pb = project(b.x, b.y, b.z, breathe);
        canvasCtx.beginPath();
        canvasCtx.moveTo(pa.x, pa.y);
        canvasCtx.lineTo(pb.x, pb.y);
        canvasCtx.strokeStyle = "rgba(74,222,128,0.32)";
        canvasCtx.lineWidth = 1;
        canvasCtx.stroke();
      }

      if (!reducedMotion) {
        for (const pulse of pulses) {
          const edge = edges[pulse.edge];
          if (!edge) continue;
          const a = nodes[edge.a];
          const b = nodes[edge.b];
          const pa = project(a.x, a.y, a.z, breathe);
          const pb = project(b.x, b.y, b.z, breathe);
          const x = pa.x + (pb.x - pa.x) * pulse.t;
          const y = pa.y + (pb.y - pa.y) * pulse.t;
          const g = canvasCtx.createRadialGradient(x, y, 0, x, y, 9);
          g.addColorStop(0, "rgba(190,242,100,0.95)");
          g.addColorStop(1, "rgba(34,197,94,0)");
          canvasCtx.fillStyle = g;
          canvasCtx.beginPath();
          canvasCtx.arc(x, y, 9, 0, Math.PI * 2);
          canvasCtx.fill();
        }
      }

      for (const node of nodes) {
        const p = project(node.x, node.y, node.z, breathe);
        const radius = node.r * (Math.min(width, height) / 92);
        canvasCtx.beginPath();
        canvasCtx.arc(p.x, p.y, radius + 3.2, 0, Math.PI * 2);
        canvasCtx.fillStyle = "rgba(34,197,94,0.18)";
        canvasCtx.fill();
        canvasCtx.beginPath();
        canvasCtx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        canvasCtx.fillStyle = "#4ade80";
        canvasCtx.fill();
      }
    }

    function loop(time: number) {
      if (!running) return;
      for (const pulse of pulses) {
        pulse.t += pulse.speed;
        if (pulse.t > 1) {
          pulse.t = 0;
          pulse.edge = (pulse.edge + 3) % Math.max(edges.length, 1);
        }
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
