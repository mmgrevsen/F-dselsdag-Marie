"use client";

import { AnimatePresence, motion } from "framer-motion";
import { EASE_CINEMATIC } from "@/lib/motion";

/**
 * A horizontal anamorphic light streak that flashes across the screen.
 * Changing `trigger` plays it once.
 */
export function LightStreak({ trigger }: { trigger: number }) {
  return (
    <div aria-hidden="true" className="layer-streak">
      <AnimatePresence>
        {trigger > 0 && (
          <motion.div
            key={trigger}
            className="light-streak"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1, 1.15], opacity: [0, 1, 0] }}
            transition={{ duration: 1.3, ease: EASE_CINEMATIC, times: [0, 0.35, 1] }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
