# FAR 41 — THE BIRTHDAY MOVIE

En interaktiv, filmisk fødselsdagsoplevelse: en trailer, hvor far er hovedpersonen,
en lille fødselsdagsprøve, et personligt brev og til sidst afsløringen af gaven —
en biograftur med Marcus.

Siden kører helt uden database, login, formularer, sporing eller eksterne API'er.

## Kom i gang

```bash
npm install
npm run dev      # udvikling på http://localhost:3000
npm run build    # produktionsbuild
npm start        # kør produktionsbuildet
npm run lint     # ESLint
npx tsc --noEmit # typecheck
```

## Scenerne

| # | Scene | Komponent |
|---|-------|-----------|
| 1 | Den cinematiske åbning | `src/components/scenes/CinematicIntro.tsx` |
| 2 | Hovedpersonen præsenteres | `src/components/scenes/OpeningCredits.tsx` |
| 3 | Den interaktive fødselsdagsprøve | `src/components/scenes/PersonalQuiz.tsx` |
| 4 | Det personlige brev | `src/components/scenes/BirthdayLetter.tsx` |
| 5 | Nedtælling og afsløring | `src/components/scenes/CountdownSequence.tsx` |
| 6+7 | Billetten og "accepter invitationen" | `src/components/scenes/TicketScene.tsx` |
| 7 | Fejringen | `src/components/scenes/CelebrationScene.tsx` |

Scenerne styres ét sted fra, i `src/state/experience-state.tsx`. Hver scene
monteres først, når den er aktiv, så genstart altid giver en ren tilstand.

## Sådan tilpasser du indholdet

Alt tekst og alle detaljer ligger i **`src/config/experience.ts`**.
Spørgsmål og svar i prøven ligger i `src/content/quiz.ts`.

Felterne for filmen er med vilje tomme, indtil I har valgt:

```ts
event: {
  filmTitle: "",   // fx "Dune: Part Three"
  cinema: "",      // fx "Nordisk Film Biografer"
  date: "",        // fx "fredag d. 14. november"
  time: "",        // fx "19.30"
}
```

Tomme felter vises **ikke** på billetten — hverken som tomme labels eller
bindestreger. Så snart et felt udfyldes, dukker det op i et elegant
informationsfelt nederst på billetten.

## Lyd

Lyden er slået fra som udgangspunkt og starter aldrig af sig selv. Først når
man trykker på lydknappen i hjørnet, oprettes en `AudioContext`. Alle effekter
(projektor, overgange, nedtælling, fejring) syntetiseres lokalt i
`src/lib/sound.ts`, så der ikke indlæses eksterne lydfiler. Oplevelsen fungerer
fuldstændigt uden lyd.

## Tilgængelighed og bevægelse

- Semantisk HTML, tastaturnavigation og tydelige fokusmarkeringer.
- Alle scener kan springes over — intet er låst bag lange animationer.
- `prefers-reduced-motion` respekteres: kraftige effekter erstattes af rolige
  overtoninger, støvpartikler og løbende animationer slås fra.
- Layoutet er testet ved 360, 390, 430 px samt tablet- og desktopbredde.

## Teknik

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Framer Motion ·
lucide-react · canvas-confetti (hentes først ved fejringen).

Fontene (Cinzel, Inter, EB Garamond) ligger lokalt i `src/app/fonts/` under
SIL Open Font License og indlæses via `next/font/local` med fallbacks.
