"use client";

import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { missionQuestions } from "@/data/quiz";
import { useSound } from "@/components/providers/SoundProvider";
import { RevealText } from "@/components/ui/RevealText";
import { missionCompleteBurst, sparkleFrom } from "@/lib/celebrate";
import { EASE_CINEMATIC, sceneVariants } from "@/lib/motion";
import type { AnswerId, QuizAnswer } from "@/types/experience";
import { AnswerButton, type AnswerState } from "./AnswerButton";
import { MissionComplete } from "./MissionComplete";
import { QuizProgress } from "./QuizProgress";

interface Feedback {
  key: number;
  text: string;
  tone: "correct" | "wrong";
}

/** How long a solved question stays on screen before the next one. */
const NEXT_QUESTION_DELAY = 1900;
/** How long a wrong answer blocks input (prevents frantic double taps). */
const RETRY_DELAY = 450;
const FINALE_STAMP_DELAY = 450;
const FINALE_DURATION = 3100;

const KEY_TO_INDEX: Record<string, number> = { a: 0, b: 1, c: 2, "1": 0, "2": 1, "3": 2 };

interface MissionQuizProps {
  onComplete: () => void;
}

export function MissionQuiz({ onComplete }: MissionQuizProps) {
  const { play } = useSound();
  const [index, setIndex] = useState(0);
  const [wrongIds, setWrongIds] = useState<AnswerId[]>([]);
  const [correctId, setCorrectId] = useState<AnswerId | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [solved, setSolved] = useState(0);
  const [finale, setFinale] = useState(false);
  const [locked, setLocked] = useState(false);

  const lockedRef = useRef(false);
  const feedbackKey = useRef(0);
  const timers = useRef<number[]>([]);
  const answersRef = useRef<HTMLDivElement>(null);

  const question = missionQuestions[index];
  const total = missionQuestions.length;

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  const schedule = (callback: () => void, ms: number) => {
    timers.current.push(window.setTimeout(callback, ms));
  };

  const setLock = (value: boolean) => {
    lockedRef.current = value;
    setLocked(value);
  };

  const showFeedback = (text: string, tone: Feedback["tone"]) => {
    feedbackKey.current += 1;
    setFeedback({ key: feedbackKey.current, text, tone });
  };

  const goToNextQuestion = () => {
    setIndex((current) => current + 1);
    setWrongIds([]);
    setCorrectId(null);
    setFeedback(null);
    setLock(false);
  };

  const select = (answer: QuizAnswer, element: HTMLElement | null) => {
    if (lockedRef.current || wrongIds.includes(answer.id)) return;
    setLock(true);

    if (!answer.correct) {
      setWrongIds((ids) => [...ids, answer.id]);
      showFeedback(answer.feedback ?? "Godt gæt! Men prøv igen.", "wrong");
      play("wrong");
      schedule(() => setLock(false), RETRY_DELAY);
      return;
    }

    setCorrectId(answer.id);
    setSolved((count) => count + 1);
    sparkleFrom(element);

    if (question.finale) {
      setFeedback(null);
      play("complete");
      schedule(() => {
        setFinale(true);
        missionCompleteBurst();
      }, FINALE_STAMP_DELAY);
      schedule(onComplete, FINALE_DURATION);
    } else {
      showFeedback(question.successMessage, "correct");
      play("success");
      schedule(goToNextQuestion, NEXT_QUESTION_DELAY);
    }
  };

  // Keyboard shortcuts: A/B/C or 1/2/3 pick an answer.
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
    const answerIndex = KEY_TO_INDEX[event.key.toLowerCase()];
    if (answerIndex === undefined) return;
    const answer = question.answers[answerIndex];
    const element = answersRef.current?.querySelectorAll("button")[answerIndex] ?? null;
    element?.focus();
    select(answer, element);
  });

  useEffect(() => {
    const handler = (event: KeyboardEvent) => onKeyDown(event);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Move focus to each new question so keyboard and screen reader users follow along.
  const focusOnMount = useCallback((element: HTMLElement | null) => {
    element?.focus({ preventScroll: true });
  }, []);

  const stateOf = (answer: QuizAnswer): AnswerState => {
    if (correctId) return answer.id === correctId ? "correct" : "faded";
    return wrongIds.includes(answer.id) ? "wrong" : "idle";
  };

  return (
    <motion.section
      aria-label="Den hemmelige mission"
      className="scene"
      variants={sceneVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <div className="scene-inner justify-center">
        <div className="mx-auto flex w-full max-w-xl flex-col items-center">
          <QuizProgress current={index + 1} total={total} completed={solved} />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={question.id}
              className="mt-9 w-full sm:mt-12"
              initial={{ opacity: 0, x: 48 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE_CINEMATIC } }}
              exit={{ opacity: 0, x: -48, transition: { duration: 0.35, ease: "easeIn" } }}
            >
              <RevealText
                as="h2"
                ref={focusOnMount}
                tabIndex={-1}
                text={question.prompt}
                delay={0.1}
                stagger={0.045}
                className="text-center font-serif text-[clamp(1.85rem,7.6vw,2.9rem)] font-semibold leading-[1.12] text-cream text-balance"
              />

              <div ref={answersRef} className="mt-8 flex flex-col gap-3 sm:mt-10 sm:gap-3.5">
                {question.answers.map((answer, answerIndex) => (
                  <motion.div
                    key={answer.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + answerIndex * 0.09, duration: 0.6, ease: EASE_CINEMATIC }}
                  >
                    <AnswerButton
                      answer={answer}
                      state={stateOf(answer)}
                      locked={locked}
                      onSelect={select}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div role="status" aria-live="polite" className="mt-6 flex min-h-[4.5rem] w-full items-start justify-center sm:mt-7">
            <AnimatePresence mode="wait">
              {feedback && (
                <motion.p
                  key={feedback.key}
                  data-tone={feedback.tone}
                  className="feedback"
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={
                    feedback.tone === "wrong"
                      ? { opacity: 1, y: 0, scale: 1, rotate: [0, -2.5, 2, -1, 0] }
                      : { opacity: 1, y: 0, scale: 1 }
                  }
                  exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.45, ease: EASE_CINEMATIC }}
                >
                  {feedback.tone === "correct" && (
                    <Sparkles aria-hidden="true" className="mr-2 inline size-[1em] -translate-y-px text-gold-light" strokeWidth={1.75} />
                  )}
                  {feedback.text}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>{finale && <MissionComplete message={question.successMessage} />}</AnimatePresence>
    </motion.section>
  );
}
