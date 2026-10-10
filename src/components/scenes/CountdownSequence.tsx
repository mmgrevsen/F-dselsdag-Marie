"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { experience } from "@/config/experience";
import { useExperience } from "@/state/experience-state";
import { useMotionPrefs } from "@/components/ui";

const { countdown } = experience;

type Phase = "lead" | "count" | "blackout" | "reveal-1" | "reveal-2" | "finale";

/**
 * Scene 5 — den cinematiske nedtælling og afsløringen.
 * Nedtælling, kort blackout, gyldent projektørlys, tæppet går fra hinanden
 * og titlen på gaven afsløres. Lyd er en bonus, aldrig en forudsætning.
 */
export function CountdownSequence() {
  const { next, play } = useExperience();
  const { reduce, transition } = useMotionPrefs();
  const [phase, setPhase] = useState<Phase>("lead");
  const [tick, setTick] = useState(countdown.from);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const timing = useMemo(
    () =>
      reduce
        ? { lead: 700, step: 360, blackout: 320, reveal: 900, finale: 1500 }
        : { lead: 1900, step: 880, blackout: 620, reveal: 1500, finale: 2600 },
    [reduce],
  );

  useEffect(() => {
    const at = (delay: number, action: () => void) => {
      timers.current.push(setTimeout(action, delay));
    };

    let clock = timing.lead;
    at(clock, () => {
      setPhase("count");
      play("tick");
    });

    for (let step = 1; step < countdown.from; step += 1) {
      clock += timing.step;
      at(clock, () => {
        setTick(countdown.from - step);
        play("tick");
      });
    }

    clock += timing.step;
    at(clock, () => setPhase("blackout"));

    clock += timing.blackout;
    at(clock, () => {
      setPhase("reveal-1");
      play("whoosh");
    });

    clock += timing.reveal;
    at(clock, () => setPhase("reveal-2"));

    clock += timing.reveal;
    at(clock, () => {
      setPhase("finale");
      play("impact");
      play("reveal");
    });

    clock += timing.finale;
    at(clock, () => next());

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [timing, play, next]);

  const curtainsOpen = phase === "finale";

  return (
    <section className="scene-shell overflow-hidden" aria-label="Nedtælling">
      {/* Tæppet, der går fra hinanden i finalen */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {(["left", "right"] as const).map((side) => (
          <motion.div
            key={side}
            className="curtain-panel absolute top-0 h-full w-[52%]"
            style={side === "left" ? { left: 0 } : { right: 0 }}
            initial={{ x: 0, opacity: 0 }}
            animate={{
              x: curtainsOpen ? (side === "left" ? "-102%" : "102%") : 0,
              opacity: phase === "lead" || phase === "count" ? 0 : 1,
            }}
            transition={{
              x: { duration: reduce ? 0.3 : 1.9, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: reduce ? 0.2 : 0.8 },
            }}
          />
        ))}
      </div>

      {/* Blackout + gyldent spotlys */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-black"
        animate={{ opacity: phase === "blackout" ? 1 : 0 }}
        transition={{ duration: reduce ? 0.15 : 0.45 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: curtainsOpen ? 1 : 0 }}
        transition={{ duration: reduce ? 0.2 : 1.4 }}
        style={{
          background:
            "radial-gradient(55% 45% at 50% 45%, rgba(240,217,164,0.3), transparent 72%)",
        }}
      />

      <div className="relative z-10 flex min-h-[18rem] w-full max-w-2xl flex-col items-center justify-center gap-6">
        <AnimatePresence mode="wait">
          {phase === "lead" ? (
            <motion.p
              key="lead"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition(1.1)}
              className="display-title max-w-[26ch] text-balance text-lg text-ivory sm:text-xl md:text-2xl"
            >
              {countdown.lead}
            </motion.p>
          ) : null}

          {phase === "count" ? (
            <motion.div
              key={`tick-${tick}`}
              initial={{ opacity: 0, scale: reduce ? 1 : 2.1, filter: reduce ? "none" : "blur(16px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: reduce ? 1 : 0.7 }}
              transition={{ duration: reduce ? 0.18 : 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
              aria-live="polite"
            >
              <span className="display-title text-[clamp(5rem,32vw,16rem)] leading-none text-gold-bright drop-shadow-[0_0_60px_rgba(216,180,114,0.45)]">
                {tick}
              </span>
            </motion.div>
          ) : null}

          {phase === "reveal-1" || phase === "reveal-2" ? (
            <motion.p
              key={phase}
              initial={{ opacity: 0, y: reduce ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={transition(0.9)}
              className="display-title max-w-[24ch] text-balance text-xl text-ivory sm:text-2xl md:text-3xl"
            >
              {phase === "reveal-1" ? countdown.reveal[0] : countdown.reveal[1]}
            </motion.p>
          ) : null}

          {phase === "finale" ? (
            <motion.div
              key="finale"
              className="flex flex-col items-center gap-5"
              initial={{ opacity: 0, scale: reduce ? 1 : 1.4, filter: reduce ? "none" : "blur(18px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={transition(1.2)}
            >
              <h2 className="display-title title-sheen text-[clamp(2.2rem,12vw,6rem)]">
                {countdown.finale}
              </h2>
              <div className="gold-rule max-w-[16rem]" />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Nedtællingen må aldrig spærre vejen */}
      <button
        type="button"
        onClick={next}
        className="absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 z-20 -translate-x-1/2 rounded-full px-5 py-3 font-sans text-[0.6rem] tracking-[0.3em] text-ivory-dim/55 uppercase transition-colors hover:text-gold-bright"
      >
        Spring til gaven
      </button>
    </section>
  );
}
