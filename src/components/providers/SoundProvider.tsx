"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { soundEngine, type SoundName } from "@/lib/sound/engine";
import {
  getServerSoundPreference,
  getSoundPreference,
  setSoundPreference,
  subscribeToSoundPreference,
} from "@/lib/sound/preference";

interface SoundContextValue {
  enabled: boolean;
  /** Toggles sound. Plays `confirmation` when sound is switched on. */
  toggle: (confirmation?: SoundName) => void;
  /** Plays a sound if sound is enabled; otherwise does nothing. */
  play: (name: SoundName) => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const enabled = useSyncExternalStore(
    subscribeToSoundPreference,
    getSoundPreference,
    getServerSoundPreference,
  );

  const play = useCallback((name: SoundName) => {
    if (!getSoundPreference()) return;
    if (soundEngine.unlock()) soundEngine.play(name);
  }, []);

  const toggle = useCallback((confirmation: SoundName = "tap") => {
    const next = !getSoundPreference();
    setSoundPreference(next);
    if (next && soundEngine.unlock()) soundEngine.play(confirmation);
  }, []);

  const value = useMemo(() => ({ enabled, toggle, play }), [enabled, toggle, play]);

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound(): SoundContextValue {
  const context = useContext(SoundContext);
  if (!context) throw new Error("useSound must be used inside <SoundProvider>");
  return context;
}
