import type { EventDetails } from "@/types/experience";

/**
 * Personalisation for the whole experience.
 *
 * Change the values in this section, and the texts further down follow along.
 * Leave event details as empty strings until they are known – the ticket only
 * shows the fields that have been filled in.
 */
const recipientName = "Marie";
const age = 11;
/** How the sender refers to himself, e.g. "storebror". */
const siblingTitle = "storebror";

const eventDetails: EventDetails = {
  /** e.g. "Inside Out 3" */
  movieTitle: "",
  /** e.g. "Biografen i Rødovre Centrum" */
  cinemaName: "",
  /** e.g. "Lørdag d. 14. november" */
  date: "",
  /** e.g. "Kl. 15.30" */
  time: "",
};

/** Sound is always muted until Marie turns it on herself. */
const soundEnabledByDefault = false;

const upper = (text: string) => text.toLocaleUpperCase("da-DK");

export const birthdayConfig = {
  recipientName,
  age,
  siblingTitle,
  soundEnabledByDefault,
  eventDetails,

  meta: {
    title: `En hemmelig besked til ${recipientName}`,
    description: "Der er kommet en hemmelig besked til dig ...",
  },

  intro: {
    eyebrow: "Strengt fortroligt",
    lines: [
      "Der er kommet en hemmelig besked til dig ...",
      `Den er kun til dig, ${recipientName}.`,
      "Men før du finder ud af, hvad det handler om, skal du gennemføre en lille mission.",
    ],
    startButton: "START MISSIONEN",
    soundHint: "Tip: Slå lyden til oppe i hjørnet",
  },

  countdown: {
    lines: [
      "Du har klaret alle udfordringerne ...",
      "Er du klar til at finde ud af, hvad du har vundet?",
    ],
  },

  letter: {
    intro: "Der er faktisk også noget andet, jeg gerne vil fortælle dig ...",
    envelopeHint: "Tryk på kuverten for at åbne den",
    greeting: `Kære ${recipientName} ❤️`,
    paragraphs: [
      `Stort tillykke med dine ${age} år!`,
      `Nu er du allerede blevet ${age} år, og jeg håber virkelig, at du får en mega god fødselsdag med masser af hygge, grin og gode gaver.`,
      "Selvom vi godt kan komme til at skændes en gang imellem, er jeg stadig glad for at have dig som lillesøster. Vi er selvfølgelig ikke altid enige om alting, men sådan er det jo at være søskende.",
      "Jeg vil gerne invitere dig med i biografen, hvor vi skal se en fed film, spise popcorn og bare hygge os sammen. Det er min fødselsdagsgave til dig, og jeg håber, du bliver glad for den!",
      `Endnu en gang stort tillykke med fødselsdagen, ${recipientName}!`,
    ],
    signature: `Hilsen din ${siblingTitle} ❤️`,
    continueButton: "SE DIN OVERRASKELSE",
  },

  invitation: {
    eyebrow: "EKSKLUSIV FØDSELSDAGSINVITATION",
    recipient: `TIL: ${upper(recipientName)}`,
    headline: "DU ER INVITERET!",
    subheadline: `EN TUR I BIOGRAFEN MED DIN ${upper(siblingTitle)}`,
    description: "Vi skal se en fed film, spise popcorn og hygge os sammen.",
    gift: `Din fødselsdagsgave fra din ${siblingTitle} ❤️`,
    acceptedStamp: "ACCEPTERET",
    acceptButton: "ACCEPTER MIN INVITATION",
    acceptedStatus: "Invitationen er accepteret",
    viewTicketAgain: "SE BILLETTEN IGEN",
    replay: "Start forfra",
    detailLabels: {
      movieTitle: "Film",
      cinemaName: "Biograf",
      date: "Dato",
      time: "Tid",
    } satisfies Record<keyof EventDetails, string>,
  },

  finalMessage: {
    exclamation: "JAAAA! 🎉",
    lines: [
      "Så er det en aftale!",
      `Jeg glæder mig til en mega hyggelig biograftur med dig, ${recipientName}!`,
    ],
    signature: `Hilsen din ${siblingTitle} ❤️`,
  },
} as const;

export type BirthdayConfig = typeof birthdayConfig;
