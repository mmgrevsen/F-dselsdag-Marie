"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play } from "lucide-react";
import { experience } from "@/config/experience";
import { useExperience } from "@/state/experience-state";
import { CINEMA_EASE, CinemaButton, Eyebrow, useMotionPrefs } from "@/components/ui";
import { useSequence } from "@/lib/useSequence";

const { opening } = experience;

/**
 * Scene 1 — den cinematiske åbning.
 * Projektørlys, drivende partikler og titelsekvensen, der bygger op
 * til "AFSPIL TRAILEREN".
 */
export function CinematicIntro() {
  const { next, play, startProjector, stopProjector, soundEnabled } =
    useExperience();
  const { reduce, transition, shift } = useMotionPrefs();

  // Beats: 0 mørke · 1 præsentation · 2-4 replikker · 5 titel · 6 tagline+knap
  const { step, finish, done } = useSequence(6, reduce ? 420 : 1150, {
    startDelayMs: reduce ? 120 : 650,
  });

  useEffect(() => {
    if (!soundEnabled) return;
    startProjector();
    return stopProjector;
  }, [soundEnabled, startProjector, stopProjector]);

  useEffect(() => {
    if (step === 5) play("impact");
  }, [step, play]);

  const show = (beat: number) => step >= beat;

  return (
    <section className="scene-shell" aria-label="Åbningsscene">
      {/* Projektørstrålen, der langsomt tændes */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[70svh] w-full max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: show(1) ? 1 : 0 }}
        transition={transition(2.2)}
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(240,217,164,0.20), transparent 70%)",
        }}
      />

      <div className="relative flex w-full max-w-3xl flex-col items-center gap-7">
        <AnimatePresence>
          {show(1) ? (
            <motion.div
              key="presentation"
              initial={{ opacity: 0, y: shift(10) }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={transition(1.4)}
            >
              <Eyebrow>{opening.presentation}</Eyebrow>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Tre korte replikker, der lægger sig oven på hinanden */}
        <div className="flex min-h-28 flex-col items-center justify-center gap-2 sm:min-h-32">
          {opening.lines.map((line, index) => (
            <AnimatePresence key={line}>
              {show(index + 2) ? (
                <motion.p
                  initial={{ opacity: 0, y: shift(16), letterSpacing: reduce ? "0.2em" : "0.6em" }}
                  animate={{ opacity: 1, y: 0, letterSpacing: "0.2em" }}
                  transition={transition(1.1)}
                  className="display-title text-xl text-ivory/90 sm:text-2xl md:text-3xl"
                >
                  {line}
                </motion.p>
              ) : null}
            </AnimatePresence>
          ))}
        </div>

        <AnimatePresence>
          {show(5) ? (
            <motion.div
              key="title"
              className="flex flex-col items-center gap-3"
              initial={{ opacity: 0, scale: reduce ? 1 : 1.25, filter: reduce ? "none" : "blur(14px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={transition(1.3)}
            >
              <h1 className="display-title title-sheen text-[clamp(3.2rem,19vw,10rem)] drop-shadow-[0_8px_40px_rgba(109,18,34,0.6)]">
                {opening.title}
              </h1>
              <div className="gold-rule max-w-[18rem]" />
              <p className="font-sans text-[0.68rem] font-medium tracking-[0.46em] text-ivory-dim uppercase sm:text-sm sm:tracking-[0.58em]">
                {opening.subtitle}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {show(6) ? (
            <motion.div
              key="cta"
              className="mt-2 flex flex-col items-center gap-7"
              initial={{ opacity: 0, y: shift(18) }}
              animate={{ opacity: 1, y: 0 }}
              transition={transition(1)}
            >
              <p className="font-letter text-base text-ivory-dim/85 italic sm:text-lg">
                {opening.tagline}
              </p>
              <CinemaButton
                onClick={() => {
                  play("whoosh");
                  next();
                }}
              >
                <Play className="size-4" aria-hidden />
                {opening.cta}
              </CinemaButton>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Lad brugeren springe ventetiden over */}
      <AnimatePresence>
        {!done ? (
          <motion.button
            type="button"
            onClick={finish}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: CINEMA_EASE }}
            className="absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 rounded-full px-5 py-3 font-sans text-[0.6rem] tracking-[0.3em] text-ivory-dim/50 uppercase transition-colors hover:text-gold-bright"
          >
            Spring intro over
          </motion.button>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
