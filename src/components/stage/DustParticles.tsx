"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
  twinkle: number;
  /** Out-of-focus particles are larger and fainter, like bokeh. */
  bokeh: boolean;
}

const SPRITE_SIZE = 64;

function createSprite(): HTMLCanvasElement {
  const sprite = document.createElement("canvas");
  sprite.width = SPRITE_SIZE;
  sprite.height = SPRITE_SIZE;
  const ctx = sprite.getContext("2d");
  if (ctx) {
    const r = SPRITE_SIZE / 2;
    const gradient = ctx.createRadialGradient(r, r, 0, r, r, r);
    gradient.addColorStop(0, "rgba(255, 244, 214, 1)");
    gradient.addColorStop(0.18, "rgba(247, 222, 160, 0.85)");
    gradient.addColorStop(0.45, "rgba(212, 169, 79, 0.25)");
    gradient.addColorStop(1, "rgba(212, 169, 79, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
  }
  return sprite;
}

function spawn(width: number, height: number, anywhere: boolean): Particle {
  const bokeh = Math.random() < 0.12;
  return {
    x: Math.random() * width,
    y: anywhere ? Math.random() * height : height + 20,
    vx: (Math.random() - 0.5) * 6,
    vy: -(3 + Math.random() * 10),
    size: bokeh ? 10 + Math.random() * 14 : 2 + Math.random() * 4.5,
    alpha: bokeh ? 0.06 + Math.random() * 0.08 : 0.25 + Math.random() * 0.55,
    phase: Math.random() * Math.PI * 2,
    twinkle: 0.4 + Math.random() * 1.4,
    bokeh,
  };
}

/**
 * Floating golden dust drifting through the spotlight. One small canvas,
 * one shared glow sprite, and no work at all for reduced-motion users beyond
 * a single static frame.
 */
export function DustParticles({ boost = false }: { boost?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boostRef = useRef(boost);

  useEffect(() => {
    boostRef.current = boost;
  }, [boost]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sprite = createSprite();
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let intensity = 0;
    let frame = 0;
    let last = performance.now();

    const resize = () => {
      const widthChanged = window.innerWidth !== width;
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Mobile browsers resize the height when the URL bar moves; only
      // rebuild the particles when the width actually changes.
      if (widthChanged || particles.length === 0) {
        const count = Math.round(Math.min(80, Math.max(32, (width * height) / 17000)));
        particles = Array.from({ length: count }, () => spawn(width, height, true));
      }
    };

    const draw = (time: number, dt: number) => {
      ctx.clearRect(0, 0, width, height);
      const target = boostRef.current ? 1 : 0.62;
      intensity += (target - intensity) * Math.min(1, dt * 1.2);

      const centre = width / 2;
      const spread = width * 0.38;

      for (const p of particles) {
        p.x += (p.vx + Math.sin(time * 0.0004 + p.phase) * 4) * dt;
        p.y += p.vy * dt * (boostRef.current ? 1.35 : 1);

        if (p.y < -30 || p.x < -30 || p.x > width + 30) {
          Object.assign(p, spawn(width, height, false));
        }

        // Dust is brightest where the spotlight falls.
        const inLight = 0.3 + 0.7 * Math.exp(-(((p.x - centre) / spread) ** 2));
        const flicker = 0.6 + 0.4 * Math.sin(time * 0.001 * p.twinkle + p.phase);
        ctx.globalAlpha = Math.min(1, p.alpha * inLight * flicker * intensity * 1.5);
        const s = p.size * 2;
        ctx.drawImage(sprite, p.x - s / 2, p.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
    };

    const loop = (time: number) => {
      const dt = Math.min(0.05, (time - last) / 1000);
      last = time;
      draw(time, dt);
      frame = requestAnimationFrame(loop);
    };

    resize();
    if (reducedMotion) {
      intensity = 0.62;
      draw(0, 0);
    } else {
      frame = requestAnimationFrame(loop);
    }

    const onResize = () => {
      resize();
      if (reducedMotion) draw(0, 0);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="layer-dust" />;
}
