"use client";

import { useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { birthdayConfig } from "@/config/birthday";
import { useSound } from "@/components/providers/SoundProvider";
import { IntroScene } from "@/components/scenes/IntroScene";
import { MissionQuiz } from "@/components/scenes/quiz/MissionQuiz";
import { CountdownReveal } from "@/components/scenes/CountdownReveal";
import { LetterScene } from "@/components/scenes/letter/LetterScene";
import { CinemaInvitation } from "@/components/scenes/invitation/CinemaInvitation";
import { BackgroundEffects, FilmGrain, StageLighting } from "@/components/stage/BackgroundEffects";
import { CinemaScreen } from "@/components/stage/CinemaScreen";
import { Curtains } from "@/components/stage/Curtains";
import { DustParticles } from "@/components/stage/DustParticles";
import { LightStreak } from "@/components/stage/LightStreak";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { resetConfetti } from "@/lib/celebrate";
import type { CurtainState, LightMode, ScreenState, SceneId } from "@/types/experience";

/**
 * The whole experience: a persistent stage (curtains, screen, lights, dust)
 * with one scene at a time playing in front of it.
 */
export function Experience() {
  const { play } = useSound();
  const [run, setRun] = useState(0);
  const [scene, setScene] = useState<SceneId>("intro");
  const [curtain, setCurtain] = useState<CurtainState>("frame");
  const [screen, setScreen] = useState<ScreenState>("off");
  const [light, setLight] = useState<LightMode>("intro");
  const [streak, setStreak] = useState(0);

  const startMission = () => {
    setStreak((count) => count + 1);
    setLight("stage");
    setScene("quiz");
  };

  const finishMission = () => {
    play("whoosh");
    setCurtain("closed");
    setLight("dark");
    setScene("countdown");
  };

  const revealStage = () => {
    setCurtain("open");
    setScreen("lit");
    setLight("stage");
  };

  const finishLetter = () => {
    setCurtain("closed");
    setScreen("off");
    setLight("dark");
    setScene("invitation");
  };

  const openInvitationCurtains = () => {
    setCurtain("open");
    setLight("ticket");
  };

  const replay = () => {
    play("whoosh");
    resetConfetti();
    setCurtain("frame");
    setScreen("off");
    setLight("intro");
    setScene("intro");
    setRun((count) => count + 1);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="stage" data-scene={scene}>
        <BackgroundEffects />
        <CinemaScreen
          state={screen}
          caption={scene === "letter" ? birthdayConfig.letter.intro : undefined}
        />
        <Curtains state={curtain} />
        <StageLighting light={light} />
        <DustParticles boost={light === "ticket"} />
        <LightStreak trigger={streak} />

        <main className="layer-scenes">
          <AnimatePresence mode="wait">
            {scene === "intro" && <IntroScene key={`intro-${run}`} onStart={startMission} />}
            {scene === "quiz" && <MissionQuiz key={`quiz-${run}`} onComplete={finishMission} />}
            {scene === "countdown" && (
              <CountdownReveal
                key={`countdown-${run}`}
                onReveal={revealStage}
                onComplete={() => setScene("letter")}
              />
            )}
            {scene === "letter" && (
              <LetterScene
                key={`letter-${run}`}
                onEnvelopeOpened={() => setScreen("dim")}
                onComplete={finishLetter}
              />
            )}
            {scene === "invitation" && (
              <CinemaInvitation
                key={`invitation-${run}`}
                onCurtainsOpen={openInvitationCurtains}
                onReplay={replay}
              />
            )}
          </AnimatePresence>
        </main>

        <div className="top-bar">
          <SoundToggle confirmation={scene === "intro" ? "open" : "tap"} />
        </div>

        <FilmGrain />
      </div>
    </MotionConfig>
  );
}
