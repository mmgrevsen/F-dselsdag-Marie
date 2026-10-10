"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

/** The "mission accomplished" stamp that slams onto the screen. */
export function MissionComplete({ message }: { message: string }) {
  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,4,6,0.88)_0%,rgba(10,4,6,0.6)_55%,transparent_80%)]" />
      <motion.div
        role="status"
        className="relative flex flex-col items-center"
        initial={{ scale: 2.4, rotate: -14, opacity: 0 }}
        animate={{ scale: 1, rotate: -4, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 15, mass: 0.9 }}
      >
        <Sparkles aria-hidden="true" className="mb-4 size-7 text-gold-light" strokeWidth={1.5} />
        <p className="stamp font-display text-[clamp(1.5rem,7.6vw,3.4rem)] font-bold leading-[1.1] tracking-[0.06em] text-balance">
          {message}
        </p>
      </motion.div>
    </motion.div>
  );
}
