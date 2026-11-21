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
    { id: "redpepper", reden: "Bevat veel vitamine C." },
    { id: "mango", reden: "Bevat vitamine C en bètacaroteen." },
    { id: "strawberry", reden: "Bevat veel vitamine C." },
    { id: "apricot", reden: "Bevat bètacaroteen en vezels." },
    { id: "tomato", reden: "Bevat lycopeen, een antioxidant, en vitamine C." },
  ],
  haar: [
    { id: "pumpkinseed", reden: "Bevat zink. Strooi ze over je glas." },
    { id: "almond", reden: "Bevat eiwit, vitamine E en een beetje biotine." },
    { id: "spinach", reden: "Bevat ijzer. Je proeft het bijna niet." },
    { id: "kale", reden: "Bevat ijzer en vitamine C." },
    { id: "beet", reden: "Bevat ijzer en foliumzuur. Geeft je sapje een mooie kleur." },
    { id: "parsley", reden: "Bevat ijzer en vitamine C." },
    { id: "cacao", reden: "Bevat magnesium en ijzer. Lekker bij een zoet sapje." },
  ],
};

/* Shotjes van ongeveer 60 ml. */
export const SHOTJES: Record<ExtraDoel, Shotje[]> = {
  huid: [
    { naam: "Oranje huidshotje", ids: ["carrot", "orange", "lemon"], hoeveel: "1 wortel, ½ sinaasappel, een schijfje citroen", reden: "Bètacaroteen en vitamine C." },
    { naam: "Frisse huidshotje", ids: ["cucumber", "kiwi", "lime"], hoeveel: "¼ komkommer, 1 kiwi, een schijfje limoen", reden: "Veel water en vitamine C." },
    { naam: "Roze huidshotje", ids: ["watermelon", "strawberry", "lime"], hoeveel: "een stuk watermeloen, 3 aardbeien, een schijfje limoen", reden: "Veel water en vitamine C." },
    { naam: "Gele huidshotje", ids: ["mango", "orange", "lemon"], hoeveel: "een stuk mango, 1 sinaasappel, een schijfje citroen", reden: "Vitamine C en bètacaroteen." },
    { naam: "Paprikashotje", ids: ["redpepper", "carrot", "orange"], hoeveel: "½ rode paprika, 1 wortel, ½ sinaasappel", reden: "Veel vitamine C en bètacaroteen." },
    { naam: "Groene huidshotje", ids: ["cucumber", "apple", "mint"], hoeveel: "¼ komkommer, ½ appel, 5 blaadjes munt", reden: "Veel water en een frisse smaak." },
  ],
  haar: [
    { naam: "Groen haarshotje", ids: ["spinach", "apple", "lemon"], hoeveel: "een handje spinazie, ½ appel, een schijfje citroen", reden: "IJzer, met vitamine C erbij." },
    { naam: "Rood haarshotje", ids: ["raspberry", "carrot", "orange"], hoeveel: "een handje frambozen, 1 wortel, ½ sinaasappel", reden: "Vitamine C en bètacaroteen." },
    { naam: "Bietenshotje", ids: ["beet", "apple", "lemon"], hoeveel: "¼ rode biet, ½ appel, een schijfje citroen", reden: "IJzer en foliumzuur, met vitamine C erbij." },
    { naam: "Peterselieshotje", ids: ["parsley", "apple", "lemon"], hoeveel: "een klein bosje peterselie, ½ appel, een schijfje citroen", reden: "IJzer en vitamine C." },
    { naam: "Boerenkoolshotje", ids: ["kale", "pear", "lemon"], hoeveel: "een handje boerenkool, ½ peer, een schijfje citroen", reden: "IJzer en vitamine C." },
    { naam: "Oranje bietenshotje", ids: ["beet", "carrot", "orange"], hoeveel: "¼ rode biet, 1 wortel, ½ sinaasappel", reden: "IJzer en foliumzuur, met vitamine C erbij." },
  ],
};

export const UITLEG: Record<ExtraDoel, string> = {
  huid: "Je huid bouwt mee met wat je eet. Vitamine A en C vind je in kleurrijk fruit en groente.",
  haar: "Haar bestaat uit eiwit. Pitten en noten leveren eiwit en zink, groene bladgroente levert ijzer.",
};

export const MEEDENK: Record<ExtraDoel, string> = {
  huid: "Juna denkt mee bij je sapje en geeft je een tip om erbij te doen.",
  haar: "Juna kijkt mee naar je sapje en zegt wat er lekker bij past.",
};

export const MEEDENKEN = "Juna denkt mee bij je sapje en geeft je tips om erbij te doen.";

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
  return { toppings: kies(toppings, 3), shots: kies(shots, 2) };
}
