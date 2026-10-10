import { useId } from "react";
import { cn } from "@/lib/cn";

/** A thin gold divider with a diamond in the middle. Uses `currentColor`. */
export function Ornament({ className }: { className?: string }) {
  const id = useId();
  const left = `${id}-left`;
  const right = `${id}-right`;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 220 14"
      className={cn("h-3.5 w-[min(220px,60%)]", className)}
      fill="none"
    >
      <defs>
        <linearGradient id={left} x1="0" x2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="1" stopColor="currentColor" />
        </linearGradient>
        <linearGradient id={right} x1="1" x2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="1" stopColor="currentColor" />
        </linearGradient>
      </defs>
      <path d="M0 7 H92" stroke={`url(#${left})`} strokeWidth="1" />
      <path d="M128 7 H220" stroke={`url(#${right})`} strokeWidth="1" />
      <path d="M110 1 L116 7 L110 13 L104 7 Z" fill="currentColor" />
      <circle cx="98" cy="7" r="1.6" fill="currentColor" />
      <circle cx="122" cy="7" r="1.6" fill="currentColor" />
    </svg>
  );
}
