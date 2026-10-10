"use client";

/**
 * Centralt scene- og lydstyringssystem for hele oplevelsen.
 * Komponenterne kender kun deres egen scene og bruger disse hooks
 * til at bevæge sig fremad, spole tilbage og spille lyd.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SoundEngine, type SoundName } from "@/lib/sound";
import { experience } from "@/config/experience";

export const SCENES = [
  "intro",
  "credits",
  "quiz",
  "letter",
  "countdown",
  "ticket",
  "celebration",
] as const;

export type Scene = (typeof SCENES)[number];

interface ExperienceState {
  scene: Scene;
  sceneIndex: number;
  /** Tæller op ved hver fuld genstart, så scener kan nulstille deres indre tilstand. */
  runId: number;
  next: () => void;
  goTo: (scene: Scene) => void;
  restart: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  play: (name: SoundName) => void;
  startProjector: () => void;
  stopProjector: () => void;
}

const ExperienceContext = createContext<ExperienceState | null>(null);

export function ExperienceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [runId, setRunId] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(
    experience.audio.enabledByDefault,
  );
  const engineRef = useRef<SoundEngine | null>(null);

  const engine = useCallback(() => {
    if (!engineRef.current) engineRef.current = new SoundEngine();
    return engineRef.current;
  }, []);

  useEffect(() => {
    return () => {
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  const next = useCallback(() => {
    setSceneIndex((index) => Math.min(index + 1, SCENES.length - 1));
  }, []);

  const goTo = useCallback((scene: Scene) => {
    const index = SCENES.indexOf(scene);
    if (index >= 0) setSceneIndex(index);
  }, []);

  const restart = useCallback(() => {
    engineRef.current?.stopProjector();
    setSceneIndex(0);
    setRunId((id) => id + 1);
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((enabled) => {
      const nextEnabled = !enabled;
      const instance = engine();
      if (nextEnabled) {
        // Lyd aktiveres kun her — altså altid efter en bevidst brugerhandling.
        void instance.enable().then(() => instance.play("whoosh"));
      } else {
        instance.disable();
      }
      return nextEnabled;
    });
  }, [engine]);

  const play = useCallback(
    (name: SoundName) => {
      if (!soundEnabled) return;
      engine().play(name);
    },
    [engine, soundEnabled],
  );

  const startProjector = useCallback(() => {
    if (!soundEnabled) return;
    engine().startProjector();
  }, [engine, soundEnabled]);

  const stopProjector = useCallback(() => {
    engineRef.current?.stopProjector();
  }, []);

  const value = useMemo<ExperienceState>(
    () => ({
      scene: SCENES[sceneIndex],
      sceneIndex,
      runId,
      next,
      goTo,
      restart,
      soundEnabled,
      toggleSound,
      play,
      startProjector,
      stopProjector,
    }),
    [
      sceneIndex,
      runId,
      next,
      goTo,
      restart,
      soundEnabled,
      toggleSound,
      play,
      startProjector,
      stopProjector,
    ],
  );

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience(): ExperienceState {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error("useExperience skal bruges inde i en ExperienceProvider");
  }
  return context;
}
