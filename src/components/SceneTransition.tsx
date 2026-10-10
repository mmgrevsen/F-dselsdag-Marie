"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { CINEMA_EASE, useMotionPrefs } from "@/components/ui";

/**
 * Filmisk klip mellem scener: et kort blink af lys, mens den gamle scene
 * forsvinder og den nye kører ind.
 */
export function SceneTransition({
  sceneKey,
  children,
}: {
  sceneKey: string;
  children: ReactNode;
}) {
  const { reduce } = useMotionPrefs();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={sceneKey}
        className="relative z-10 w-full"
        initial={{ opacity: 0, scale: reduce ? 1 : 1.035, filter: reduce ? "none" : "blur(6px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: reduce ? 1 : 0.985, filter: reduce ? "none" : "blur(8px)" }}
        transition={{ duration: reduce ? 0.2 : 0.65, ease: CINEMA_EASE }}
      >
        {!reduce ? (
          <motion.span
            aria-hidden
            className="pointer-events-none fixed inset-0 z-40 bg-gold-bright/12"
            initial={{ opacity: 0.55 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        ) : null}
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
