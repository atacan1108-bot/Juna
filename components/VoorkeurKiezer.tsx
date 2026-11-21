"use client";

import { useState } from "react";
import { GROEPEN, ITEMS, itemNaam, zoek } from "@/lib/voorkeuren";

type Props = {
  id: string;
  titel: string;
  uitleg: string;
  waarde: string[];
  onChange: (ids: string[]) => void;
  /** wat al in de andere lijst staat, om dubbelen te voorkomen */
  anderen: string[];
};

export default function VoorkeurKiezer({ id, titel, uitleg, waarde, onChange, anderen }: Props) {
  const [invoer, setInvoer] = useState("");
  const [alles, setAlles] = useState(false);
  const suggesties = zoek(invoer, [...waarde, ...anderen]);
  const geenTreffer = invoer.trim().length >= 2 && zoek(invoer).length === 0;

  const voegToe = (ids: string[]) => {
    onChange(Array.from(new Set([...waarde, ...ids.filter((x) => !anderen.includes(x))])));
    setInvoer("");
  };
  const haalWeg = (x: string) => onChange(waarde.filter((w) => w !== x));

  return (
    <section className="card" style={{ display: "flex", flexDirection: "column", gap: 12, borderRadius: 22 }} aria-labelledby={`${id}-t`}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <h2 id={`${id}-t`} style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{titel}</h2>
        <span style={{ fontSize: 13, lineHeight: 1.45, color: "var(--ink-2)" }}>{uitleg}</span>
      </div>

      <div className="vk-chips" aria-live="polite">
        {waarde.length === 0 ? <span style={{ fontSize: 13, color: "var(--muted)" }}>Nog niets gekozen.</span> : null}
        {waarde.map((x) => (
          <button key={x} type="button" className="vk-chip vk-aan" onClick={() => haalWeg(x)} aria-label={`${itemNaam(x)} weghalen`}>
            {itemNaam(x)} <span aria-hidden="true">×</span>
          </button>
        ))}
      </div>

      <div className="field" style={{ position: "relative" }}>
        <label htmlFor={`${id}-zoek`}>Zoek een ingrediënt</label>
        <input
          id={`${id}-zoek`}
          type="text"
          autoComplete="off"
          placeholder="Typ bijvoorbeeld kiw of pomp"
          value={invoer}
          onChange={(e) => setInvoer(e.target.value)}
          aria-controls={`${id}-lijst`}
        />
        {suggesties.length > 0 && (
          <ul id={`${id}-lijst`} className="vk-lijst" role="listbox" aria-label="Suggesties">
            {suggesties.map((i) => (
              <li key={i.id} role="option" aria-selected="false">
                <button type="button" onClick={() => voegToe([i.id])}>{i.naam}</button>
              </li>
            ))}
          </ul>
        )}
        {geenTreffer && <span className="hint">Dit gebruiken we niet in Juna, je ziet het dus nooit.</span>}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 12, color: "var(--muted)" }}>Of kies een hele groep</span>
        <div className="vk-chips">
          {GROEPEN.map((g) => (
            <button key={g.id} type="button" className="vk-chip" onClick={() => voegToe(g.ids)}>
              + {g.naam}
            </button>
          ))}
        </div>
      </div>

      <button type="button" onClick={() => setAlles((v) => !v)} aria-expanded={alles} style={{ background: "none", border: "none", textAlign: "left", padding: 0, minHeight: 36, color: "var(--violet-d)", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
        {alles ? "Verberg alle ingrediënten" : "Bekijk alle ingrediënten"}
      </button>
      {alles && (
        <div className="vk-chips">
          {ITEMS.map((i) => {
            const aan = waarde.includes(i.id);
            const elders = anderen.includes(i.id);
            return (
              <button key={i.id} type="button" disabled={elders} className={aan ? "vk-chip vk-aan" : "vk-chip"} aria-pressed={aan} onClick={() => (aan ? haalWeg(i.id) : voegToe([i.id]))}>
                {i.naam}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
