"use client";

import { RotateCcw } from "lucide-react";
import { useExperience } from "@/state/experience-state";

/** Diskret kontrol, der nulstiller hele oplevelsen. */
export function ReplayControls() {
  const { restart, scene, play } = useExperience();
  if (scene === "intro") return null;

  return (
    <button
      type="button"
      onClick={() => {
        play("whoosh");
        restart();
      }}
      aria-label="Start oplevelsen forfra"
      title="Start forfra"
      className="pointer-events-auto inline-flex h-11 items-center gap-2 rounded-full border border-gold/20 bg-ink/60 px-3.5 text-ivory-dim/70 backdrop-blur-md transition-colors duration-300 hover:border-gold/60 hover:text-gold-bright"
    >
      <RotateCcw className="size-4" aria-hidden />
      <span className="hidden font-sans text-[0.6rem] font-medium tracking-[0.26em] uppercase sm:inline">
        Forfra
      </span>
    </button>
  );
}
