"use client";

import { MotionConfig } from "framer-motion";
import {
  ExperienceProvider,
  useExperience,
  type Scene,
} from "@/state/experience-state";
import { CinematicBackground } from "@/components/CinematicBackground";
import { SceneTransition } from "@/components/SceneTransition";
import { AudioControls } from "@/components/AudioControls";
import { ReplayControls } from "@/components/ReplayControls";
import { CinematicIntro } from "@/components/scenes/CinematicIntro";
import { OpeningCredits } from "@/components/scenes/OpeningCredits";
import { PersonalQuiz } from "@/components/scenes/PersonalQuiz";
import { BirthdayLetter } from "@/components/scenes/BirthdayLetter";
import { CountdownSequence } from "@/components/scenes/CountdownSequence";
import { TicketScene } from "@/components/scenes/TicketScene";
import { CelebrationScene } from "@/components/scenes/CelebrationScene";

const SCENE_LABELS: Record<Scene, string> = {
  intro: "Åbning",
  credits: "Hovedrollen",
  quiz: "Fødselsdagsprøven",
  letter: "Brevet",
  countdown: "Nedtælling",
  ticket: "Invitationen",
  celebration: "Fejring",
};

function SceneRouter() {
  const { scene, runId } = useExperience();

  return (
    <>
      <CinematicBackground scene={scene} />

      {/* Faste kontroller: lyd og genstart */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-3 px-[max(0.75rem,env(safe-area-inset-left))] pt-[max(0.75rem,env(safe-area-inset-top))]">
        <ReplayControls />
        <div className="ms-auto">
          <AudioControls />
        </div>
      </div>

      <main className="relative z-10 min-h-svh w-full">
        <p className="sr-only" aria-live="polite">
          Aktuel scene: {SCENE_LABELS[scene]}
        </p>
        <SceneTransition sceneKey={`${runId}-${scene}`}>
          {scene === "intro" ? <CinematicIntro /> : null}
          {scene === "credits" ? <OpeningCredits /> : null}
          {scene === "quiz" ? <PersonalQuiz /> : null}
          {scene === "letter" ? <BirthdayLetter /> : null}
          {scene === "countdown" ? <CountdownSequence /> : null}
          {scene === "ticket" ? <TicketScene /> : null}
          {scene === "celebration" ? <CelebrationScene /> : null}
        </SceneTransition>
      </main>
    </>
  );
}

/** Hele oplevelsen, med én central scenetilstand. */
export function BirthdayExperience() {
  return (
    <MotionConfig reducedMotion="user">
      <ExperienceProvider>
        <SceneRouter />
      </ExperienceProvider>
    </MotionConfig>
  );
}
