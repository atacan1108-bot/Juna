"use client";

import { useEffect, useState } from "react";
import type { Phase, PhaseId } from "@/lib/data";

import { ING, schudSet, weekId, weekSet, type Ingredient } from "@/lib/ingredients";

const OFFSET = 90; // de lege ruimte boven de stapel halen we weg
const W = 390; // breedte van het ontwerp in px; alles hieronder schaalt mee via cqw
const cq = (px: number) => `${((px / W) * 100).toFixed(3)}cqw`;
const frac = (x: number) => x - Math.floor(x);

type Piece = { left: number; top: number; size: number; rot: number; delay: number; dur: number; src: string };

function build(ings: Ingredient[]) {
  const stack = ings.filter((i) => !i.klein);
  const smalls = ings.filter((i) => i.klein);
  const rowCounts = [5, 4, 3];
  const rowSizes = [66, 64, 62];
  const items: Piece[] = [];
  const shadows: { left: number; w: number; delay: number }[] = [];
  let s = 0;
  for (let r = 0; r < rowCounts.length; r++) {
    const count = rowCounts[r];
    const size = rowSizes[r];
    const top = Math.round(440 - size * 0.92 - r * 46);
    for (let j = 0; j < count; j++) {
      const ing = stack[(j + r * 2) % stack.length];
      const left = Math.round(195 + (j - (count - 1) / 2) * 56 - size / 2);
      const delay = 0.1 + r * 0.5 + j * 0.12 + frac(s * 0.31) * 0.08;
      const file = ing.snede && (j + r) % 2 === 1 ? ing.snede : ing.id;
      items.push({ left, top, size, rot: ((s * 37) % 13) - 6, delay, dur: 1.5, src: `/fruit/${file}.svg` });
      if (r === 0) shadows.push({ left: left + 4, w: size - 8, delay });
      s++;
    }
  }
  const round = stack.filter((i) => i.rond);
  const kL = round[0] ?? stack[0];
  const kR = round[1] ?? round[0] ?? stack[0];
  const mk = (id: string, left: number, size: number, delay: number, dur: number): Piece => ({
    left, top: Math.round(440 - size * 0.92), size, rot: 0, delay, dur, src: `/fruit/${id}.svg`,
  });
  const left = [mk(kL.id, 6, 44, 1.0, 2.6)];
  const right = [mk(kR.id, 340, 44, 1.25, 2.6)];
  if (smalls.length) {
    const sm = (n: number) => smalls[n % smalls.length].id;
    left.push(mk(sm(0), 14, 16, 1.7, 2.2), mk(sm(1), 26, 16, 1.85, 2.2));
    right.push(mk(sm(0), 356, 16, 1.95, 2.2));
  }
  return { items, shadows, left, right };
}

const KEY = "juna.fruit.week";
const SET_KEY = "juna.fruit.set.v1";

type Saved = { week: string; phase: PhaseId; sets: string[][] };

function reduced() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function shouldPlay(phase: PhaseId): boolean {
  try {
    if (reduced()) return false;
    return localStorage.getItem(KEY) !== `${weekId()}:${phase}`;
  } catch {
    return true;
  }
}

function loadSets(phase: PhaseId): string[][] {
  try {
    const raw = localStorage.getItem(SET_KEY);
    if (raw) {
      const v = JSON.parse(raw) as Saved;
      const geldig = Array.isArray(v.sets) && v.sets.length > 0 && v.sets.every((st) => Array.isArray(st) && st.length === 4 && st.every((id) => ING[id]));
      if (v.week === weekId() && v.phase === phase && geldig) return v.sets;
    }
  } catch {
    /* ignore */
  }
  return [weekSet(phase)];
}

