import type { PhaseId } from "./data";

export type Ingredient = {
  id: string;
  naam: string;
  kleur: string;
  reden: string;
  waarschuwing?: string;
  /** soort, om te zorgen dat elke set een goede mix heeft */
  soort: "fruit" | "groente" | "kruid" | "zaad";
  /** gelijksoortige ingrediënten komen nooit samen in één set */
  groep?: string;
  rond?: boolean; // rolt weg
  klein?: boolean; // valt als kleine korrels/pitjes mee
  snede?: string; // bestandsnaam van de doorgesneden variant
};

export const ING: Record<string, Ingredient> = {
  beet: { id: "beet", naam: "Rode biet", kleur: "#8E1B3A", soort: "groente", rond: true, reden: "Levert ijzer en foliumzuur en geeft het sapje zijn diepe kleur." },
  pomegranate: { id: "pomegranate", naam: "Granaatappel", kleur: "#B0213F", soort: "fruit", rond: true, snede: "pomegranateCut", reden: "Rijk aan antioxidanten." },
  orange: { id: "orange", naam: "Sinaasappel", kleur: "#F28C28", soort: "fruit", groep: "citrus", rond: true, snede: "orangeCut", reden: "Vitamine C, die helpt om plantaardig ijzer op te nemen." },
  ginger: { id: "ginger", naam: "Gember", kleur: "#D9B25A", soort: "kruid", groep: "specerij", reden: "Verwarmend en wordt van oudsher gebruikt bij krampen en misselijkheid.", waarschuwing: "Gebruik je bloedverdunners? Vraag het eerst aan je huisarts of apotheker." },
  spinach: { id: "spinach", naam: "Spinazie", kleur: "#3F8F4E", soort: "groente", groep: "blad", reden: "Foliumzuur, ijzer en magnesium." },
  kiwi: { id: "kiwi", naam: "Kiwi", kleur: "#8DB255", soort: "fruit", rond: true, reden: "Veel vitamine C en vezels." },
  cucumber: { id: "cucumber", naam: "Komkommer", kleur: "#4E8F4A", soort: "groente", rond: true, reden: "Bestaat vooral uit water en houdt je gehydrateerd." },
  apple: { id: "apple", naam: "Appel", kleur: "#A7C957", soort: "fruit", groep: "pitvrucht", rond: true, reden: "Vezels en een milde zoetheid." },
  lime: { id: "lime", naam: "Limoen", kleur: "#5E9B2E", soort: "fruit", groep: "citrus", rond: true, snede: "limeCut", reden: "Vitamine C en een frisse smaak." },
  carrot: { id: "carrot", naam: "Wortel", kleur: "#E8731A", soort: "groente", reden: "Bètacaroteen, dat je lichaam omzet in vitamine A." },
  pineapple: { id: "pineapple", naam: "Ananas", kleur: "#F3C03B", soort: "fruit", rond: true, reden: "Vitamine C en bromelaïne, een enzym dat eiwitten helpt verteren." },
  turmeric: { id: "turmeric", naam: "Kurkuma", kleur: "#D9981E", soort: "kruid", groep: "specerij", reden: "Bevat curcumine, een antioxidant. Neem er zwarte peper bij.", waarschuwing: "Heb je galstenen of gebruik je medicijnen? Vraag eerst je huisarts." },
  pepper: { id: "pepper", naam: "Zwarte peper", kleur: "#2E1428", soort: "kruid", klein: true, reden: "Helpt je lichaam kurkuma beter op te nemen." },
  blueberry: { id: "blueberry", naam: "Blauwe bes", kleur: "#3B2A78", soort: "fruit", groep: "bes", rond: true, reden: "Antioxidanten en vezels." },
  banana: { id: "banana", naam: "Banaan", kleur: "#F3D36B", soort: "fruit", reden: "Vitamine B6 en kalium; maakt je sapje lekker vol." },
  cacao: { id: "cacao", naam: "Rauwe cacao", kleur: "#6B3A2A", soort: "kruid", rond: true, snede: "cacaoCut", reden: "Bevat magnesium en ijzer." },
  celery: { id: "celery", naam: "Selderij", kleur: "#A8CF74", soort: "groente", groep: "stengel", reden: "Bestaat vooral uit water: licht en vochtrijk." },
  fennel: { id: "fennel", naam: "Venkel", kleur: "#CFE0A6", soort: "groente", groep: "stengel", reden: "Wordt van oudsher gebruikt tegen gas en een opgeblazen gevoel (er is weinig onderzoek bij mensen)." },
  strawberry: { id: "strawberry", naam: "Aardbei", kleur: "#E23D4F", soort: "fruit", groep: "bes", rond: true, reden: "Veel vitamine C." },
  pear: { id: "pear", naam: "Peer", kleur: "#C6D65A", soort: "fruit", groep: "pitvrucht", reden: "Vezels en mild zoet; vaak zacht voor je buik." },
  avocado: { id: "avocado", naam: "Avocado", kleur: "#7FA33A", soort: "fruit", reden: "Gezonde vetten, foliumzuur en vitamine E." },
  mango: { id: "mango", naam: "Mango", kleur: "#F7B42C", soort: "fruit", groep: "tropisch", rond: true, reden: "Vitamine C en bètacaroteen." },
  cherry: { id: "cherry", naam: "Kers", kleur: "#C2183B", soort: "fruit", groep: "bes", rond: true, reden: "Antioxidanten en een frisse, zoete smaak." },
  watermelon: { id: "watermelon", naam: "Watermeloen", kleur: "#F0485A", soort: "fruit", reden: "Bestaat vooral uit water: verfrissend en vochtrijk." },
  redpepper: { id: "redpepper", naam: "Rode paprika", kleur: "#D9262C", soort: "groente", reden: "Zeer rijk aan vitamine C." },
  parsley: { id: "parsley", naam: "Peterselie", kleur: "#3F8F4E", soort: "groente", groep: "blad", reden: "Bevat ijzer en vitamine C." },
  lemon: { id: "lemon", naam: "Citroen", kleur: "#F7DC3C", soort: "fruit", groep: "citrus", rond: true, reden: "Vitamine C en een frisse zuurgraad." },
  raspberry: { id: "raspberry", naam: "Framboos", kleur: "#D81B60", soort: "fruit", groep: "bes", rond: true, reden: "Vezels, vitamine C en antioxidanten." },
  mint: { id: "mint", naam: "Munt", kleur: "#4CAF50", soort: "kruid", reden: "Verfrissend; wordt van oudsher gebruikt bij een onrustige maag." },
  kale: { id: "kale", naam: "Boerenkool", kleur: "#2F6E3B", soort: "groente", groep: "blad", reden: "Vitamine C, foliumzuur en een beetje calcium." },
  grape: { id: "grape", naam: "Groene druif", kleur: "#B9DA6A", soort: "fruit", rond: true, reden: "Natuurlijke suikers voor snelle energie." },
  papaya: { id: "papaya", naam: "Papaja", kleur: "#F28A22", soort: "fruit", groep: "tropisch", reden: "Vitamine C en papaïne, een enzym dat de spijsvertering kan helpen." },
  apricot: { id: "apricot", naam: "Abrikoos", kleur: "#F7A93A", soort: "fruit", rond: true, reden: "Bètacaroteen en vezels." },
  grapefruit: { id: "grapefruit", naam: "Grapefruit", kleur: "#F2677A", soort: "fruit", groep: "citrus", rond: true, snede: "grapefruitCut", reden: "Vitamine C.", waarschuwing: "Kan de werking van sommige medicijnen beïnvloeden. Lees je bijsluiter." },
  tomato: { id: "tomato", naam: "Tomaat", kleur: "#E03A2E", soort: "groente", rond: true, reden: "Lycopeen (een antioxidant) en vitamine C." },
  pumpkinseed: { id: "pumpkinseed", naam: "Pompoenpitten", kleur: "#7FA33A", soort: "zaad", groep: "zaad", klein: true, reden: "Bevatten zink en magnesium." },
  almond: { id: "almond", naam: "Amandel", kleur: "#A8672F", soort: "zaad", groep: "zaad", klein: true, reden: "Magnesium en vitamine E." },
  date: { id: "date", naam: "Dadel", kleur: "#6B3A22", soort: "fruit", reden: "Natuurlijk zoet, met vezels en kalium." },
  cinnamon: { id: "cinnamon", naam: "Kaneel", kleur: "#B5702F", soort: "kruid", groep: "specerij", reden: "Geeft warme zoetheid zonder extra suiker." },
  fig: { id: "fig", naam: "Vijg", kleur: "#6B3A6E", soort: "fruit", reden: "Vezels en een beetje calcium." },
};

