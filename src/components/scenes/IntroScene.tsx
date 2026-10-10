"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { birthdayConfig } from "@/config/birthday";
import { useSound } from "@/components/providers/SoundProvider";
import { CinematicButton } from "@/components/ui/CinematicButton";
import { RevealText } from "@/components/ui/RevealText";
import { EASE_CINEMATIC, fadeUp } from "@/lib/motion";

const { intro, recipientName } = birthdayConfig;

/** When each beat of the intro appears (ms after the scene starts). */
const BEATS = [900, 3000, 4800, 6400];
const FINAL_BEAT = BEATS.length;

const introVariants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 1.2 } },
  // Flying into the screen, as if entering the adventure.
  exit: { opacity: 0, scale: 1.12, transition: { duration: 0.75, ease: [0.55, 0, 0.75, 0.2] as const } },
};

interface IntroSceneProps {
  onStart: () => void;
}

export function IntroScene({ onStart }: IntroSceneProps) {
  const { enabled: soundEnabled, play } = useSound();
  const [beat, setBeat] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const timers = BEATS.map((ms, index) =>
      window.setTimeout(() => setBeat((current) => Math.max(current, index + 1)), ms),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, []);

  /** Tapping the dark stage reveals everything at once – no waiting required. */
  const revealAll = () => setBeat(FINAL_BEAT);

  const start = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    play("start");
    onStart();
  };

  return (
    <motion.section
      aria-labelledby="intro-heading"
      className="scene"
      variants={introVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      onPointerDown={beat < FINAL_BEAT ? revealAll : undefined}
    >
      <div className="scene-inner justify-center text-center">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
          <motion.p
            className="eyebrow mb-7 flex items-center gap-3 text-gold/80 sm:mb-9"
            initial="hidden"
            animate={beat >= 1 ? "visible" : "hidden"}
            variants={fadeUp}
          >
            <span aria-hidden="true" className="h-px w-8 bg-gradient-to-r from-transparent to-gold/70" />
            {intro.eyebrow}
            <span aria-hidden="true" className="h-px w-8 bg-gradient-to-l from-transparent to-gold/70" />
          </motion.p>

          <RevealText
            as="h1"
            id="intro-heading"
            text={intro.lines[0]}
            show={beat >= 1}
            delay={0.25}
            className="font-serif text-[clamp(1.75rem,7vw,3.1rem)] font-medium italic leading-[1.15] text-cream text-balance"
          />

          <RevealText
            as="p"
            text={intro.lines[1]}
            show={beat >= 2}
            stagger={0.09}
            highlight={recipientName}
            className="mt-6 font-display text-[clamp(1.6rem,7.4vw,3.4rem)] font-semibold leading-tight tracking-[0.04em] text-cream text-balance sm:mt-8"
          />

          <RevealText
            as="p"
            text={intro.lines[2]}
            show={beat >= 3}
            stagger={0.03}
            className="mt-7 max-w-[30rem] text-[clamp(1rem,4.2vw,1.2rem)] leading-relaxed text-cream/75 text-balance sm:mt-9"
          />

          <motion.div
            className="mt-10 flex flex-col items-center gap-5 sm:mt-12"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={beat >= FINAL_BEAT ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.94 }}
            transition={{ duration: 0.9, ease: EASE_CINEMATIC }}
          >
            <CinematicButton
              onClick={start}
              disabled={beat < FINAL_BEAT}
              className="min-w-[17rem]"
            >
              {intro.startButton}
            </CinematicButton>

            {!soundEnabled && (
              <p className="flex items-center gap-2 text-xs tracking-wide text-cream/45">
                <Volume2 aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
                {intro.soundHint}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
