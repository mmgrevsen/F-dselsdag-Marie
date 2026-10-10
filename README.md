# Maries fødselsdag 🎬

En interaktiv, filmisk fødselsdagsoplevelse til Marie, der fylder 11 år.
Hun gennemfører en lille hemmelig mission, ser en nedtælling, åbner et personligt
brev og får til sidst afsløret sin fødselsdagsgave: en tur i biografen.

Hele oplevelsen er på dansk og bygget mobile-first.

## Kom i gang

```bash
npm install
npm run dev
```

Åbn http://localhost:3000.

Andre kommandoer:

```bash
npm run build     # produktionsbuild
npm start         # kør produktionsbuildet
npm run lint      # ESLint
npx tsc --noEmit  # typecheck
```

## Tilpasning

Alt det personlige står ét sted: [`src/config/birthday.ts`](src/config/birthday.ts).

Her kan du ændre navn, alder, søskendetitel og alle tekster. Når detaljerne om
biografturen falder på plads, udfyldes de i `eventDetails`:

```ts
const eventDetails: EventDetails = {
  movieTitle: "",   // fx "Film XYZ"
  cinemaName: "",   // fx "Biografen i byen"
  date: "",         // fx "Lørdag d. 14. november"
  time: "",         // fx "Kl. 15.30"
};
```

Felter, der er tomme, vises ikke – billetten ser færdig ud, også før du udfylder
noget. Spørgsmålene i missionen ligger i [`src/data/quiz.ts`](src/data/quiz.ts).

## Oplevelsens fem scener

| Scene | Komponent | Hvad sker der |
| --- | --- | --- |
| 1. Intro | `scenes/IntroScene` | Mørk sal, spotlight tænder, teksten afsløres, "START MISSIONEN" |
| 2. Mission | `scenes/quiz/MissionQuiz` | Fem spørgsmål med drilske svar; forkerte svar må prøves igen |
| 3. Nedtælling | `scenes/CountdownReveal` | 5-4-3-2-1 på en filmskive, blackout, gyldent glimt, tæppet går op |
| 4. Brevet | `scenes/letter/LetterScene` | Kuverten åbnes, og brevet foldes ud på cremefarvet papir |
| 5. Invitationen | `scenes/invitation/CinemaInvitation` | Biografbilletten stiger op, konfetti, og invitationen accepteres |

`components/Experience.tsx` styrer rækkefølgen og den fælles scene (tæppe,
lærred, lys, støv), så overgangene hænger sammen på tværs af scenerne.

## Teknik

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** – designtokens og scenelag i `src/app/globals.css`
- **Framer Motion** – sceneskift, tekstafsløringer, kuvert, billet
- **Lucide React** – ikoner
- **Canvas Confetti** – fejringerne

### Lyd

Lyden er **slået fra som udgangspunkt** og starter aldrig af sig selv. Alle lyde
bliver genereret i koden med Web Audio API ([`src/lib/sound/engine.ts`](src/lib/sound/engine.ts)),
så siden ikke afhænger af lydfiler, der kan forsvinde. Vil du tilføje en lyd,
skriver du et nyt navn i `SoundName` og en opskrift i `recipes`.

Valget af lyd til/fra gemmes i `localStorage`, hvis browseren tillader det –
ellers fungerer siden helt som normalt.

### Tilgængelighed

Alt kan betjenes med tastatur (svar kan også vælges med A/B/C eller 1/2/3),
fokus flytter med til hver ny scene, og `prefers-reduced-motion` respekteres.
Der indsamles ingen personlige oplysninger.

## Deploy

Statisk Next.js-app uden server-afhængigheder – kan hostes direkte på fx Vercel.
Siden er sat til `noindex`, så invitationen ikke dukker op i søgeresultater.
