"use client";

import { useEffect, useRef, useState } from "react";

const MAANDEN = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
const DAGEN = ["ma", "di", "wo", "do", "vr", "za", "zo"];

const iso = (j: number, m: number, d: number) => `${j}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

function lang(v: string) {
  const [j, m, d] = v.split("-").map(Number);
  return `${d} ${MAANDEN[m - 1]} ${j}`;
}

type Props = { id: string; value: string; max?: string; onChange: (v: string) => void };

/** Kalender in de stijl van Juna, in plaats van de standaardkiezer van de browser. */
export default function DatePicker({ id, value, max, onChange }: Props) {
  const nu = new Date();
  const start = value ? value.split("-").map(Number) : [nu.getFullYear(), nu.getMonth() + 1];
  const [open, setOpen] = useState(false);
  const [jaar, setJaar] = useState(start[0]);
  const [maand, setMaand] = useState(start[1] - 1);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && value) {
      const [j, m] = value.split("-").map(Number);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setJaar(j);
      setMaand(m - 1);
    }
  }, [open, value]);

  useEffect(() => {
    if (!open) return;
    const sluit = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", sluit);
    return () => window.removeEventListener("keydown", sluit);
  }, [open]);

  const verschuif = (n: number) => {
    const t = new Date(jaar, maand + n, 1);
    setJaar(t.getFullYear());
    setMaand(t.getMonth());
  };

  const eerste = (new Date(jaar, maand, 1).getDay() + 6) % 7;
  const aantal = new Date(jaar, maand + 1, 0).getDate();
  const vandaag = iso(nu.getFullYear(), nu.getMonth(), nu.getDate());
  const maxMaand = max ? max.slice(0, 7) : "";
  const volgendeKan = !maxMaand || iso(jaar, maand, 1).slice(0, 7) < maxMaand;
  const cellen: (number | null)[] = [...Array(eerste).fill(null), ...Array.from({ length: aantal }, (_, i) => i + 1)];

  return (
    <div ref={wrap} className="dp">
      <button id={id} type="button" className="dp-knop" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span>{value ? lang(value) : "Kies een datum"}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="5" width="18" height="16" rx="4" />
          <path d="M8 3v4M16 3v4M3 10h18" />
        </svg>
      </button>

      {open && (
        <div className="dp-paneel" role="dialog" aria-label="Kies een datum">
          <div className="dp-kop">
            <button type="button" aria-label="Vorige maand" onClick={() => verschuif(-1)}>‹</button>
            <span className="display">{MAANDEN[maand]} {jaar}</span>
            <button type="button" aria-label="Volgende maand" disabled={!volgendeKan} onClick={() => verschuif(1)}>›</button>
          </div>
          <div className="dp-raster" role="grid">
            {DAGEN.map((d) => (
              <span key={d} className="dp-dag" aria-hidden="true">{d}</span>
            ))}
            {cellen.map((d, i) => {
              if (d === null) return <span key={`l${i}`} />;
              const v = iso(jaar, maand, d);
              const uit = !!max && v > max;
              const gekozen = v === value;
              return (
                <button
                  key={v}
                  type="button"
                  disabled={uit}
                  aria-pressed={gekozen}
                  aria-label={lang(v)}
                  className={`dp-cel${gekozen ? " dp-gekozen" : ""}${v === vandaag ? " dp-vandaag" : ""}`}
                  onClick={() => {
                    onChange(v);
                    setOpen(false);
                  }}
                >
                  {d}
                </button>
              );
            })}
          </div>
          <div className="dp-voet">
            <button type="button" onClick={() => setOpen(false)}>Sluiten</button>
          </div>
        </div>
      )}
    </div>
  );
}
