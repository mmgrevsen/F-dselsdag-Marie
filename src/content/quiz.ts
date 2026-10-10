/**
 * Data til den interaktive fødselsdagsprøve.
 * Alle svar er korrekte — der findes ingen forkerte valg.
 */

export interface QuizOption {
  id: "a" | "b" | "c";
  /** Vises som A. / B. / C. */
  letter: string;
  label: string;
  /** Sjov, svar-specifik tilbagemelding. */
  feedback: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: readonly QuizOption[];
}

export const quizQuestions: readonly QuizQuestion[] = [
  {
    id: "biograftur",
    question: "Hvad er det vigtigste ved en god biograftur?",
    options: [
      {
        id: "a",
        letter: "A",
        label: "En god film.",
        feedback:
          "Et fornuftigt valg. Du har tydeligvis styr på prioriteterne.",
      },
      {
        id: "b",
        letter: "B",
        label: "Popcorn.",
        feedback: "Vi har en popcorn-entusiast iblandt os.",
      },
      {
        id: "c",
        letter: "C",
        label: "At komme hjem uden at have sovet under filmen.",
        feedback: "Vi siger ikke, at det kommer til at ske ...",
      },
    ],
  },
  {
    id: "level41",
    question: "Hvad kræver det at klare level 41?",
    options: [
      {
        id: "a",
        letter: "A",
        label: "Erfaring.",
        feedback: "Det svar bliver noteret i den officielle rapport.",
      },
      {
        id: "b",
        letter: "B",
        label: "God humor.",
        feedback:
          "Godkendt. God humor er stadig det mest undervurderede superkræft.",
      },
      {
        id: "c",
        letter: "C",
        label: "En ekstra kop kaffe.",
        feedback: "Realistisk. Kaffen har reddet flere missioner end nogen tør indrømme.",
      },
    ],
  },
  {
    id: "mission",
    question: "Er hovedpersonen klar til sin næste store mission?",
    options: [
      {
        id: "a",
        letter: "A",
        label: "Selvfølgelig!",
        feedback: "Den energi er lige, hvad scenen havde brug for.",
      },
      {
        id: "b",
        letter: "B",
        label: "Vis mig planen.",
        feedback: "En mand med sans for detaljer. Planen kommer om et øjeblik.",
      },
      {
        id: "c",
        letter: "C",
        label: "Jeg skal lige have popcorn først.",
        feedback: "Noteret. Popcorn er hermed skrevet ind i kontrakten.",
      },
    ],
  },
];
