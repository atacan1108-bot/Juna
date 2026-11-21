import { ING, weekId } from "./ingredients";

export type ExtraDoel = "huid" | "haar";

export type Topping = { id: string; reden: string };
export type Shotje = { naam: string; ids: string[]; hoeveel: string; reden: string };

/* Toevoegingen voor je sapje van de fase. De reden zegt alleen wat erin zit, nooit wat het doet. */
export const TOPPINGS: Record<ExtraDoel, Topping[]> = {
  huid: [
    { id: "avocado", reden: "Bevat vitamine E en gezonde vetten. Maakt je sapje ook romiger." },
    { id: "kiwi", reden: "Bevat veel vitamine C." },
    { id: "carrot", reden: "Bevat bètacaroteen, dat je lichaam omzet in vitamine A." },
    { id: "cucumber", reden: "Bestaat vooral uit water. Fijn fris." },
    { id: "orange", reden: "Bevat vitamine C." },
  ],
  haar: [
    { id: "pumpkinseed", reden: "Bevat zink. Strooi ze over je glas." },
    { id: "almond", reden: "Bevat eiwit, vitamine E en een beetje biotine." },
    { id: "spinach", reden: "Bevat ijzer. Je proeft het bijna niet." },
    { id: "kale", reden: "Bevat ijzer en vitamine C." },
  ],
};

/* Shotjes van ongeveer 60 ml. */
export const SHOTJES: Record<ExtraDoel, Shotje[]> = {
  huid: [
    { naam: "Oranje huidshotje", ids: ["carrot", "orange", "lemon"], hoeveel: "1 wortel, ½ sinaasappel, een schijfje citroen", reden: "Bètacaroteen en vitamine C." },
    { naam: "Frisse huidshotje", ids: ["cucumber", "kiwi", "lime"], hoeveel: "¼ komkommer, 1 kiwi, een schijfje limoen", reden: "Veel water en vitamine C." },
    { naam: "Roze huidshotje", ids: ["watermelon", "strawberry", "lime"], hoeveel: "een stuk watermeloen, 3 aardbeien, een schijfje limoen", reden: "Veel water en vitamine C." },
  ],
  haar: [
    { naam: "Groen haarshotje", ids: ["spinach", "apple", "lemon"], hoeveel: "een handje spinazie, ½ appel, een schijfje citroen", reden: "IJzer, met vitamine C erbij." },
    { naam: "Rood haarshotje", ids: ["raspberry", "carrot", "orange"], hoeveel: "een handje frambozen, 1 wortel, ½ sinaasappel", reden: "Vitamine C en bètacaroteen." },
    { naam: "Bietenshotje", ids: ["beet", "apple", "lemon"], hoeveel: "¼ rode biet, ½ appel, een schijfje citroen", reden: "IJzer en foliumzuur, met vitamine C erbij." },
  ],
};

export const SHOT_BEREIDING = "Pers de ingrediënten in je slow juicer, of mix ze met een scheut water en zeef ze. Je krijgt ongeveer 60 ml.";

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/* Elke week een andere keuze, en nooit iets uit je allergie- of niet-lekker-lijst. */
export function kiesExtra(doel: ExtraDoel, uitgesloten: string[], d = new Date()) {
  const ok = (ids: string[]) => ids.every((id) => ING[id] && !uitgesloten.includes(id));
  const zaad = hash(`${weekId(d)}:${doel}`);
  const toppings = TOPPINGS[doel].filter((t) => ok([t.id]));
  const shots = SHOTJES[doel].filter((s) => ok(s.ids));
  const kies = <T,>(lijst: T[], n: number): T[] => {
    const uit: T[] = [];
    for (let i = 0; i < lijst.length && uit.length < n; i++) uit.push(lijst[(zaad + i) % lijst.length]);
    return uit;
  };
  return { toppings: kies(toppings, 2), shot: kies(shots, 1)[0] ?? null };
}
