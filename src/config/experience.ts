/**
 * Central personalisering for "FAR 41 — THE BIRTHDAY MOVIE".
 *
 * Alt indhold, som kan ændres uden at røre komponenterne, bor her.
 * Felter, der står tomme (""), vises IKKE i brugerfladen — de skjules helt,
 * så der aldrig optræder tomme labels, bindestreger eller opdigtede detaljer.
 */

export interface EventDetails {
  /** Filmens titel. Tom indtil filmen er valgt. */
  filmTitle: string;
  /** Biografens navn. Tom indtil biografen er valgt. */
  cinema: string;
  /** Dato, fri tekst, fx "fredag d. 14. november". Tom indtil den er valgt. */
  date: string;
  /** Klokkeslæt, fri tekst, fx "19.30". Tom indtil det er valgt. */
  time: string;
}

export interface LetterContent {
  heading: string;
  greeting: string;
  paragraphs: readonly string[];
  closing: string;
  signature: string;
}

export interface ExperienceConfig {
  /** Hvem oplevelsen er til — bruges i titler og tekst. */
  recipient: string;
  /** Fødselsdagsalderen. */
  age: number;
  /** Afsenderen. */
  sonName: string;

  meta: {
    title: string;
    description: string;
  };

  opening: {
    presentation: string;
    lines: readonly string[];
    title: string;
    subtitle: string;
    tagline: string;
    cta: string;
  };

  credits: {
    beats: readonly string[];
    starring: string;
    disclaimer: string;
    cta: string;
  };

  quiz: {
    eyebrow: string;
    passed: string;
    passedSub: string;
    cta: string;
  };

  personal: {
    beats: readonly string[];
    envelopeHint: string;
    envelopeCta: string;
    revealQuestion: string;
    revealCta: string;
  };

  letter: LetterContent;

  countdown: {
    lead: string;
    from: number;
    reveal: readonly string[];
    finale: string;
  };

  invitation: {
    brand: string;
    kicker: string;
    headline: string;
    subline: string;
    body: string;
    from: string;
    validity: string;
    detailsHeading: string;
    acceptCta: string;
  };

  celebration: {
    shout: string;
    lines: readonly string[];
    signature: string;
    backToTicketCta: string;
    replayCta: string;
  };

  event: EventDetails;

  audio: {
    /** Lyd er altid slået fra, indtil brugeren selv slår den til. */
    enabledByDefault: boolean;
    toggleLabelOn: string;
    toggleLabelOff: string;
  };
}

export const experience: ExperienceConfig = {
  recipient: "Far",
  age: 41,
  sonName: "Marcus",

  meta: {
    title: "FAR 41 — THE BIRTHDAY MOVIE",
    description:
      "En helt særlig premiere: en interaktiv fødselsdagstrailer og en invitation til en biograftur.",
  },

  opening: {
    presentation: "EN SÆRLIG FILMPRÆSENTATION",
    lines: ["ÉN MAND.", "41 ÅR.", "ÉN MISSION."],
    title: "FAR 41",
    subtitle: "THE BIRTHDAY MOVIE",
    tagline: "En helt særlig premiere venter ...",
    cta: "AFSPIL TRAILEREN",
  },

  credits: {
    beats: [
      "PRÆSENTERER",
      "EN MAND, DER HAR SET DET HELE.",
      "41 ÅR PÅ BANEN.",
      "UTALLIGE MISSIONER GENNEMFØRT.",
      "OG STADIG KLAR TIL ÉN FILM MERE.",
    ],
    starring: "MED FAR I HOVEDROLLEN.",
    disclaimer:
      "Alle stunts udføres på eget ansvar. Eventuel snorken i biografen er ikke inkluderet.",
    cta: "FORTSÆT FILMEN",
  },

  quiz: {
    eyebrow: "DEN INTERAKTIVE FØDSELSDAGSPRØVE",
    passed: "TESTEN ER BESTÅET.",
    passedSub: "Du er officielt klar til næste scene.",
    cta: "NÆSTE SCENE",
  },

  personal: {
    beats: [
      "EN GOD FILM ER ALTID BEDRE MED GODT SELSKAB.",
      "Denne gang handler det ikke kun om filmen.",
      "Det handler om at få en hyggelig oplevelse sammen.",
    ],
    envelopeHint: "Der ligger et brev til dig.",
    envelopeCta: "ÅBN BREVET",
    revealQuestion: "KLAR TIL DEN STORE AFSLØRING?",
    revealCta: "VIS MIG GAVEN",
  },

  letter: {
    heading: "Et brev til far",
    greeting: "Kære far",
    paragraphs: [
      "Stort tillykke med de 41 år!",
      "Jeg tænkte, at du i år skulle have noget lidt andet end en helt almindelig fødselsdagsgave. Derfor vil jeg gerne invitere dig med i biografen, hvor vi kan se en fed film, spise popcorn og bare hygge os sammen.",
      "Du er nu nået til level 41, så du har efterhånden samlet en del erfaring. Om det betyder, at du er blevet klogere, må vi jo se på.",
      "Spøg til side, så glæder jeg mig til at tage afsted med dig og få en hyggelig oplevelse sammen.",
      "Tillykke med fødselsdagen, far!",
    ],
    closing: "Hilsen",
    signature: "Marcus",
  },

  countdown: {
    lead: "DENNE GANG ER DET IKKE BARE EN FILM ...",
    from: 5,
    reveal: ["DEN NÆSTE OPLEVELSE ...", "ER MED DIN SØN."],
    finale: "DU ER INVITERET!",
  },

  invitation: {
    brand: "FAR 41",
    kicker: "EKSKLUSIV FØDSELSDAGSINVITATION",
    headline: "DU ER INVITERET!",
    subline: "EN BIOGRAFTUR MED DIN SØN",
    body: "Vi skal se en fed film, spise popcorn og hygge os sammen.",
    from: "En fødselsdagsgave fra Marcus.",
    validity: "GYLDIG TIL EN HYGGELIG OPLEVELSE",
    detailsHeading: "PRAKTISK",
    acceptCta: "ACCEPTER INVITATIONEN",
  },

  celebration: {
    shout: "JAAAA!",
    lines: [
      "Så er det en aftale!",
      "Jeg glæder mig til en mega hyggelig biograftur med dig, far.",
      "Stort tillykke med fødselsdagen!",
    ],
    signature: "Hilsen Marcus",
    backToTicketCta: "SE BILLETTEN IGEN",
    replayCta: "SE FILMEN FORFRA",
  },

  event: {
    filmTitle: "",
    cinema: "",
    date: "",
    time: "",
  },

  audio: {
    enabledByDefault: false,
    toggleLabelOn: "Slå lyd fra",
    toggleLabelOff: "Slå lyd til",
  },
};

export interface ResolvedDetail {
  key: keyof EventDetails;
  label: string;
  value: string;
}

const DETAIL_LABELS: Record<keyof EventDetails, string> = {
  filmTitle: "FILM",
  cinema: "BIOGRAF",
  date: "DATO",
  time: "TID",
};

/** Returnerer kun de valgfrie detaljer, der faktisk er udfyldt. */
export function resolvedDetails(event: EventDetails): ResolvedDetail[] {
  return (Object.keys(DETAIL_LABELS) as (keyof EventDetails)[])
    .map((key) => ({ key, label: DETAIL_LABELS[key], value: event[key].trim() }))
    .filter((detail) => detail.value.length > 0);
}
