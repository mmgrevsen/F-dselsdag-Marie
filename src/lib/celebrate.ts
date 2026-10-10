import confetti from "canvas-confetti";

const GOLD = ["#f7e2a6", "#f2d28b", "#d4a94f", "#b8862f"];
const FESTIVE = ["#f7e2a6", "#d4a94f", "#fbf5e9", "#c4283f", "#7a0f22"];

const base: confetti.Options = {
  disableForReducedMotion: true,
  zIndex: 60,
};

function originOf(element: Element | null): confetti.Origin {
  if (!element || typeof window === "undefined") return { x: 0.5, y: 0.6 };
  const rect = element.getBoundingClientRect();
  return {
    x: (rect.left + rect.width / 2) / window.innerWidth,
    y: (rect.top + rect.height / 2) / window.innerHeight,
  };
}

/** A small golden sparkle bursting out of an element – used for correct answers. */
export function sparkleFrom(element: Element | null) {
  confetti({
    ...base,
    particleCount: 28,
    spread: 75,
    startVelocity: 20,
    gravity: 0.8,
    scalar: 0.75,
    ticks: 110,
    shapes: ["star", "circle"],
    colors: GOLD,
    origin: originOf(element),
  });
}

export function missionCompleteBurst() {
  const sides = { ...base, particleCount: 60, spread: 60, startVelocity: 52, colors: FESTIVE, scalar: 0.9 };
  confetti({ ...sides, angle: 60, origin: { x: 0, y: 0.85 } });
  confetti({ ...sides, angle: 120, origin: { x: 1, y: 0.85 } });
  confetti({
    ...base,
    particleCount: 36,
    spread: 360,
    startVelocity: 16,
    gravity: 0.45,
    ticks: 170,
    shapes: ["star"],
    colors: GOLD,
    scalar: 1.1,
    origin: { x: 0.5, y: 0.45 },
  });
}

/** The burst that greets the ticket when it lands. */
export function ticketBurst() {
  confetti({
    ...base,
    particleCount: 110,
    spread: 100,
    startVelocity: 40,
    ticks: 220,
    colors: FESTIVE,
    scalar: 0.9,
    origin: { x: 0.5, y: 0.5 },
  });
  confetti({
    ...base,
    particleCount: 40,
    spread: 360,
    startVelocity: 18,
    gravity: 0.35,
    ticks: 220,
    shapes: ["star"],
    colors: GOLD,
    origin: { x: 0.5, y: 0.42 },
  });
}

/**
 * The big celebration when the invitation is accepted: side cannons, a central
 * burst and a sweep of golden dust across the screen. Returns a stop function.
 */
export function acceptCelebration(): () => void {
  let stopped = false;
  let frame = 0;
  let tick = 0;
  const end = performance.now() + 1700;
  const timers: number[] = [];

  confetti({
    ...base,
    particleCount: 140,
    spread: 110,
    startVelocity: 48,
    ticks: 260,
    colors: FESTIVE,
    origin: { x: 0.5, y: 0.55 },
  });

  const cannons = () => {
    if (stopped) return;
    if (tick++ % 2 === 0) {
      const side = { ...base, particleCount: 4, spread: 55, startVelocity: 62, colors: FESTIVE, ticks: 240 };
      confetti({ ...side, angle: 60, origin: { x: 0, y: 0.78 } });
      confetti({ ...side, angle: 120, origin: { x: 1, y: 0.78 } });
    }
    if (performance.now() < end) frame = requestAnimationFrame(cannons);
  };
  cannons();

  // Golden dust drifting across the whole screen.
  [0.15, 0.35, 0.55, 0.75].forEach((y, i) => {
    timers.push(
      window.setTimeout(() => {
        if (stopped) return;
        const dust = {
          ...base,
          particleCount: 26,
          spread: 30,
          startVelocity: 38,
          gravity: 0.18,
          decay: 0.95,
          ticks: 380,
          shapes: ["circle"] as confetti.Shape[],
          scalar: 0.55,
          colors: GOLD,
        };
        confetti({ ...dust, angle: 8, drift: 1.2, origin: { x: -0.05, y } });
        confetti({ ...dust, angle: 172, drift: -1.2, origin: { x: 1.05, y: y + 0.1 } });
      }, 350 + i * 220),
    );
  });

  return () => {
    stopped = true;
    cancelAnimationFrame(frame);
    timers.forEach((id) => window.clearTimeout(id));
  };
}

export function resetConfetti() {
  confetti.reset();
}
