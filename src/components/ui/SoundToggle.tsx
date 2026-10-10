"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/components/providers/SoundProvider";
import type { SoundName } from "@/lib/sound/engine";

interface SoundToggleProps {
  /** Sound to play as confirmation when sound is switched on. */
  confirmation?: SoundName;
}

export function SoundToggle({ confirmation }: SoundToggleProps) {
  const { enabled, toggle } = useSound();

  return (
    <button
      type="button"
      onClick={() => toggle(confirmation)}
      aria-pressed={enabled}
      title={enabled ? "Slå lyden fra" : "Slå lyden til"}
      className="sound-toggle"
      data-enabled={enabled}
    >
      {enabled ? (
        <Volume2 aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
      ) : (
        <VolumeX aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
      )}
      <span>Lyd</span>
      <span aria-hidden="true" className="sound-toggle-dot" />
    </button>
  );
}
