"use client";

import { motion, type Transition } from "framer-motion";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

export const CINEMA_EASE = [0.16, 1, 0.3, 1] as const;

export function useMotionPrefs() {
  const reduce = usePrefersReducedMotion();
  return {
    reduce,
    /** Fælles transition: rolig og filmisk, men kort hvis brugeren vil undgå bevægelse. */
    transition: (duration = 0.8, delay = 0): Transition =>
      reduce
        ? { duration: 0.28, delay: Math.min(delay, 0.2), ease: "linear" }
        : { duration, delay, ease: CINEMA_EASE },
    /** Forskydning slås fra ved reduceret bevægelse. */
    shift: (value: number) => (reduce ? 0 : value),
    scaleFrom: (value: number) => (reduce ? 1 : value),
  };
}

type ButtonVariant = "primary" | "ghost" | "quiet";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "border-gold/70 bg-gradient-to-b from-crimson/80 via-burgundy to-burgundy-deep text-gold-bright shadow-[0_18px_50px_-20px_rgba(216,180,114,0.55)] hover:border-gold hover:text-ivory",
  ghost:
    "border-gold/35 bg-ink/50 text-ivory-dim backdrop-blur-sm hover:border-gold/70 hover:text-ivory",
  quiet:
    "border-transparent bg-transparent text-ivory-dim/70 hover:text-gold-bright",
};

/** Cinematisk knap med tydelig fokusmarkering og rigelig touch-flade. */
export function CinemaButton({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  "aria-label"?: string;
}) {
  const { reduce } = useMotionPrefs();
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      whileHover={reduce || disabled ? undefined : { scale: 1.03 }}
      whileTap={reduce || disabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.2, ease: CINEMA_EASE }}
      className={`relative inline-flex min-h-13 items-center justify-center gap-2.5 overflow-hidden rounded-sm border px-7 py-3.5 font-sans text-[0.78rem] font-semibold tracking-[0.26em] uppercase transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-45 sm:text-sm ${VARIANTS[variant]} ${className}`}
    >
      {variant === "primary" && !reduce ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold-bright/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
      ) : null}
      <span className="relative z-10 flex items-center gap-2.5">{children}</span>
    </motion.button>
  );
}

/** Lille guldmarkeret overskrift over scenens titel. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-sans text-[0.62rem] font-medium tracking-[0.42em] text-gold/80 uppercase sm:text-xs">
      {children}
    </p>
  );
}
