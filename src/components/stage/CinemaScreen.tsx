"use client";

import { RevealText } from "@/components/ui/RevealText";
import type { ScreenState } from "@/types/experience";

interface CinemaScreenProps {
  state: ScreenState;
  /** Text "projected" onto the screen while it is lit. */
  caption?: string;
}

/**
 * The illuminated cream cinema screen behind the curtains. It lights up at the
 * end of the countdown and carries the opening line of the letter scene.
 * It is decorative – scenes repeat the caption for screen readers.
 */
export function CinemaScreen({ state, caption }: CinemaScreenProps) {
  return (
    <div aria-hidden="true" className="layer-screen" data-state={state}>
      <div className="cinema-screen-halo" />
      <div className="cinema-screen">
        <div className="cinema-screen-caption">
          {caption && state !== "off" && (
            <RevealText
              key={caption}
              text={caption}
              delay={0.7}
              stagger={0.07}
              className="max-w-[34rem] font-serif text-[clamp(1.45rem,5.6vw,2.3rem)] font-semibold italic leading-[1.22] text-ink text-balance"
            />
          )}
        </div>
      </div>
      <div className="cinema-screen-spill" />
    </div>
  );
}
