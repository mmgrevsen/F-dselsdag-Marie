"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Mail } from "lucide-react";
import { experience } from "@/config/experience";
import { useExperience } from "@/state/experience-state";
import { CinemaButton, useMotionPrefs } from "@/components/ui";
import { useSequence } from "@/lib/useSequence";

const { personal, letter } = experience;
const BEATS = personal.beats.length;

/**
 * Scene 4 — det personlige øjeblik.
 * Roligere baggrund, en forseglet kuvert og selve brevet til far.
 */
export function BirthdayLetter() {
  const { next, play, stopProjector } = useExperience();
  const { reduce, transition, shift } = useMotionPrefs();
  const [opened, setOpened] = useState(false);

  const { step, finish, done } = useSequence(BEATS, reduce ? 420 : 1500, {
    startDelayMs: reduce ? 100 : 500,
  });

  useEffect(() => {
    // Projektørstøjen hører til de store scener, ikke til brevet.
    stopProjector();
  }, [stopProjector]);

  const openEnvelope = () => {
    setOpened(true);
    finish();
    play("reveal");
  };

  return (
    <section className="scene-shell" aria-label="Det personlige brev">
      <div className="flex w-full max-w-2xl flex-col items-center gap-9">
        {!opened ? (
          <div className="flex min-h-[11rem] flex-col items-center justify-center gap-5">
            {personal.beats.map((beat, index) => (
              <AnimatePresence key={beat}>
                {step >= index + 1 ? (
                  <motion.p
                    initial={{ opacity: 0, y: shift(14) }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={transition(1.3)}
                    className={
                      index === 0
                        ? "display-title max-w-[24ch] text-balance text-lg text-ivory sm:text-xl md:text-2xl"
                        : "max-w-[34ch] text-pretty font-letter text-base text-ivory-dim/85 sm:text-lg"
                    }
                  >
                    {beat}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            ))}
          </div>
        ) : null}

        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="envelope"
              className="flex flex-col items-center gap-6"
              initial={{ opacity: 0, y: shift(20) }}
              animate={{ opacity: done ? 1 : 0.25, y: 0 }}
              exit={{ opacity: 0, scale: reduce ? 1 : 0.9, y: shift(-20) }}
              transition={transition(0.9)}
            >
              <Envelope onOpen={openEnvelope} disabled={!done} />
              <p className="font-sans text-[0.6rem] tracking-[0.3em] text-ivory-dim/55 uppercase">
                {personal.envelopeHint}
              </p>
              <CinemaButton onClick={openEnvelope} disabled={!done}>
                <Mail className="size-4" aria-hidden />
                {personal.envelopeCta}
              </CinemaButton>
            </motion.div>
          ) : (
            <motion.div
              key="letter"
              className="flex w-full flex-col items-center gap-9"
              initial={{ opacity: 0, y: shift(26), rotateX: reduce ? 0 : -8 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={transition(1)}
            >
              <article
                className="paper relative w-full max-w-xl rounded-[3px] px-6 py-9 text-left shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] sm:px-11 sm:py-12"
                aria-label={letter.heading}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-[7px] rounded-[2px] border border-[#b4914f]/35"
                />
                <div className="relative flex flex-col gap-5">
                  <h2 className="font-letter text-2xl text-[#5c1420] sm:text-[1.75rem]">
                    {letter.greeting}
                  </h2>
                  {letter.paragraphs.map((paragraph, index) => (
                    <motion.p
                      key={paragraph}
                      initial={{ opacity: 0, y: shift(10) }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={transition(0.7, reduce ? 0 : 0.18 + index * 0.16)}
                      className="font-letter text-[1.06rem] leading-[1.72] text-[#2d1c17] sm:text-[1.15rem] sm:leading-[1.8]"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={transition(0.8, reduce ? 0 : 0.2 + letter.paragraphs.length * 0.16)}
                    className="mt-2 font-letter text-[1.06rem] leading-relaxed text-[#2d1c17] sm:text-[1.15rem]"
                  >
                    {letter.closing}{" "}
                    <span className="text-[#5c1420] italic">{letter.signature}</span>
                  </motion.p>
                </div>
              </article>

              <div className="flex flex-col items-center gap-5">
                <p className="display-title text-base text-gold-bright sm:text-lg">
                  {personal.revealQuestion}
                </p>
                <CinemaButton
                  onClick={() => {
                    play("whoosh");
                    next();
                  }}
                >
                  {personal.revealCta}
                  <ChevronRight className="size-4" aria-hidden />
                </CinemaButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/** Forseglet kuvert, der også kan aktiveres direkte. */
function Envelope({
  onOpen,
  disabled,
}: {
  onOpen: () => void;
  disabled: boolean;
}) {
  const { reduce } = useMotionPrefs();
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      disabled={disabled}
      aria-label={personal.envelopeCta}
      whileHover={reduce || disabled ? undefined : { scale: 1.03, rotate: -0.6 }}
      whileTap={reduce || disabled ? undefined : { scale: 0.98 }}
      animate={reduce ? undefined : { y: [0, -6, 0] }}
      transition={reduce ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="relative block h-36 w-56 rounded-[3px] shadow-[0_32px_70px_-32px_rgba(0,0,0,0.95)] disabled:cursor-default sm:h-44 sm:w-72"
    >
      <span aria-hidden className="paper absolute inset-0 rounded-[3px]" />
      <span
        aria-hidden
        className="absolute inset-0 overflow-hidden rounded-[3px] border border-[#b4914f]/50"
      >
        {/* Kuvertens flap */}
        <span
          className="absolute inset-x-0 top-0 h-1/2 origin-top"
          style={{
            background: "linear-gradient(180deg, #efe3d1, #e2d2ba)",
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          }}
        />
        <span
          className="absolute inset-x-0 bottom-0 h-px"
          style={{ background: "rgba(180,145,79,0.45)" }}
        />
      </span>
      {/* Voksegl */}
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/60 bg-gradient-to-b from-crimson to-burgundy-deep font-display text-[0.65rem] tracking-[0.1em] text-gold-bright shadow-[0_8px_22px_-8px_rgba(0,0,0,0.9)] sm:size-14 sm:text-xs"
      >
        41
      </span>
    </motion.button>
  );
}
