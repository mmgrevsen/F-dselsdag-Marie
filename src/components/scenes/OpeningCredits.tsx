"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Clapperboard } from "lucide-react";
import { experience } from "@/config/experience";
import { useExperience } from "@/state/experience-state";
import { CinemaButton, useMotionPrefs } from "@/components/ui";
import { useSequence } from "@/lib/useSequence";

const { credits } = experience;
const BEATS = credits.beats.length;

/**
 * Scene 2 — hovedpersonen præsenteres som i et stort actionforløb:
 * rulletekster, lyssweep og kontrollerede tekstafsløringer.
 */
export function OpeningCredits() {
  const { next, play } = useExperience();
  const { reduce, transition, shift } = useMotionPrefs();

  // Beats: 1..BEATS replikker · BEATS+1 "MED FAR I HOVEDROLLEN." · BEATS+2 spøg + knap
  const total = BEATS + 2;
  const { step, finish, done } = useSequence(total, reduce ? 420 : 1250, {
    startDelayMs: reduce ? 100 : 450,
  });

  useEffect(() => {
    if (step === BEATS + 1) play("impact");
  }, [step, play]);

  return (
    <section className="scene-shell" aria-label="Hovedpersonen">
      {/* Lyssweep hen over scenen */}
      {!reduce ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
          initial={false}
        >
          <motion.div
            className="absolute top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-gold-bright/8 to-transparent"
            animate={{ x: ["-40%", "180%"] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      ) : null}

      <div className="relative flex w-full max-w-3xl flex-col items-center gap-8">
        <div className="flex min-h-[15rem] flex-col items-center justify-center gap-5 sm:min-h-[17rem]">
          {credits.beats.map((beat, index) => {
            const isFirst = index === 0;
            return (
              <AnimatePresence key={beat}>
                {step >= index + 1 ? (
                  <motion.p
                    initial={{ opacity: 0, y: shift(20), scale: reduce ? 1 : 0.97 }}
                    animate={{ opacity: isFirst ? 0.75 : 1, y: 0, scale: 1 }}
                    transition={transition(1.1)}
                    className={
                      isFirst
                        ? "font-sans text-[0.62rem] font-medium tracking-[0.42em] text-gold/80 uppercase sm:text-xs"
                        : "display-title max-w-[22ch] text-balance text-lg text-ivory/95 sm:max-w-none sm:text-2xl md:text-[1.75rem]"
                    }
                  >
                    {beat}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            );
          })}
        </div>

        <AnimatePresence>
          {step >= BEATS + 1 ? (
            <motion.div
              key="starring"
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, scale: reduce ? 1 : 1.18, filter: reduce ? "none" : "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={transition(1.2)}
            >
              <div className="gold-rule max-w-[14rem]" />
              <h2 className="display-title title-sheen text-[clamp(1.6rem,7.5vw,3.4rem)]">
                {credits.starring}
              </h2>
              <div className="gold-rule max-w-[14rem]" />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {step >= BEATS + 2 ? (
            <motion.div
              key="outro"
              className="flex flex-col items-center gap-8"
              initial={{ opacity: 0, y: shift(16) }}
              animate={{ opacity: 1, y: 0 }}
              transition={transition(0.9)}
            >
              <p className="flex max-w-[34ch] items-start gap-2.5 text-pretty font-sans text-[0.8rem] leading-relaxed text-ivory-dim/65 sm:max-w-[48ch] sm:text-sm">
                <Clapperboard className="mt-0.5 size-4 shrink-0 text-gold/60" aria-hidden />
                <span>{credits.disclaimer}</span>
              </p>
              <CinemaButton
                onClick={() => {
                  play("whoosh");
                  next();
                }}
              >
                {credits.cta}
                <ChevronRight className="size-4" aria-hidden />
              </CinemaButton>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {!done ? (
          <motion.button
            type="button"
            onClick={finish}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 rounded-full px-5 py-3 font-sans text-[0.6rem] tracking-[0.3em] text-ivory-dim/50 uppercase transition-colors hover:text-gold-bright"
          >
            Spring frem
          </motion.button>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
