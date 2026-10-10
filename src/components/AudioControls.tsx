"use client";

import { Volume2, VolumeX } from "lucide-react";
import { experience } from "@/config/experience";
import { useExperience } from "@/state/experience-state";

/**
 * Lydknap. Lyden er slået fra som udgangspunkt og aktiveres udelukkende her,
 * altså først efter en bevidst brugerhandling.
 */
export function AudioControls() {
  const { soundEnabled, toggleSound } = useExperience();
  const label = soundEnabled
    ? experience.audio.toggleLabelOn
    : experience.audio.toggleLabelOff;

  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-pressed={soundEnabled}
      aria-label={label}
      title={label}
      className="pointer-events-auto inline-flex h-11 min-w-11 items-center gap-2 rounded-full border border-gold/30 bg-ink/70 px-3.5 text-gold/85 backdrop-blur-md transition-colors duration-300 hover:border-gold/70 hover:text-gold-bright"
    >
      {soundEnabled ? (
        <Volume2 className="size-4" aria-hidden />
      ) : (
        <VolumeX className="size-4" aria-hidden />
      )}
      <span className="hidden font-sans text-[0.6rem] font-medium tracking-[0.26em] uppercase sm:inline">
        {soundEnabled ? "Lyd til" : "Lyd fra"}
      </span>
    </button>
  );
}