type Pool = { ids: string[]; ankers: string[] };

export const POOLS: Record<PhaseId, Pool> = {
  menstruatie: {
    ids: ["beet", "pomegranate", "orange", "ginger", "celery", "strawberry", "cherry", "watermelon", "redpepper", "parsley", "lemon", "raspberry", "spinach"],
    ankers: ["beet", "orange"],
  },
  folliculair: {
    ids: ["spinach", "kiwi", "cucumber", "apple", "lime", "celery", "pear", "avocado", "fennel", "mint", "kale", "grape", "pineapple", "orange"],
    ankers: ["spinach", "kiwi"],
  },
  ovulatie: {
    ids: ["carrot", "pineapple", "orange", "turmeric", "pepper", "mango", "papaya", "apricot", "grapefruit", "tomato", "redpepper", "strawberry", "blueberry", "pumpkinseed"],
    ankers: ["carrot", "orange"],
  },
  luteaal: {
    ids: ["blueberry", "banana", "spinach", "cacao", "ginger", "fennel", "pear", "avocado", "almond", "date", "cinnamon", "mint", "fig", "raspberry", "papaya"],
    ankers: ["banana", "cacao"],
  },
};

/* ---------- vaste "willekeurigheid" (zelfde invoer = zelfde uitkomst) ---------- */
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function valid(set: Ingredient[], pool: Pool): boolean {
  const ids = set.map((i) => i.id);
  if (!ids.some((id) => pool.ankers.includes(id))) return false;
  if (!set.some((i) => i.soort === "fruit")) return false;
  if (!set.some((i) => i.soort === "groente")) return false;
  if (!set.some((i) => i.rond)) return false;
  if (set.filter((i) => !i.klein).length < 3) return false;
  if (ids.includes("pepper") && !ids.includes("turmeric")) return false;
  const groepen = set.map((i) => i.groep).filter(Boolean) as string[];
  if (new Set(groepen).size !== groepen.length) return false;
  return true;
}

