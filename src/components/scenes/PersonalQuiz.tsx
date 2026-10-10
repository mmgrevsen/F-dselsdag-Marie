"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, Film } from "lucide-react";
import { experience } from "@/config/experience";
import { quizQuestions, type QuizOption } from "@/content/quiz";
import { useExperience } from "@/state/experience-state";
import { CinemaButton, Eyebrow, useMotionPrefs } from "@/components/ui";

const { quiz } = experience;
const TOTAL = quizQuestions.length;

/**
 * Scene 3 — den interaktive fødselsdagsprøve.
 * Alle svar er rigtige; hvert svar får sin egen sjove tilbagemelding.
 */
export function PersonalQuiz() {
  const { next, play } = useExperience();
  const { reduce, transition, shift } = useMotionPrefs();

  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<QuizOption | null>(null);
  /** Spærrer input, mens svaret animerer ind — så hurtige dobbeltklik ikke ødelægger tilstanden. */
  const [locked, setLocked] = useState(false);
  const [passed, setPassed] = useState(false);
  const unlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (unlockTimer.current) {
      clearTimeout(unlockTimer.current);
      unlockTimer.current = null;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const question = quizQuestions[index];

  const select = (option: QuizOption) => {
    if (locked || chosen) return;
    setLocked(true);
    setChosen(option);
    play("tick");
    clearTimer();
    unlockTimer.current = setTimeout(() => setLocked(false), reduce ? 200 : 650);
  };

  const advance = () => {
    if (locked) return;
    clearTimer();
    play("whoosh");
    if (index + 1 < TOTAL) {
      setIndex(index + 1);
      setChosen(null);
      return;
    }
    setPassed(true);
    play("reveal");
  };

  if (passed) {
    return (
      <section className="scene-shell" aria-label="Prøven er bestået">
        <motion.div
          className="flex w-full max-w-2xl flex-col items-center gap-7"
          initial={{ opacity: 0, scale: reduce ? 1 : 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={transition(0.9)}
        >
          <span className="flex size-16 items-center justify-center rounded-full border border-gold/50 bg-burgundy/40 text-gold-bright">
            <Check className="size-7" aria-hidden />
          </span>
          <h2 className="display-title title-sheen text-[clamp(1.8rem,9vw,3.6rem)]">
            {quiz.passed}
          </h2>
          <p className="max-w-[30ch] text-pretty font-letter text-lg text-ivory-dim sm:text-xl">
            {quiz.passedSub}
          </p>
          <CinemaButton
            onClick={() => {
              play("whoosh");
              next();
            }}
          >
            {quiz.cta}
            <ChevronRight className="size-4" aria-hidden />
          </CinemaButton>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="scene-shell" aria-label="Fødselsdagsprøven">
      <div className="flex w-full max-w-2xl flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <Eyebrow>{quiz.eyebrow}</Eyebrow>
          {/* Fremdriftsindikator */}
          <div
            className="flex items-center gap-2.5"
            role="group"
            aria-label={`Spørgsmål ${index + 1} af ${TOTAL}`}
          >
            {quizQuestions.map((item, itemIndex) => (
              <span
                key={item.id}
                aria-hidden
                className={`h-[3px] w-10 rounded-full transition-colors duration-500 sm:w-14 ${
                  itemIndex <= index ? "bg-gold" : "bg-ivory/15"
                }`}
              />
            ))}
          </div>
          <p className="font-sans text-[0.6rem] tracking-[0.3em] text-ivory-dim/55 uppercase">
            Scene {index + 1} af {TOTAL}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            className="flex w-full flex-col items-center gap-7"
            initial={{ opacity: 0, x: shift(28) }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: shift(-28) }}
            transition={transition(0.5)}
          >
            <h2 className="max-w-[24ch] text-balance font-letter text-[1.6rem] leading-tight font-semibold text-ivory sm:text-[2rem] md:text-[2.3rem]">
              {question.question}
            </h2>

            <ul className="flex w-full flex-col gap-3">
              {question.options.map((option) => {
                const isChosen = chosen?.id === option.id;
                const dimmed = chosen !== null && !isChosen;
                return (
                  <li key={option.id}>
                    <motion.button
                      type="button"
                      onClick={() => select(option)}
                      disabled={chosen !== null}
                      aria-pressed={isChosen}
                      whileHover={reduce || chosen ? undefined : { scale: 1.015 }}
                      whileTap={reduce || chosen ? undefined : { scale: 0.985 }}
                      animate={{ opacity: dimmed ? 0.35 : 1 }}
                      transition={{ duration: 0.35 }}
                      className={`flex min-h-16 w-full items-center gap-4 rounded-sm border px-4 py-4 text-left transition-colors duration-300 disabled:cursor-default sm:px-6 ${
                        isChosen
                          ? "border-gold bg-burgundy/55 text-ivory shadow-[0_16px_44px_-24px_rgba(216,180,114,0.7)]"
                          : "border-ivory/12 bg-ink/55 text-ivory-dim hover:border-gold/55 hover:bg-burgundy/25 hover:text-ivory"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`flex size-9 shrink-0 items-center justify-center rounded-full border font-display text-sm ${
                          isChosen
                            ? "border-gold bg-gold/15 text-gold-bright"
                            : "border-ivory/20 text-gold/70"
                        }`}
                      >
                        {option.letter}
                      </span>
                      <span className="font-sans text-[0.95rem] leading-snug sm:text-base">
                        {option.label}
                      </span>
                    </motion.button>
                  </li>
                );
              })}
            </ul>

            <div className="min-h-[7.5rem] w-full">
              <AnimatePresence>
                {chosen ? (
                  <motion.div
                    key={chosen.id}
                    className="flex flex-col items-center gap-5"
                    initial={{ opacity: 0, y: shift(14) }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={transition(0.5)}
                  >
                    <p className="flex max-w-[36ch] items-start gap-2.5 text-pretty font-letter text-base text-gold-bright/90 italic sm:text-lg">
                      <Film className="mt-1 size-4 shrink-0 text-gold/70" aria-hidden />
                      <span>{chosen.feedback}</span>
                    </p>
                    <CinemaButton onClick={advance} variant="ghost" disabled={locked}>
                      {index + 1 < TOTAL ? "Næste spørgsmål" : "Afslut prøven"}
                      <ChevronRight className="size-4" aria-hidden />
                    </CinemaButton>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
