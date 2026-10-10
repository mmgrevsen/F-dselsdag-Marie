"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { birthdayConfig } from "@/config/birthday";
import { EASE_CINEMATIC, EASE_IN_OUT } from "@/lib/motion";

interface EnvelopeAnimationProps {
  opened: boolean;
  onOpen: () => void;
}

/** Timing of the opening sequence, in seconds. */
const SEAL_BREAK = 0.45;
const FLAP_DELAY = 0.3;
const FLAP_DURATION = 0.7;
const LETTER_DELAY = 0.95;

/**
 * A cream envelope with a red wax seal. Tapping it breaks the seal, folds the
 * flap back and slides the letter out.
 */
export function EnvelopeAnimation({ opened, onOpen }: EnvelopeAnimationProps) {
  const id = useId();
  const gradient = (name: string) => `${id}-${name}`;

  return (
    <motion.div
      className="envelope-float"
      animate={opened ? { y: 0, rotate: 0 } : { y: [0, -10, 0], rotate: [-0.7, 0.7, -0.7] }}
      transition={
        opened
          ? { duration: 0.5, ease: EASE_CINEMATIC }
          : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <span aria-hidden="true" className="envelope-glow" />

      <button
        type="button"
        className="envelope"
        onClick={onOpen}
        disabled={opened}
        aria-label="Åbn kuverten"
        aria-expanded={opened}
      >
        <span aria-hidden="true" className="envelope-back" />

        <motion.span
          aria-hidden="true"
          className="envelope-letter"
          initial={false}
          animate={{ y: opened ? "-48%" : "0%" }}
          transition={{ delay: opened ? LETTER_DELAY : 0, duration: 0.85, ease: EASE_CINEMATIC }}
        >
          <span className="font-hand text-[clamp(1.1rem,5vw,1.5rem)] leading-none text-wine">
            {birthdayConfig.letter.greeting}
          </span>
          <span className="envelope-letter-line w-[88%]" />
          <span className="envelope-letter-line w-[72%]" />
          <span className="envelope-letter-line w-[80%]" />
        </motion.span>

        <svg aria-hidden="true" className="envelope-pocket" viewBox="0 0 300 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id={gradient("side")} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#efe0c1" />
              <stop offset="1" stopColor="#e6d2ab" />
            </linearGradient>
            <linearGradient id={gradient("bottom")} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#f6ead2" />
              <stop offset="1" stopColor="#eadabb" />
            </linearGradient>
          </defs>
          <path d="M0 0 L152 112 L0 200 Z" fill={`url(#${gradient("side")})`} />
          <path d="M300 0 L148 112 L300 200 Z" fill={`url(#${gradient("side")})`} />
          <path d="M0 200 L150 90 L300 200 Z" fill={`url(#${gradient("bottom")})`} />
          <path d="M0 200 L150 90 L300 200" fill="none" stroke="rgba(120,80,40,0.18)" strokeWidth="1" />
        </svg>

        <motion.span
          aria-hidden="true"
          className="envelope-flap"
          initial={false}
          animate={{ rotateX: opened ? 180 : 0, zIndex: opened ? 1 : 4 }}
          transition={{
            rotateX: { delay: opened ? FLAP_DELAY : 0, duration: FLAP_DURATION, ease: EASE_IN_OUT },
            zIndex: { delay: opened ? FLAP_DELAY + FLAP_DURATION / 2 : 0, duration: 0 },
          }}
        >
          <svg className="flap-face" viewBox="0 0 300 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id={gradient("flap")} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f6ead0" />
                <stop offset="1" stopColor="#e8d4ae" />
              </linearGradient>
            </defs>
            <path d="M0 0 H300 L150 120 Z" fill={`url(#${gradient("flap")})`} />
            <path d="M0 0 L150 120 L300 0" fill="none" stroke="rgba(120,80,40,0.22)" strokeWidth="1" />
          </svg>
          <svg className="flap-face flap-back" viewBox="0 0 300 120" preserveAspectRatio="none">
            <path d="M0 0 H300 L150 120 Z" fill="#d8c197" />
          </svg>
        </motion.span>

        <motion.span
          aria-hidden="true"
          className="wax-seal"
          initial={false}
          animate={
            opened
              ? { scale: [1, 1.18, 0.5], opacity: [1, 1, 0], rotate: 28, y: 24 }
              : { scale: 1, opacity: 1, rotate: 0, y: 0 }
          }
          transition={{ duration: SEAL_BREAK, ease: "easeIn" }}
        >
          <WaxSeal gradientId={gradient("seal")} />
        </motion.span>
      </button>
    </motion.div>
  );
}

/** A slightly irregular wax blob – fixed points so it renders identically every time. */
const SEAL_PATH = (() => {
  const wobble = [0, 2.5, -1.5, 3, -2, 1.5, -3, 2, -1, 3, -2.5, 1, -1.5, 2.5, -2, 1.5];
  const points = wobble.map((offset, i) => {
    const angle = (i / wobble.length) * Math.PI * 2;
    const radius = 46 + offset;
    return [50 + Math.cos(angle) * radius, 50 + Math.sin(angle) * radius];
  });
  return `M${points.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L")} Z`;
})();

function WaxSeal({ gradientId }: { gradientId: string }) {
  const initial = birthdayConfig.recipientName.charAt(0).toLocaleUpperCase("da-DK");
  return (
    <svg viewBox="0 0 100 100" className="size-full drop-shadow-[0_4px_6px_rgba(60,0,10,0.45)]">
      <defs>
        <radialGradient id={gradientId} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#d23a4e" />
          <stop offset="0.55" stopColor="#9e1528" />
          <stop offset="1" stopColor="#5e0814" />
        </radialGradient>
      </defs>
      <path d={SEAL_PATH} fill={`url(#${gradientId})`} strokeLinejoin="round" stroke="#7a0f1f" strokeWidth="3" />
      <circle cx="50" cy="50" r="31" fill="none" stroke="rgba(255,190,190,0.28)" strokeWidth="2" />
      <circle cx="50" cy="50" r="27" fill="none" stroke="rgba(60,0,10,0.35)" strokeWidth="1.5" />
      <text
        x="50"
        y="51"
        textAnchor="middle"
        dominantBaseline="central"
        className="font-display"
        fontSize="32"
        fontWeight="700"
        fill="rgba(255,205,205,0.55)"
      >
        {initial}
      </text>
    </svg>
  );
}
