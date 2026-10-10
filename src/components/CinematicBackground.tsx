"use client";

import { useMemo } from "react";
import type { Scene } from "@/state/experience-state";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

/** Hvor intens atmosfæren er i hver scene. */
const INTENSITY: Record<Scene, { spotlight: number; haze: number; dust: number }> =
  {
    intro: { spotlight: 0.55, haze: 0.5, dust: 18 },
    credits: { spotlight: 0.8, haze: 0.85, dust: 22 },
    quiz: { spotlight: 0.5, haze: 0.6, dust: 14 },
    letter: { spotlight: 0.22, haze: 0.28, dust: 8 },
    countdown: { spotlight: 0.3, haze: 0.2, dust: 10 },
    ticket: { spotlight: 0.95, haze: 0.7, dust: 26 },
    celebration: { spotlight: 0.85, haze: 0.8, dust: 30 },
  };

interface Mote {
  left: number;
  delay: number;
  duration: number;
  size: number;
  drift: number;
  opacity: number;
}

function buildMotes(count: number): Mote[] {
  // Deterministisk mønster, så serveren og klienten er enige,
  // og så der ikke genberegnes ved hver render.
  return Array.from({ length: count }, (_, index) => {
    const seed = (index * 9301 + 49297) % 233280;
    const random = seed / 233280;
    const random2 = ((index * 4517 + 7919) % 10000) / 10000;
    return {
      left: (random * 100 + (index % 7) * 3.1) % 100,
      delay: random2 * 16,
      duration: 16 + random * 18,
      size: 1.5 + random2 * 2.5,
      drift: -60 + random * 120,
      opacity: 0.25 + random2 * 0.5,
    };
  });
}

/**
 * Baggrundsatmosfæren: projektørlys, røg, flydende støv, vignet og filmkorn.
 * Alt er CSS-drevet, så der ikke sker React-renders pr. frame.
 */
export function CinematicBackground({ scene }: { scene: Scene }) {
  const reduceMotion = usePrefersReducedMotion();
  const intensity = INTENSITY[scene];
  const motes = useMemo(
    () => buildMotes(reduceMotion ? 0 : intensity.dust),
    [intensity.dust, reduceMotion],
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-ink" />
      <div
        className="haze transition-opacity duration-[1600ms]"
        style={{ opacity: intensity.haze }}
      />
      <div
        className="spotlight transition-opacity duration-[1600ms]"
        style={{ opacity: intensity.spotlight }}
      />
      <div className="dust">
        {motes.map((mote, index) => (
          <span
            key={index}
            style={{
              left: `${mote.left}%`,
              width: mote.size,
              height: mote.size,
              opacity: mote.opacity,
              animationDelay: `${mote.delay}s`,
              animationDuration: `${mote.duration}s`,
              ["--dx" as string]: `${mote.drift}px`,
            }}
          />
        ))}
      </div>
      <div className="vignette" />
      <div className="grain" />
    </div>
  );
}
