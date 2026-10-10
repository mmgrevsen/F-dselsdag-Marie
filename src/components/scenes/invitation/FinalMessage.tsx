"use client";

import { useCallback } from "react";
import { motion, type Variants } from "framer-motion";
import { RotateCcw, Ticket } from "lucide-react";
import { birthdayConfig } from "@/config/birthday";
import { CinematicButton } from "@/components/ui/CinematicButton";
import { EASE_CINEMATIC, fadeUp } from "@/lib/motion";

const { finalMessage, invitation } = birthdayConfig;

const exclaimVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 14 },
  },
};

interface FinalMessageProps {
  onSeeTicket: () => void;
  onReplay: () => void;
}

export function FinalMessage({ onSeeTicket, onReplay }: FinalMessageProps) {
  const focusOnMount = useCallback((element: HTMLElement | null) => {
    element?.focus({ preventScroll: true });
  }, []);

  return (
    <motion.div
      className="mx-auto flex w-full max-w-2xl flex-col items-center text-center"
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: 24, transition: { duration: 0.45, ease: "easeIn" } }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.28, delayChildren: 0.15 } },
      }}
    >
      <motion.h2
        ref={focusOnMount}
        tabIndex={-1}
        variants={exclaimVariants}
        className="final-exclaim outline-none"
      >
        {finalMessage.exclamation}
      </motion.h2>

      <motion.p
        variants={fadeUp}
        className="mt-7 font-serif text-[clamp(1.8rem,7vw,2.8rem)] font-semibold italic leading-tight text-cream"
      >
        {finalMessage.lines[0]}
      </motion.p>

      <motion.p
        variants={fadeUp}
        className="mt-4 max-w-[30rem] text-[clamp(1.08rem,4.4vw,1.3rem)] leading-relaxed text-cream/85 text-balance"
      >
        {finalMessage.lines[1]}
      </motion.p>

      <motion.p variants={fadeUp} className="mt-6 font-hand text-[clamp(1.9rem,7.5vw,2.5rem)] leading-none text-gold-light">
        {finalMessage.signature}
      </motion.p>

      <motion.div
        variants={{
          hidden: { opacity: 0, y: 16 },
          visible: { opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.8, ease: EASE_CINEMATIC } },
        }}
        className="mt-12 flex flex-col items-center gap-2"
      >
        <CinematicButton
          variant="ghost"
          onClick={onSeeTicket}
          icon={<Ticket aria-hidden="true" className="size-4" strokeWidth={1.75} />}
        >
          {invitation.viewTicketAgain}
        </CinematicButton>
        <CinematicButton
          variant="quiet"
          onClick={onReplay}
          icon={<RotateCcw aria-hidden="true" className="size-3.5" strokeWidth={1.75} />}
        >
          {invitation.replay}
        </CinematicButton>
      </motion.div>
    </motion.div>
  );
}
