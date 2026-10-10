"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Kører et antal "beats" igennem med faste intervaller og rydder altid
 * sine timere op. Brugeren kan springe direkte til slutningen.
 *
 * Scenerne monteres først, når de er aktive, så sekvensen starter forfra
 * af sig selv — også når hele oplevelsen genstartes.
 */
export function useSequence(
  steps: number,
  intervalMs: number,
  options: { startDelayMs?: number } = {},
) {
  const { startDelayMs = 0 } = options;
  const [step, setStep] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => {
    if (steps <= 0) return;
    for (let index = 1; index <= steps; index += 1) {
      timers.current.push(
        setTimeout(() => setStep(index), startDelayMs + index * intervalMs),
      );
    }
    return clear;
  }, [steps, intervalMs, startDelayMs, clear]);

  const finish = useCallback(() => {
    clear();
    setStep(steps);
  }, [clear, steps]);

  return { step, done: step >= steps, finish };
}
