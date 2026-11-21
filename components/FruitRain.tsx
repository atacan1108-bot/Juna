"use client";

import { useEffect, useState } from "react";
import type { PhaseId } from "@/lib/data";

/* Fruit per fase (zie fases.json uit het ontwerp). "pepper" valt niet in de stapel. */
const KINDS: Record<PhaseId, string[]> = {
  menstruatie: ["beet", "pomegranate", "orange", "ginger"],
  folliculair: ["spinach", "kiwi", "cucumber", "apple", "lime"],
  ovulatie: ["carrot", "pineapple", "orange", "turmeric", "pepper"],
  luteaal: ["blueberry", "banana", "spinach", "cacao", "blueberry"],
};
const CUT: Record<string, string> = {
  orange: "orangeCut",
  pomegranate: "pomegranateCut",
  lime: "limeCut",
  cacao: "cacaoCut",
};
const ROUND_PREF = ["orange", "apple", "pomegranate", "lime", "kiwi", "beet", "cucumber", "pineapple", "blueberry", "cacao"];

const W = 390; // breedte van het ontwerp in px; alles hieronder schaalt mee via cqw
const cq = (px: number) => `${((px / W) * 100).toFixed(3)}cqw`;
const frac = (x: number) => x - Math.floor(x);

type Piece = { left: number; top: number; size: number; rot: number; delay: number; dur: number; src: string };

function build(phase: PhaseId) {
  const kinds = KINDS[phase];
  const stackKinds = Array.from(new Set(kinds.filter((k) => k !== "pepper")));
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
      const kind = stackKinds[(j * 2 + r * 3) % stackKinds.length];
      const left = Math.round(195 + (j - (count - 1) / 2) * 56 - size / 2);
      const delay = 0.1 + r * 0.5 + j * 0.12 + frac(s * 0.31) * 0.08;
      const file = CUT[kind] && (j + r) % 2 === 1 ? CUT[kind] : kind;
      items.push({ left, top, size, rot: ((s * 37) % 13) - 6, delay, dur: 1.5, src: `/fruit/${file}.svg` });
      if (r === 0) shadows.push({ left: left + 4, w: size - 8, delay });
      s++;
    }
  }
  const round = ROUND_PREF.filter((k) => kinds.includes(k));
  const kL = round[0];
  const kR = round[1] ?? round[0];
  const mk = (kind: string, left: number, size: number, delay: number, dur: number): Piece => ({
    left, top: Math.round(440 - size * 0.92), size, rot: 0, delay, dur, src: `/fruit/${kind}.svg`,
  });
  const left = [mk(kL, 6, 44, 1.0, 2.6)];
  const right = [mk(kR, 340, 44, 1.25, 2.6)];
  if (kinds.includes("pepper")) {
    left.push(mk("pepper", 14, 16, 1.7, 2.2), mk("pepper", 26, 16, 1.85, 2.2));
    right.push(mk("pepper", 356, 16, 1.95, 2.2));
  }
  return { items, shadows, left, right };
}

function weekId(d = new Date()) {
  // ISO-week, bv. 2026-W47 — alleen een label om "nieuwe week" te herkennen
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((t.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${week}`;
}

const KEY = "juna.fruit.week";

function shouldPlay(phase: PhaseId): boolean {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    return localStorage.getItem(KEY) !== `${weekId()}:${phase}`;
  } catch {
    return true;
  }
}

export default function FruitRain({ phase }: { phase: PhaseId }) {
  // Deze component wordt pas getoond nadat de pagina in de browser geladen is.
  const [animate, setAnimate] = useState<boolean>(() => shouldPlay(phase));
  const [run, setRun] = useState(0);
  const { items, shadows, left, right } = build(phase);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, `${weekId()}:${phase}`);
    } catch {
      /* opslag niet beschikbaar */
    }
  }, [phase]);

  const replay = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setAnimate(false);
    setTimeout(() => {
      setRun((n) => n + 1);
      setAnimate(true);
    }, 80);
  };

  const box = (p: Piece) => ({
    left: cq(p.left),
    top: cq(p.top),
    width: cq(p.size),
    height: cq(p.size),
  });

  return (
    <div className="fruit-stage" onClick={replay} role="img" aria-label="Fruit van deze week, tik om opnieuw af te spelen" key={run}>
      {shadows.map((sh, i) => (
        <span
          key={`s${i}`}
          className={animate ? "fr-shade fr-anim" : "fr-shade"}
          style={{ left: cq(sh.left), top: cq(436), width: cq(sh.w), height: cq(8), animationDelay: `${sh.delay.toFixed(2)}s` }}
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
  );
}
