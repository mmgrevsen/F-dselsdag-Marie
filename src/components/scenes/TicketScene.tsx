"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Ticket } from "lucide-react";
import { experience } from "@/config/experience";
import { useExperience } from "@/state/experience-state";
import { CinemaButton, useMotionPrefs } from "@/components/ui";
import { CinemaTicket } from "@/components/CinemaTicket";
import { fireCelebration } from "@/lib/celebrate";

const { invitation } = experience;

/**
 * Scene 6 + 7 — billetten og "ACCEPTER INVITATIONEN".
 * Billetten er sidens visuelle midtpunkt; accepten udløser konfetti,
 * et varmt gyldent skær og overgangen til den afsluttende hyldest.
 */
export function TicketScene() {
  const { next, play } = useExperience();
  const { reduce, transition } = useMotionPrefs();
  const [accepting, setAccepting] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => clear, [clear]);

  const accept = () => {
    if (accepting) return;
    setAccepting(true);
    play("success");
    void fireCelebration(reduce);
    clear();
    timer.current = setTimeout(() => next(), reduce ? 600 : 1500);
  };

  return (
    <section className="scene-shell" aria-label="Din invitation">
      <div className="flex w-full flex-col items-center gap-7 sm:gap-9">
        <CinemaTicket glowing={accepting} />

        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition(0.9, reduce ? 0 : 0.5)}
        >
          <CinemaButton
            onClick={accept}
            disabled={accepting}
            className="px-9 py-4 text-sm sm:text-base"
          >
            <Ticket className="size-4" aria-hidden />
            {invitation.acceptCta}
          </CinemaButton>
          <p className="font-sans text-[0.58rem] tracking-[0.28em] text-ivory-dim/50 uppercase">
            Ingen tilmelding, ingen formularer — bare et ja.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
