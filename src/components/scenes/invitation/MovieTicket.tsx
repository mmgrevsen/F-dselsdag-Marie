"use client";

import { useCallback } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  type Variants,
} from "framer-motion";
import { Popcorn } from "lucide-react";
import { birthdayConfig } from "@/config/birthday";
import { EASE_CINEMATIC } from "@/lib/motion";
import type { EventDetails } from "@/types/experience";

const { invitation, eventDetails, age } = birthdayConfig;

/** Only the event details that have actually been filled in. */
const filledDetails = (Object.keys(invitation.detailLabels) as Array<keyof EventDetails>)
  .filter((key) => eventDetails[key].trim() !== "")
  .map((key) => ({ key, label: invitation.detailLabels[key], value: eventDetails[key] }));

/** A deterministic decorative barcode. */
const BARCODE = (() => {
  const bars: Array<{ x: number; w: number }> = [];
  let seed = 11;
  let x = 0;
  while (x < 196) {
    seed = (seed * 9301 + 49297) % 233280;
    const w = 1 + (seed % 3);
    bars.push({ x, w });
    x += w + 1 + ((seed >> 3) % 3);
  }
  return bars;
})();

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_CINEMATIC } },
};

const headlineVariants: Variants = {
  hidden: { opacity: 0, scale: 1.18 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: EASE_CINEMATIC } },
};

export type TicketEntrance = "premiere" | "return";

interface MovieTicketProps {
  accepted: boolean;
  /** Increment to make the ticket glow and shine. */
  glow: number;
  entrance: TicketEntrance;
  onLanded?: () => void;
}

export function MovieTicket({ accepted, glow, entrance, onLanded }: MovieTicketProps) {
  const premiere = entrance === "premiere";

  // Subtle 3D tilt that follows the mouse (desktop only).
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 140, damping: 18 });
  const rotateY = useSpring(tiltY, { stiffness: 140, damping: 18 });
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(20);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.55), transparent 50%)`;

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    tiltY.set((px - 0.5) * 12);
    tiltX.set(-(py - 0.5) * 10);
    glareX.set(px * 100);
    glareY.set(py * 100);
  };

  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const focusOnMount = useCallback((element: HTMLElement | null) => {
    element?.focus({ preventScroll: true });
  }, []);

  return (
    <div className="ticket-stage">
      <motion.div
        className="ticket-rise"
        initial={
          premiere
            ? { opacity: 0, y: 320, rotateX: 42, rotateZ: -8, scale: 0.84 }
            : { opacity: 0, y: 40, scale: 0.95 }
        }
        animate={{ opacity: 1, y: 0, rotateX: 0, rotateZ: 0, scale: 1 }}
        transition={
          premiere
            ? { duration: 1.8, ease: EASE_CINEMATIC, opacity: { duration: 0.6 } }
            : { duration: 0.7, ease: EASE_CINEMATIC }
        }
        onAnimationComplete={onLanded}
      >
        <motion.div
          className="ticket-tilt"
          style={{ rotateX, rotateY }}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetTilt}
        >
          <AnimatePresence>
            {(accepted || glow > 0) && (
              <motion.span
                key={glow}
                aria-hidden="true"
                className="ticket-halo"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: [0, 1, 0.5], scale: [0.9, 1.06, 1] }}
                transition={{ duration: 1.8, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>

          <motion.div
            className="ticket"
            data-accepted={accepted}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.13, delayChildren: premiere ? 1.15 : 0.2 },
              },
            }}
          >
            <div className="ticket-part ticket-main">
              <span aria-hidden="true" className="ticket-rays" />
              <span aria-hidden="true" className="ticket-frame" />
              <TicketCorners />

              <div className="relative flex flex-col items-center text-center">
                <motion.span variants={itemVariants} aria-hidden="true" className="ticket-icon">
                  <Popcorn className="size-[18px]" strokeWidth={1.6} />
                </motion.span>

                <motion.p variants={itemVariants} className="ticket-eyebrow mt-3">
                  {invitation.eyebrow}
                </motion.p>

                <motion.p variants={itemVariants} className="ticket-to mt-3">
                  {invitation.recipient}
                </motion.p>

                <motion.div variants={itemVariants} aria-hidden="true" className="ticket-divider">
                  <span />✦<span />
                </motion.div>

                <motion.h2
                  ref={focusOnMount}
                  tabIndex={-1}
                  variants={headlineVariants}
                  className="ticket-headline outline-none"
                >
                  {splitHeadline(invitation.headline)}
                </motion.h2>

                <motion.p variants={itemVariants} className="ticket-sub mt-4">
                  {invitation.subheadline}
                </motion.p>

                <motion.p variants={itemVariants} className="ticket-desc mt-3">
                  {invitation.description}
                </motion.p>

                {filledDetails.length > 0 && (
                  <motion.dl variants={itemVariants} className="ticket-details">
                    {filledDetails.map((detail) => (
                      <div key={detail.key}>
                        <dt>{detail.label}</dt>
                        <dd>{detail.value}</dd>
                      </div>
                    ))}
                  </motion.dl>
                )}
              </div>

              <TicketSheen glow={glow} />
              <motion.span aria-hidden="true" className="ticket-glare" style={{ background: glare }} />
            </div>

            <div className="ticket-part ticket-stub">
              <div className="ticket-stub-content">
                <motion.p variants={itemVariants} className="ticket-gift">
                  {invitation.gift}
                </motion.p>
                <motion.span variants={itemVariants} aria-hidden="true" className="age-badge">
                  <strong>{age}</strong>
                  <small>ÅR</small>
                </motion.span>
              </div>

              <motion.svg
                variants={itemVariants}
                aria-hidden="true"
                className="ticket-barcode"
                viewBox="0 0 196 24"
                preserveAspectRatio="none"
              >
                {BARCODE.map((bar) => (
                  <rect key={bar.x} x={bar.x} y="0" width={bar.w} height="24" />
                ))}
              </motion.svg>

              <AnimatePresence>
                {accepted && (
                  <motion.span
                    className="ticket-stamp"
                    initial={{ opacity: 0, scale: 2.2, rotate: -22 }}
                    animate={{ opacity: 1, scale: 1, rotate: -11 }}
                    transition={{ type: "spring", stiffness: 300, damping: 17, delay: entrance === "premiere" ? 0.25 : 0 }}
                  >
                    {invitation.acceptedStamp}
                  </motion.span>
                )}
              </AnimatePresence>

              <TicketSheen glow={glow} />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/** Splits "DU ER INVITERET!" into two stacked lines, poster style. */
function splitHeadline(text: string) {
  const words = text.split(" ");
  if (words.length < 2) return text;
  const last = words.pop();
  return (
    <>
      <span className="block">{words.join(" ")}</span>
      <span className="block">{last}</span>
    </>
  );
}

/** A soft white sheen that sweeps across the paper when the ticket glows. */
function TicketSheen({ glow }: { glow: number }) {
  if (glow === 0) return null;
  return (
    <motion.span
      key={glow}
      aria-hidden="true"
      className="ticket-sheen"
      initial={{ x: "-150%" }}
      animate={{ x: "450%" }}
      transition={{ duration: 1.3, ease: [0.45, 0, 0.2, 1] }}
    />
  );
}

function TicketCorners() {
  return (
    <>
      {["left-4 top-4", "right-4 top-4", "left-4 bottom-4", "right-4 bottom-4"].map((position) => (
        <span key={position} aria-hidden="true" className={`ticket-corner ${position}`}>
          ✦
        </span>
      ))}
    </>
  );
}
