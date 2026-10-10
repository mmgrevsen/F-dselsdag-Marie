"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";
import { birthdayConfig } from "@/config/birthday";
import { useSound } from "@/components/providers/SoundProvider";
import { CinematicButton } from "@/components/ui/CinematicButton";
import { acceptCelebration, ticketBurst } from "@/lib/celebrate";
import { EASE_CINEMATIC } from "@/lib/motion";
import { FinalMessage } from "./FinalMessage";
import { MovieTicket } from "./MovieTicket";

const { invitation } = birthdayConfig;

/** Timeline of the premiere, in ms after the scene starts. */
const CURTAINS_OPEN_AT = 650;
const TICKET_RISES_AT = 1250;
/** After the ticket lands, the accept button follows. */
const BUTTON_DELAY = 1700;
/** How long the ticket celebrates before the final message takes over. */
const MESSAGE_DELAY = 2000;

type View = "ticket" | "message";

interface CinemaInvitationProps {
  /** The stage opens the curtains and focuses the spotlight. */
  onCurtainsOpen: () => void;
  onReplay: () => void;
}

export function CinemaInvitation({ onCurtainsOpen, onReplay }: CinemaInvitationProps) {
  const { play } = useSound();
  const [ticketVisible, setTicketVisible] = useState(false);
  const [landed, setLanded] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [glow, setGlow] = useState(0);
  const [view, setView] = useState<View>("ticket");
  const [messageSeen, setMessageSeen] = useState(false);

  const landedRef = useRef(false);
  const acceptedRef = useRef(false);
  const timers = useRef<number[]>([]);
  const stopCelebration = useRef<(() => void) | null>(null);

  const openCurtains = useEffectEvent(() => {
    play("whoosh");
    onCurtainsOpen();
  });

  useEffect(() => {
    const pending = timers.current;
    pending.push(
      window.setTimeout(() => openCurtains(), CURTAINS_OPEN_AT),
      window.setTimeout(() => setTicketVisible(true), TICKET_RISES_AT),
    );
    return () => {
      pending.forEach((id) => window.clearTimeout(id));
      stopCelebration.current?.();
    };
  }, []);

  const handleLanded = () => {
    if (landedRef.current) return;
    landedRef.current = true;
    setLanded(true);
    ticketBurst();
    play("reveal");
    timers.current.push(window.setTimeout(() => setButtonVisible(true), BUTTON_DELAY));
  };

  const accept = () => {
    if (acceptedRef.current) return;
    acceptedRef.current = true;
    setAccepted(true);
    setGlow((count) => count + 1);
    play("celebrate");
    stopCelebration.current = acceptCelebration();
    timers.current.push(window.setTimeout(() => setView("message"), MESSAGE_DELAY));
  };

  const seeTicketAgain = () => {
    play("tap");
    setMessageSeen(true);
    setView("ticket");
  };

  return (
    <motion.section
      aria-label="Din overraskelse"
      className="scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.6 } }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
    >
      <div className="scene-inner items-center justify-center">
        <AnimatePresence mode="wait">
          {view === "ticket" ? (
            <motion.div
              key="ticket"
              className="flex w-full flex-col items-center"
              exit={{ opacity: 0, y: -30, scale: 0.94, transition: { duration: 0.55, ease: "easeIn" } }}
            >
              {ticketVisible && (
                <MovieTicket
                  accepted={accepted}
                  glow={glow}
                  entrance={landed ? "return" : "premiere"}
                  onLanded={landed ? undefined : handleLanded}
                />
              )}

              <div className="mt-9 flex min-h-[7rem] flex-col items-center gap-3 sm:mt-11">
                <AnimatePresence mode="wait">
                  {!accepted && buttonVisible && (
                    <motion.div
                      key="accept"
                      initial={{ opacity: 0, y: 18, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
                      transition={{ duration: 0.8, ease: EASE_CINEMATIC }}
                    >
                      <CinematicButton onClick={accept}>{invitation.acceptButton}</CinematicButton>
                    </motion.div>
                  )}

                  {accepted && (
                    <motion.div
                      key="accepted"
                      className="flex flex-col items-center gap-2"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: EASE_CINEMATIC }}
                    >
                      <p role="status" className="accepted-status">
                        <Check aria-hidden="true" className="size-4" strokeWidth={2.25} />
                        {invitation.acceptedStatus}
                      </p>
                      {messageSeen && (
                        <CinematicButton
                          variant="quiet"
                          onClick={onReplay}
                          icon={<RotateCcw aria-hidden="true" className="size-3.5" strokeWidth={1.75} />}
                        >
                          {invitation.replay}
                        </CinematicButton>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <FinalMessage key="message" onSeeTicket={seeTicketAgain} onReplay={onReplay} />
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