export default function FruitRain({ phase }: { phase: Phase & { recipeName: string } }) {
  // Deze component wordt pas getoond nadat de pagina in de browser geladen is.
  const phaseId = phase.id;
  const [animate, setAnimate] = useState<boolean>(() => shouldPlay(phaseId));
  const [run, setRun] = useState(0);
  const [sets, setSets] = useState<string[][]>(() => loadSets(phaseId));
  const current = sets[sets.length - 1];
  const ings = current.map((id) => ING[id]);
  const { items, shadows, left, right } = build(ings);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, `${weekId()}:${phaseId}`);
      localStorage.setItem(SET_KEY, JSON.stringify({ week: weekId(), phase: phaseId, sets: sets.slice(-6) } satisfies Saved));
    } catch {
      /* opslag niet beschikbaar */
    }
  }, [phaseId, sets]);

  const replay = () => {
    if (reduced()) return;
    setAnimate(false);
    setTimeout(() => {
      setRun((n) => n + 1);
      setAnimate(true);
    }, 80);
  };

  const shuffle = () => {
    setSets((prev) => [...prev, schudSet(phaseId, prev)]);
    if (reduced()) {
      setAnimate(false);
      setRun((n) => n + 1);
      return;
    }
    setAnimate(false);
    setTimeout(() => {
      setRun((n) => n + 1);
      setAnimate(true);
    }, 80);
  };

  const box = (p: Piece) => ({
    left: cq(p.left),
    top: cq(p.top - OFFSET),
    width: cq(p.size),
    height: cq(p.size),
  });

  return (
    <>
      <div className="fruit-stage" onClick={replay} role="img" aria-label={`Fruit van deze week: ${ings.map((i) => i.naam).join(", ")}. Tik om opnieuw af te spelen`} key={run}>
        {shadows.map((sh, i) => (
          <span
            key={`s${i}`}
            className={animate ? "fr-shade fr-anim" : "fr-shade"}
            style={{ left: cq(sh.left), top: cq(436 - OFFSET), width: cq(sh.w), height: cq(8), animationDelay: `${sh.delay.toFixed(2)}s` }}
          />
        ))}
        {items.map((p, i) => (
          <span key={i} className={animate ? "fr-fruit fr-anim" : "fr-fruit"} style={{ ...box(p), animationDelay: `${p.delay.toFixed(2)}s` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt="" draggable={false} style={{ transform: `rotate(${p.rot}deg)` }} />
          </span>
        ))}
        {left.map((p, i) => (
          <span key={`l${i}`} className={animate ? "fr-roll-l fr-anim" : "fr-gone"} style={{ ...box(p), animationDelay: `${p.delay.toFixed(2)}s`, animationDuration: `${p.dur}s` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt="" draggable={false} />
          </span>
        ))}
        {right.map((p, i) => (
          <span key={`r${i}`} className={animate ? "fr-roll-r fr-anim" : "fr-gone"} style={{ ...box(p), animationDelay: `${p.delay.toFixed(2)}s`, animationDuration: `${p.dur}s` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt="" draggable={false} />
          </span>
        ))}
      </div>

      <div className="fr-info">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <span className="display" style={{ fontSize: 32, color: phase.dark }}>{phase.recipeName}</span>
          <button type="button" onClick={shuffle} className="fr-shuffle" style={{ background: phase.dark }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
            </svg>
            Schud opnieuw
          </button>
        </div>
        <ul className="fr-list">
          {ings.map((i) => (
            <li key={i.id}>
              <span className="dot" style={{ width: 22, height: 22, flex: "none", background: i.kleur, marginTop: 1 }} />
              <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <strong>{i.naam}</strong>
                <span style={{ fontSize: 13, lineHeight: 1.4 }}>{i.reden}</span>
                {i.waarschuwing ? <span style={{ fontSize: 12, lineHeight: 1.35, color: phase.dark, fontStyle: "italic" }}>{i.waarschuwing}</span> : null}
              </span>
            </li>
          ))}
        </ul>
        <span style={{ fontSize: 11, opacity: 0.7, lineHeight: 1.4 }}>Juna geeft geen medisch advies. Heb je klachten of gebruik je medicijnen? Overleg met je huisarts.</span>
      </div>
    </>
  );
}
