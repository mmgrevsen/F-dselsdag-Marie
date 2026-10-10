"use client";

import { useCallback } from "react";
import { motion, type Variants } from "framer-motion";
import { birthdayConfig } from "@/config/birthday";
import { CinematicButton } from "@/components/ui/CinematicButton";
import { Ornament } from "@/components/ui/Ornament";
import { EASE_CINEMATIC } from "@/lib/motion";

const { letter } = birthdayConfig;

const paragraphVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_CINEMATIC } },
};

/** Paragraphs appear one after another – quick enough to never hold up reading. */
const STAGGER = 0.22;
const FIRST_PARAGRAPH = 0.55;
const BUTTON_DELAY = FIRST_PARAGRAPH + (letter.paragraphs.length + 2) * STAGGER + 0.3;

interface BirthdayLetterProps {
  onContinue: () => void;
}

export function BirthdayLetter({ onContinue }: BirthdayLetterProps) {
  const focusOnMount = useCallback((element: HTMLElement | null) => {
    element?.focus({ preventScroll: true });
  }, []);

  return (
    <div className="flex w-full flex-col items-center">
      <motion.article
        aria-labelledby="letter-greeting"
        className="letter-paper"
        initial={{ opacity: 0, y: 80, scale: 0.9, rotate: -1.2 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
        transition={{ duration: 1.1, ease: EASE_CINEMATIC }}
      >
        <span aria-hidden="true" className="letter-border" />

        <motion.div
          className="relative"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: STAGGER, delayChildren: FIRST_PARAGRAPH } },
          }}
        >
          <motion.h2
            id="letter-greeting"
            ref={focusOnMount}
            tabIndex={-1}
            variants={paragraphVariants}
            className="letter-greeting outline-none"
          >
            {letter.greeting}
          </motion.h2>

          <motion.div variants={paragraphVariants} className="mt-3 mb-1 flex justify-center text-gold-deep/70">
            <Ornament />
          </motion.div>

          {letter.paragraphs.map((paragraph, index) => (
            <motion.p
              key={paragraph}
              variants={paragraphVariants}
              className={index === 0 ? "letter-paragraph letter-lead" : "letter-paragraph"}
            >
              {paragraph}
            </motion.p>
          ))}

          <motion.p variants={paragraphVariants} className="letter-signature">
            {letter.signature}
          </motion.p>
        </motion.div>
      </motion.article>

      <motion.div
        className="mt-9 mb-2 sm:mt-11"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: BUTTON_DELAY, duration: 0.8, ease: EASE_CINEMATIC }}
      >
        <CinematicButton onClick={onContinue} className="min-w-[17rem]">
          {letter.continueButton}
        </CinematicButton>
      </motion.div>
    </div>
  );
}
