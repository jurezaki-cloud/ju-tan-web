"use client";

import { useEffect, useRef } from "react";

export default function AINetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const canvasCtx: CanvasRenderingContext2D = ctx;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let raf = 0;
    let running = !document.hidden && !reducedMotion;

    canvas.width = width;
    canvas.height = height;

    const count = width < 768 ? 10 : 18;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));

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
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(particles[i].x, particles[i].y);
            canvasCtx.lineTo(particles[j].x, particles[j].y);
            canvasCtx.strokeStyle = `rgba(34,197,94,${1 - dist / 130})`;
            canvasCtx.lineWidth = 0.5;
            canvasCtx.stroke();
          }
        }
      }
    }

    function loop() {
      if (!running) return;
      draw();
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        running = Boolean(entry?.isIntersecting) && !document.hidden && !reducedMotion;
        if (running) {
          raf = requestAnimationFrame(loop);
        } else {
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(canvas);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", resize, { passive: true });

    if (reducedMotion) {
      draw();
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 -z-10 h-full w-full opacity-40"
    />
  );
}
