"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { birthdayConfig } from "@/config/birthday";
import { useSound } from "@/components/providers/SoundProvider";
import { RevealText } from "@/components/ui/RevealText";
import { EASE_CINEMATIC } from "@/lib/motion";

const { countdown } = birthdayConfig;

const NUMBERS = [5, 4, 3, 2, 1] as const;
const STEP = 900;

/** The timeline of the scene, in ms after it starts. */
const TIMELINE = {
  line1: 400,
  line2: 2000,
  dial: 4100,
  firstNumber: 4550,
  blackout: 4550 + NUMBERS.length * STEP,
  flash: 4550 + NUMBERS.length * STEP + 450,
  done: 4550 + NUMBERS.length * STEP + 450 + 2300,
};

type Phase = "lines" | "count" | "blackout" | "reveal";

interface CountdownRevealProps {
  /** Called at the golden flash – the stage opens the curtains here. */
  onReveal: () => void;
  onComplete: () => void;
}

export function CountdownReveal({ onReveal, onComplete }: CountdownRevealProps) {
  const { play } = useSound();
  const [phase, setPhase] = useState<Phase>("lines");
  const [lineBeat, setLineBeat] = useState(0);
  const [number, setNumber] = useState<number | null>(null);

  const showNumber = useEffectEvent((value: number) => {
    setNumber(value);
    play("tick");
  });

  const reveal = useEffectEvent(() => {
    setPhase("reveal");
    play("reveal");
    onReveal();
  });

  const finish = useEffectEvent(() => onComplete());

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setLineBeat(1), TIMELINE.line1),
      window.setTimeout(() => setLineBeat(2), TIMELINE.line2),
      window.setTimeout(() => setPhase("count"), TIMELINE.dial),
      ...NUMBERS.map((value, i) =>
        window.setTimeout(() => showNumber(value), TIMELINE.firstNumber + i * STEP),
      ),
      window.setTimeout(() => {
        setNumber(null);
        setPhase("blackout");
      }, TIMELINE.blackout),
      window.setTimeout(() => reveal(), TIMELINE.flash),
      window.setTimeout(() => finish(), TIMELINE.done),
    ];
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, []);

  return (
    <motion.section
      aria-label="Nedtælling"
      className="scene overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
    >
      <div className="scene-inner items-center justify-center text-center">
        <AnimatePresence mode="wait">
          {phase === "lines" && (
            <motion.div
              key="lines"
              className="flex max-w-2xl flex-col items-center"
              exit={{ opacity: 0, y: -24, transition: { duration: 0.45, ease: "easeIn" } }}
            >
              <RevealText
                as="h2"
                text={countdown.lines[0]}
                show={lineBeat >= 1}
                className="font-serif text-[clamp(1.7rem,7vw,2.9rem)] font-medium italic leading-tight text-cream text-balance text-shadow-stage"
              />
              <RevealText
                as="p"
                text={countdown.lines[1]}
                show={lineBeat >= 2}
                stagger={0.06}
                className="mt-6 font-display text-[clamp(1.25rem,5.4vw,2.2rem)] font-semibold leading-snug tracking-[0.03em] text-gold-light text-balance text-shadow-stage"
              />
            </motion.div>
          )}

          {phase === "count" && (
            <motion.div
              key="dial"
              className="countdown-dial"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE_CINEMATIC } }}
              exit={{ opacity: 0, scale: 1.08, transition: { duration: 0.3 } }}
            >
              <FilmLeader number={number} />
            </motion.div>
          )}
        </AnimatePresence>

        <p className="sr-only" aria-live="polite">
          {number ?? ""}
        </p>
      </div>

      {/* Brief blackout, then a soft golden flash as the curtains part. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "blackout" ? 0.94 : 0 }}
        transition={{ duration: phase === "blackout" ? 0.35 : 1.6, ease: "easeOut" }}
      />
      {phase === "reveal" && (
        <motion.div
          aria-hidden="true"
          className="golden-flash pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.95, 0] }}
          transition={{ duration: 1.7, times: [0, 0.14, 1], ease: "easeOut" }}
        />
      )}
    </motion.section>
  );
}

/** A film-leader countdown dial: rings, crosshair and a sweeping hand. */
function FilmLeader({ number }: { number: number | null }) {
  return (
    <div className="relative grid size-[min(76vw,23rem)] place-items-center" aria-hidden="true">
      <svg viewBox="0 0 200 200" className="absolute inset-0 size-full text-gold" fill="none">
        <circle cx="100" cy="100" r="96" stroke="currentColor" strokeOpacity="0.45" strokeWidth="0.8" />
        <circle cx="100" cy="100" r="78" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.6" />
        <path d="M100 0 V200 M0 100 H200" stroke="currentColor" strokeOpacity="0.16" strokeWidth="0.6" />
      </svg>

      {number !== null && (
        <svg key={number} viewBox="0 0 200 200" className="absolute inset-0 size-full -rotate-90">
          <motion.circle
            cx="100"
            cy="100"
            r="48"
            fill="none"
            stroke="rgba(242, 210, 139, 0.09)"
            strokeWidth="96"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: STEP / 1000, ease: "linear" }}
          />
        </svg>
      )}

      <AnimatePresence>
        {number !== null && (
          <motion.span
            key={number}
            className="countdown-number [grid-area:1/1]"
            initial={{ opacity: 0, scale: 1.55 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.4, ease: EASE_CINEMATIC } }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3, ease: "easeIn" } }}
          >
            {number}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
