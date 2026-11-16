# Juna – sapjes op het ritme van je cyclus

Testversie van Juna: een website (desktop) en een mobiele web-app (PWA) die vrouwen per cyclusfase een sapje of smoothie adviseert, met uitleg waarom, plus glow- en haarroutines.

## Pagina's

| Route | Wat |
| --- | --- |
| `/` | Landingspagina (desktop + mobiel) |
| `/app/welkom` | Onboarding |
| `/app/koppelen` | Cyclus instellen (zelf invullen; Flo / Apple Health / Health Connect volgt) |
| `/app` | Vandaag: cyclusdag, fase, sap van de week, glow- en haartip |
| `/app/fases` | De 4 fases, klikbaar |
| `/app/glow` | Glow & haargroei |
| `/app/recept/[slug]` | Recept met ingrediënten, bereiding (afvinken) en favoriet |

Op een telefoon: open `/app` en kies **Deel › Zet op beginscherm** (iPhone) of **Installeer app** (Android).

## Techniek

- Next.js 16 (App Router), TypeScript, geen database
- Cyclusgegevens en favorieten staan alleen in `localStorage` op het toestel
- Content (fases + recepten) staat in `lib/data.ts`, cycluslogica in `lib/cycle.ts`

## Lokaal draaien

```bash
npm install
npm run dev
```

## Deploy

Importeer deze repository in Vercel (Framework: Next.js, geen extra instellingen nodig).

## Volgende stappen

- Koppeling met Flo via Google Health Connect (Android) / Apple HealthKit (iOS) – vereist een native app (bijv. Expo/React Native)
- Accounts en sync, Juna Plus-abonnement
- Gezondheidsteksten laten controleren door een diëtist

> Juna geeft voedingsinspiratie en is geen medisch advies.
