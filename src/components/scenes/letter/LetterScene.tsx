"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { birthdayConfig } from "@/config/birthday";
import { useSound } from "@/components/providers/SoundProvider";
import { EASE_CINEMATIC, EASE_IN_OUT } from "@/lib/motion";
import { BirthdayLetter } from "./BirthdayLetter";
import { EnvelopeAnimation } from "./EnvelopeAnimation";

const { letter } = birthdayConfig;

type LetterStage = "envelope" | "opening" | "reading";

/** Time from tapping the envelope until the letter takes over the screen. */
const OPENING_DURATION = 2000;

interface LetterSceneProps {
  /** The envelope was opened – the stage dims the cinema screen. */
  onEnvelopeOpened: () => void;
  onComplete: () => void;
}

export function LetterScene({ onEnvelopeOpened, onComplete }: LetterSceneProps) {
  const { play } = useSound();
  const [stage, setStage] = useState<LetterStage>("envelope");
  const sceneRef = useRef<HTMLElement>(null);
  const timerRef = useRef<number | undefined>(undefined);
  const continuedRef = useRef(false);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const openEnvelope = () => {
    if (stage !== "envelope") return;
    setStage("opening");
    play("envelope");
    onEnvelopeOpened();
    timerRef.current = window.setTimeout(() => {
      setStage("reading");
      sceneRef.current?.scrollTo({ top: 0 });
    }, OPENING_DURATION);
  };

  const showSurprise = () => {
    if (continuedRef.current) return;
    continuedRef.current = true;
    play("whoosh");
    onComplete();
  };

  return (
    <motion.section
      ref={sceneRef}
      aria-labelledby={stage === "reading" ? "letter-greeting" : "letter-intro"}
      className="scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      // The letter sinks back into the dark before the final reveal.
      exit={{ opacity: 0, scale: 0.92, y: 30, transition: { duration: 0.85, ease: EASE_IN_OUT } }}
    >
      <AnimatePresence mode="wait">
        {stage !== "reading" ? (
          <motion.div
            key="envelope"
            className="scene-inner letter-stage"
            exit={{ opacity: 0, y: 40, transition: { duration: 0.5, ease: "easeIn" } }}
          >
            {/* The visible line is projected on the cinema screen; this copy is for screen readers. */}
            <h2 id="letter-intro" className="sr-only">
              {letter.intro}
            </h2>

            <motion.div
              initial={{ opacity: 0, y: 70, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 2.1, duration: 1.2, ease: EASE_CINEMATIC }}
            >
              <EnvelopeAnimation opened={stage === "opening"} onOpen={openEnvelope} />
            </motion.div>

            <motion.p
              className="mt-8 text-center text-sm tracking-wide text-cream/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: stage === "envelope" ? 1 : 0 }}
              transition={{ delay: stage === "envelope" ? 3.1 : 0, duration: 0.8 }}
            >
              {letter.envelopeHint}
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            className="scene-inner items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <BirthdayLetter onContinue={showSurprise} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
