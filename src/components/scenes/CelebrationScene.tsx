"use client";

import { motion } from "framer-motion";
import { PartyPopper, RotateCcw, Ticket } from "lucide-react";
import { experience } from "@/config/experience";
import { useExperience } from "@/state/experience-state";
import { CinemaButton, useMotionPrefs } from "@/components/ui";

const { celebration } = experience;

/** Scene 7 — den varme, festlige afslutning. */
export function CelebrationScene() {
  const { goTo, restart, play } = useExperience();
  const { reduce, transition } = useMotionPrefs();

  return (
    <section className="scene-shell" aria-label="Fejring">
      <motion.div
        className="flex w-full max-w-2xl flex-col items-center gap-7"
        initial={{ opacity: 0, scale: reduce ? 1 : 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={transition(0.9)}
      >
        <motion.span
          className="flex size-16 items-center justify-center rounded-full border border-gold/50 bg-burgundy/40 text-gold-bright sm:size-18"
          animate={reduce ? undefined : { rotate: [-6, 6, -6] }}
          transition={reduce ? undefined : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <PartyPopper className="size-7" aria-hidden />
        </motion.span>

        <h2 className="display-title title-sheen text-[clamp(2.6rem,15vw,7rem)] leading-none">
          {celebration.shout}
        </h2>

        <div className="gold-rule max-w-[16rem]" />

        <div className="flex flex-col gap-3">
          {celebration.lines.map((line, index) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, y: reduce ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transition(0.8, reduce ? 0 : 0.25 + index * 0.22)}
              className={
                index === 0
                  ? "font-letter text-[1.6rem] font-semibold text-ivory sm:text-[1.9rem]"
                  : "max-w-[32ch] text-pretty font-letter text-lg text-ivory-dim sm:max-w-[40ch] sm:text-xl"
              }
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={transition(0.9, reduce ? 0 : 1)}
          className="font-letter text-lg text-gold-bright/90 italic sm:text-xl"
        >
          {celebration.signature}
        </motion.p>

        <motion.div
          className="mt-3 flex flex-col items-center gap-3 sm:flex-row"
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition(0.8, reduce ? 0 : 1.2)}
        >
          <CinemaButton
            variant="ghost"
            onClick={() => {
              play("whoosh");
              goTo("ticket");
            }}
          >
            <Ticket className="size-4" aria-hidden />
            {celebration.backToTicketCta}
          </CinemaButton>
          <CinemaButton
            variant="quiet"
            onClick={() => {
              play("whoosh");
              restart();
            }}
          >
            <RotateCcw className="size-4" aria-hidden />
            {celebration.replayCta}
          </CinemaButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
