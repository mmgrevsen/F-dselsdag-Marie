"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface QuizProgressProps {
  current: number;
  total: number;
  /** Number of questions solved so far. */
  completed: number;
}

/** Film-frame style progress: one gold cell per question. */
export function QuizProgress({ current, total, completed }: QuizProgressProps) {
  return (
    <div className="w-full max-w-md">
      <div className="mb-3 flex items-baseline justify-between text-gold/80">
        <span className="eyebrow">Hemmelig mission</span>
        <span className="font-display text-sm tracking-[0.2em]">
          <span className="text-gold-light">{current}</span>
          <span className="text-gold/50"> / {total}</span>
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={`Spørgsmål ${current} af ${total}`}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={completed}
        className="flex gap-1.5"
      >
        {Array.from({ length: total }, (_, index) => {
          const done = index < completed;
          const active = index === current - 1 && !done;
          return (
            <span
              key={index}
              className={cn(
                "relative h-1.5 flex-1 overflow-hidden rounded-full bg-cream/10",
                active && "ring-1 ring-gold/50",
              )}
            >
              <motion.span
                className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-light"
                initial={false}
                animate={{ scaleX: done ? 1 : 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
}
