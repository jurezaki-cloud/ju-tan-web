"use client";

import { useEffect, useRef } from "react";

export default function AINetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });
    if (!ctx) return;
    const canvasCtx: CanvasRenderingContext2D = ctx;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    let width = 1;
    let height = 1;
    let raf = 0;
    let last = 0;
    let running = !document.hidden && !reducedMotion;
    const frameMs = 16;
    const count = isMobile ? 8 : 16;
    const linkDist = isMobile ? 88 : 140;

    const particles = Array.from({ length: count }, () => ({
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * (isMobile ? 0.25 : 0.4),
      vy: (Math.random() - 0.5) * (isMobile ? 0.25 : 0.4),
    }));

    const node = canvas;

    function resize() {
      const rect = node.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      node.width = width;
      node.height = height;

      for (const p of particles) {
        if (!p.x && !p.y) {
          p.x = Math.random() * width;
          p.y = Math.random() * height;
        } else {
          p.x = Math.min(width, Math.max(0, p.x));
          p.y = Math.min(height, Math.max(0, p.y));
        }
      }
    }

    function draw() {
      canvasCtx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        canvasCtx.beginPath();
        canvasCtx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        canvasCtx.fillStyle = "#22c55e";
        canvasCtx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < linkDist) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(particles[i].x, particles[i].y);
            canvasCtx.lineTo(particles[j].x, particles[j].y);
            canvasCtx.strokeStyle = `rgba(34,197,94,${1 - dist / linkDist})`;
            canvasCtx.lineWidth = 0.5;
            canvasCtx.stroke();
          }
        }
      }
    }

    function loop(time: number) {
      if (!running) return;
      if (time - last >= frameMs) {
        last = time;
        draw();
      }
      raf = requestAnimationFrame(loop);
    }

    function onVisibility() {
      running = !document.hidden && !reducedMotion;
      if (running) {
        raf = requestAnimationFrame(loop);
      } else {
        cancelAnimationFrame(raf);
      }
    }

    resize();
    draw();

    const observer = new IntersectionObserver(
      ([entry]) => {
        running =
          Boolean(entry?.isIntersecting) && !document.hidden && !reducedMotion;
        if (running) {
          raf = requestAnimationFrame(loop);
        } else {
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(node);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(node);

    document.addEventListener("visibilitychange", onVisibility);

    let idleHandle = 0;
    const startLoop = () => {
      if (reducedMotion || !running) return;
      raf = requestAnimationFrame(loop);
    };

    if (reducedMotion) {
      draw();
    } else if (typeof requestIdleCallback === "function") {
      idleHandle = requestIdleCallback(startLoop, { timeout: 1200 });
    } else {
      idleHandle = window.setTimeout(startLoop, 400);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      if (typeof cancelIdleCallback === "function") {
        cancelIdleCallback(idleHandle);
      }
      window.clearTimeout(idleHandle);
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-40"
    />
  );
}