function overlap(a: string[], b: string[]) {
  return a.filter((x) => b.includes(x)).length;
}

/** Kiest 4 ingrediënten. `vermijd` zijn eerdere sets waar de nieuwe duidelijk van moet verschillen. */
export function kiesSet(phase: PhaseId, seedText: string, vermijd: string[][] = []): string[] {
  const pool = POOLS[phase];
  let best: string[] | null = null;
  for (let t = 0; t < 400; t++) {
    const r = rng(hash(seedText + "#" + t));
    const ids = [...pool.ids];
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    const pick = ids.slice(0, 4);
    const set = pick.map((id) => ING[id]);
    if (!valid(set, pool)) continue;
    if (!best) best = pick;
    if (vermijd.every((v, k) => overlap(pick, v) <= (k === vermijd.length - 1 ? 1 : 2))) return pick;
  }
  return best ?? pool.ids.slice(0, 4);
}

export function weekId(d = new Date()) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((t.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${week}`;
}

function vorigeWeek(d = new Date()) {
  const p = new Date(d);
  p.setDate(p.getDate() - 7);
  return weekId(p);
}

/** De vaste set van deze week: elke week anders, binnen de week hetzelfde. */
export function weekSet(phase: PhaseId, d = new Date()): string[] {
  const vorige = kiesSet(phase, `${vorigeWeek(d)}:${phase}`);
  return kiesSet(phase, `${weekId(d)}:${phase}`, [vorige]);
}

/** Een nieuwe set na een tik op "Schud opnieuw". */
export function schudSet(phase: PhaseId, eerder: string[][]): string[] {
  return kiesSet(phase, `${Math.random()}:${Date.now()}:${phase}`, eerder.slice(-3));
}
