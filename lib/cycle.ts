"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { PhaseId } from "./data";

export type CycleSettings = {
  lastPeriodStart: string; // YYYY-MM-DD
  cycleLength: number;
  periodLength: number;
  /** true als de berekende cycli meer dan 7 dagen uit elkaar liggen */
  irregular?: boolean;
};

export type CycleEntry = { start: string; periodLength?: number };

const KEY = "juna.cycle.v1";
const EVT = "juna-cycle-change";

export function loadCycle(): CycleSettings | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CycleSettings;
    if (!parsed.lastPeriodStart) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveCycle(s: CycleSettings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
    window.dispatchEvent(new Event(EVT));
  } catch {
    /* storage niet beschikbaar */
  }
}

const HKEY = "juna.cycle.history.v1";

export function loadHistory(): CycleEntry[] {
  try {
    const raw = localStorage.getItem(HKEY);
    const v = raw ? (JSON.parse(raw) as CycleEntry[]) : [];
    return Array.isArray(v) ? v.filter((e) => e && typeof e.start === "string") : [];
  } catch {
    return [];
  }
}

export function saveHistory(entries: CycleEntry[]) {
  try {
    localStorage.setItem(HKEY, JSON.stringify(entries));
  } catch {
    /* opslag niet beschikbaar */
  }
}

const dagen = (a: string, b: string) => Math.round((new Date(a + "T00:00:00").getTime() - new Date(b + "T00:00:00").getTime()) / 86400000);

/** Controleert een lijst starts (nieuwste eerst). Geeft een melding of een lege tekst. */
export function checkStarts(startsNieuwsteEerst: string[], vandaag: string): string {
  if (startsNieuwsteEerst.some((s) => !s)) return "Vul bij elke maand een datum in, of haal de rij weg.";
  if (startsNieuwsteEerst.some((s) => s > vandaag)) return "Een datum ligt in de toekomst.";
  for (let i = 0; i < startsNieuwsteEerst.length - 1; i++) {
    const d = dagen(startsNieuwsteEerst[i], startsNieuwsteEerst[i + 1]);
    if (d === 0) return "Je hebt twee keer dezelfde datum ingevuld.";
    if (d < 15) return "Twee menstruaties liggen minder dan 15 dagen uit elkaar. Controleer de datums.";
  }
  return "";
}

/** Rekent gemiddelden uit. Gaten van meer dan 45 dagen (een overgeslagen maand) tellen niet mee. */
export function gemiddelden(startsNieuwsteEerst: string[], periodes: (number | undefined)[]) {
  const lengtes: number[] = [];
  for (let i = 0; i < startsNieuwsteEerst.length - 1; i++) {
    const d = dagen(startsNieuwsteEerst[i], startsNieuwsteEerst[i + 1]);
    if (d >= 21 && d <= 45) lengtes.push(d);
  }
  const p = periodes.filter((x): x is number => typeof x === "number" && x >= 2 && x <= 8);
  const gem = (a: number[]) => Math.round(a.reduce((x, y) => x + y, 0) / a.length);
  return {
    aantal: lengtes.length,
    cycleLength: lengtes.length ? gem(lengtes) : undefined,
    periodLength: p.length ? gem(p) : undefined,
    irregular: lengtes.length >= 2 && Math.max(...lengtes) - Math.min(...lengtes) > 7,
  };
}

export function clearCycle() {
  try {
    localStorage.removeItem(HKEY);
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(EVT));
  } catch {
    /* ignore */
  }
}

/** Phase boundaries (1-based cycle days) for a given cycle. */
export function phaseRanges(cycleLength: number, periodLength: number) {
  const ovulationDay = Math.max(periodLength + 3, cycleLength - 13);
  return {
    menstruatie: [1, periodLength] as const,
    folliculair: [periodLength + 1, ovulationDay - 2] as const,
    ovulatie: [ovulationDay - 1, ovulationDay + 1] as const,
    luteaal: [ovulationDay + 2, cycleLength] as const,
  };
}

export function phaseForDay(day: number, s: CycleSettings): PhaseId {
  const r = phaseRanges(s.cycleLength, s.periodLength);
  if (day <= r.menstruatie[1]) return "menstruatie";
  if (day <= r.folliculair[1]) return "folliculair";
  if (day <= r.ovulatie[1]) return "ovulatie";
  return "luteaal";
}

export function cycleDay(s: CycleSettings, today = new Date()) {
  const start = new Date(s.lastPeriodStart + "T00:00:00");
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = Math.floor((t.getTime() - start.getTime()) / 86400000);
  if (diff < 0) return 1;
  return (diff % s.cycleLength) + 1;
}

export function computeToday(s: CycleSettings) {
  const day = cycleDay(s);
  const phase = phaseForDay(day, s);
  const daysToPeriod = s.cycleLength - day + 1;
  return { day, phase, daysToPeriod };
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVT, cb);
  };
}

function readRaw(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

/** React hook: undefined while hydrating, null when not set. */
export function useCycle(): CycleSettings | null | undefined {
  const raw = useSyncExternalStore<string | null | undefined>(subscribe, readRaw, () => undefined);
  return useMemo(() => {
    if (raw === undefined) return undefined;
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as CycleSettings;
      return parsed.lastPeriodStart ? parsed : null;
    } catch {
      return null;
    }
  }, [raw]);
}
