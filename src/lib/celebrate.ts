/**
 * Konfetti-fejringen. canvas-confetti indlæses først, når den skal bruges,
 * så den ikke ligger i den indledende JavaScript-bundle.
 */

const GOLD = ["#f0d9a4", "#d8b472", "#8a6c3c"];
const WINE = ["#6d1222", "#3b0d18"];
const PAPER = ["#f5ecdd"];

export async function fireCelebration(reduceMotion: boolean): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const { default: confetti } = await import("canvas-confetti");

    if (reduceMotion) {
      // Et enkelt, roligt udbrud i stedet for flere bølger.
      confetti({
        particleCount: 70,
        spread: 70,
        startVelocity: 28,
        gravity: 1.1,
        ticks: 140,
        origin: { y: 0.6 },
        colors: [...GOLD, ...PAPER],
        disableForReducedMotion: false,
      });
      return;
    }

    confetti({
      particleCount: 120,
      spread: 82,
      startVelocity: 45,
      origin: { y: 0.62 },
      colors: [...GOLD, ...PAPER],
      scalar: 1.05,
    });

    window.setTimeout(() => {
      confetti({
        particleCount: 70,
        angle: 55,
        spread: 65,
        origin: { x: 0, y: 0.7 },
        colors: [...GOLD, ...WINE],
      });
      confetti({
        particleCount: 70,
        angle: 125,
        spread: 65,
        origin: { x: 1, y: 0.7 },
        colors: [...GOLD, ...WINE],
      });
    }, 220);

    window.setTimeout(() => {
      confetti({
        particleCount: 55,
        spread: 120,
        startVelocity: 30,
        decay: 0.92,
        gravity: 0.8,
        origin: { y: 0.45 },
        colors: [...GOLD, ...PAPER],
        shapes: ["circle"],
        scalar: 0.8,
      });
    }, 620);
  } catch {
    // Fejringen er pynt — oplevelsen fortsætter uanset hvad.
  }
}
