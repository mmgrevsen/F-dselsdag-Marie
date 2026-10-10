"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "ghost" | "quiet";

interface CinematicButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * The one button style used throughout the experience.
 * - primary: glowing gold, for the main action of a scene
 * - ghost: gold outline, for secondary actions
 * - quiet: small text button, for discreet actions like replay
 */
export function CinematicButton({
  variant = "primary",
  icon,
  className,
  children,
  type = "button",
  ...rest
}: CinematicButtonProps) {
  return (
    <motion.button
      type={type}
      className={cn("btn", `btn-${variant}`, className)}
      whileHover={{ scale: variant === "quiet" ? 1 : 1.035, y: -1 }}
      whileTap={{ scale: 0.96, y: 0 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      {...rest}
    >
      {variant === "primary" && <span aria-hidden="true" className="btn-aura" />}
      {variant === "primary" && <span aria-hidden="true" className="btn-shine" />}
      <span className="btn-label">
        {icon}
        {children}
      </span>
    </motion.button>
  );
}
