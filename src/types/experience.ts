/** The five scenes of the experience, in the order Marie moves through them. */
export type SceneId = "intro" | "quiz" | "countdown" | "letter" | "invitation";

/** How far the velvet curtains are drawn. */
export type CurtainState = "frame" | "closed" | "open";

/** The cream-coloured cinema screen that lights up behind the curtains. */
export type ScreenState = "off" | "lit" | "dim";

/** Overall lighting mood of the stage. */
export type LightMode = "intro" | "stage" | "dark" | "ticket";

export type AnswerId = "A" | "B" | "C";

export interface QuizAnswer {
  id: AnswerId;
  label: string;
  correct: boolean;
  /** Playful reply shown when a wrong answer is picked. */
  feedback?: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  answers: readonly [QuizAnswer, QuizAnswer, QuizAnswer];
  /** Message shown when the question is solved. */
  successMessage: string;
  /** The last question ends the mission with a bigger celebration. */
  finale?: boolean;
}

export interface EventDetails {
  movieTitle: string;
  cinemaName: string;
  date: string;
  time: string;
}
