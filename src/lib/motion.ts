import type { Transition, Variants } from "framer-motion";

/** Long, soft deceleration – the house easing for reveals. */
export const EASE_CINEMATIC = [0.22, 1, 0.36, 1] as const;
/** Symmetric easing for things that move from A to B. */
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const sceneTransition: Transition = { duration: 0.9, ease: EASE_CINEMATIC };

/** Default scene entrance/exit: a gentle push in from the dark. */
export const sceneVariants: Variants = {
  initial: { opacity: 0, scale: 0.97 },
  enter: { opacity: 1, scale: 1, transition: sceneTransition },
  exit: { opacity: 0, scale: 1.03, transition: { duration: 0.6, ease: EASE_IN_OUT } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_CINEMATIC } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: EASE_CINEMATIC } },
};
