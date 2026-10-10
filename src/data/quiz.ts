import { birthdayConfig } from "@/config/birthday";
import type { QuizQuestion } from "@/types/experience";

const { siblingTitle } = birthdayConfig;

export const missionQuestions: readonly QuizQuestion[] = [
  {
    id: "plan",
    prompt: `Hvad tror du, din ${siblingTitle} har planlagt?`,
    answers: [
      {
        id: "A",
        label: "En tur i supermarkedet.",
        correct: false,
        feedback: "HAHA, godt gæt! Men du må prøve igen.",
      },
      { id: "B", label: "En hemmelig overraskelse.", correct: true },
      {
        id: "C",
        label: "At jeg skal lave hans lektier.",
        correct: false,
        feedback: "HAHA, nej da! Dem klarer han selv. Prøv igen.",
      },
    ],
    successMessage: "Du er på rette spor ...",
  },
  {
    id: "snack",
    prompt: "Hvad hører selvfølgelig til en hyggelig filmaften?",
    answers: [
      { id: "A", label: "Popcorn!", correct: true },
      {
        id: "B",
        label: "En skål med broccoli.",
        correct: false,
        feedback: "Broccoli? Seriøst? Prøv lige igen ...",
      },
      {
        id: "C",
        label: "At lave matematik.",
        correct: false,
        feedback: "Matematik til en filmaften? Nej tak! Prøv igen.",
      },
    ],
    successMessage: "Præcis! Du begynder at regne det ud.",
  },
  {
    id: "together",
    prompt: "Hvad tror du, vi skal lave sammen?",
    answers: [
      {
        id: "A",
        label: "Rydde op på mit værelse.",
        correct: false,
        feedback: "Haha, nej! Dit værelse må vente lidt endnu. Prøv igen.",
      },
      { id: "B", label: "Se en film.", correct: true },
      {
        id: "C",
        label: "Lave lektier hele dagen.",
        correct: false,
        feedback: "Hele dagen? Det ville være lidt af en straf. Prøv igen!",
      },
    ],
    successMessage: "Okay, du er faktisk ret god til den her mission ...",
  },
  {
    id: "adventure",
    prompt: "Hvem er den bedste person at tage på eventyr med?",
    answers: [
      { id: "A", label: `Min ${siblingTitle}.`, correct: true },
      {
        id: "B",
        label: "En tilfældig pingvin.",
        correct: false,
        feedback: "Pingviner er søde, men de er elendige til at dele popcorn. Prøv igen!",
      },
      {
        id: "C",
        label: "En robot fra Mars.",
        correct: false,
        feedback: "En robot fra Mars? Den bor alt for langt væk. Prøv igen!",
      },
    ],
    successMessage: "Godt svar! Det var næsten, som om du kendte mig.",
  },
  {
    id: "ready",
    prompt: "Er du klar til at finde ud af, hvad din fødselsdagsgave er?",
    answers: [
      { id: "A", label: "JA!", correct: true },
      { id: "B", label: "JEG VIL VIDE DET NU!", correct: true },
      { id: "C", label: "MÅSKE ... MEN JEG ER NYSGERRIG!", correct: true },
    ],
    successMessage: "MISSIONEN ER GENNEMFØRT!",
    finale: true,
  },
];
