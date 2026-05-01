'use client';
import { useEffect, useRef } from 'react';

// Draws animated floating particles on a canvas overlay
export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const COLORS = ['#f9a8d4', '#f472b6', '#e879f9', '#a78bfa', '#60a5fa', '#fff'];
    const EMOJIS = ['🎵', '🎶', '✨', '💗', '🌟', '💫', '🎤'];

    type Particle = {
      x: number; y: number; r: number;
      dx: number; dy: number;
      color: string; alpha: number;
      emoji?: string; isEmoji: boolean;
      life: number; maxLife: number;
    };

    const particles: Particle[] = [];

    const spawn = (): Particle => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 20,
      r: Math.random() * 4 + 1,
      dx: (Math.random() - 0.5) * 0.8,
      dy: -(Math.random() * 1.2 + 0.4),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.6 + 0.2,
      isEmoji: Math.random() < 0.08,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      life: 0,
      maxLife: Math.random() * 300 + 200,
    });

    for (let i = 0; i < 60; i++) {
      const p = spawn();
      p.y = Math.random() * canvas.height;
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.3) particles.push(spawn());
      if (particles.length > 120) particles.splice(0, 1);

      for (const p of particles) {
        p.x += p.dx;
        p.y += p.dy;
        p.life++;
        const fade = p.life < 30 ? p.life / 30 : p.life > p.maxLife - 30 ? (p.maxLife - p.life) / 30 : 1;

        if (p.isEmoji) {
          ctx.globalAlpha = p.alpha * fade * 0.7;
          ctx.font = `${p.r * 5}px serif`;
          ctx.fillText(p.emoji!, p.x, p.y);
        } else {
          ctx.globalAlpha = p.alpha * fade;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        }

        if (p.life >= p.maxLife || p.y < -30) {
          Object.assign(p, spawn());
        }
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.55 }}
    />
  );
}
