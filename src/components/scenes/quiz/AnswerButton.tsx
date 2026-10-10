"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import type { QuizAnswer } from "@/types/experience";

export type AnswerState = "idle" | "wrong" | "correct" | "faded";

interface AnswerButtonProps {
  answer: QuizAnswer;
  state: AnswerState;
  /** True while a transition is running – clicks are ignored. */
  locked: boolean;
  onSelect: (answer: QuizAnswer, element: HTMLButtonElement) => void;
}

const SHAKE = { x: [0, -11, 10, -7, 5, -2, 0] };

export function AnswerButton({ answer, state, locked, onSelect }: AnswerButtonProps) {
  const inactive = locked || state === "wrong" || state === "faded";

  return (
    <motion.button
      type="button"
      className="answer"
      data-state={state}
      aria-disabled={inactive}
      aria-keyshortcuts={answer.id}
      onClick={(event) => {
        if (!inactive) onSelect(answer, event.currentTarget);
      }}
      animate={
        state === "wrong"
          ? { ...SHAKE, opacity: 0.5 }
          : state === "faded"
            ? { opacity: 0.3, scale: 0.98 }
            : state === "correct"
              ? { scale: [1, 1.04, 1], opacity: 1 }
              : { x: 0, opacity: 1, scale: 1 }
      }
      transition={{ duration: state === "wrong" ? 0.5 : 0.45, ease: "easeOut" }}
      whileHover={inactive ? undefined : { y: -2 }}
      whileTap={inactive ? undefined : { scale: 0.97 }}
    >
      <span className="answer-badge" aria-hidden="true">
        {state === "correct" ? (
          <Check className="size-4" strokeWidth={2.5} />
        ) : state === "wrong" ? (
          <X className="size-4" strokeWidth={2.5} />
        ) : (
          answer.id
        )}
      </span>
      <span className="answer-label">{answer.label}</span>
    </motion.button>
  );
}
