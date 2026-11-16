"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { PhaseId } from "./data";

export type CycleSettings = {
  lastPeriodStart: string; // YYYY-MM-DD
  cycleLength: number;
  periodLength: number;
};

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

export function clearCycle() {
  try {
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
