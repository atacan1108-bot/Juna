"use client";

import { useState } from "react";
import { ING } from "@/lib/ingredients";
import { kiesExtra, MEEDENKEN, SHOT_BEREIDING, UITLEG, type ExtraDoel } from "@/lib/extras";
import { extraStore, zetOpLijst } from "@/lib/mijn";

const NAMEN: Record<ExtraDoel, string> = { huid: "Voor je huid", haar: "Voor je haar" };

export default function ExtraBlok({ uitgesloten, kleur, tint }: { uitgesloten: string[]; kleur: string; tint: string }) {
  const doel = extraStore.useHook();
  const [status, setStatus] = useState("");
  const keuze = doel ? kiesExtra(doel, uitgesloten) : null;

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: 12, borderRadius: 22 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span className="eyebrow" style={{ color: "var(--muted)" }}>Extra voor je huid of haar</span>
        <span style={{ fontSize: 13, lineHeight: 1.45, color: "var(--ink-2)" }}>
          Wil je er iets bij? {MEEDENKEN} Het komt bovenop je sapje van de fase.
        </span>
      </div>
      <div className="segmented" role="group" aria-label="Kies een extra">
        {(["huid", "haar"] as ExtraDoel[]).map((d) => (
          <button
            key={d}
            type="button"
            aria-pressed={doel === d}
            onClick={() => {
              extraStore.bewaar(doel === d ? null : d);
              setStatus("");
            }}
          >
            {NAMEN[d]}
          </button>
        ))}
      </div>
      {doel && keuze ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span style={{ fontSize: 13.5, lineHeight: 1.45, color: "var(--ink-2)" }}>{UITLEG[doel]}</span>
          {keuze.toppings.length ? (
            <div style={{ borderRadius: 18, background: tint, padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <strong style={{ fontSize: 15, color: kleur }}>Voeg dit toe aan je sapje</strong>
              {keuze.toppings.map((t) => (
                <div key={t.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span className="dot" style={{ width: 22, height: 22, flex: "none", background: ING[t.id].kleur, marginTop: 1 }} />
                  <span style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <strong style={{ fontSize: 14 }}>{ING[t.id].naam}</strong>
                    <span style={{ fontSize: 13, lineHeight: 1.4 }}>{t.reden}</span>
                  </span>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-light"
                style={{ minHeight: 44, borderRadius: 14, fontSize: 14 }}
                onClick={() => setStatus(zetOpLijst(keuze.toppings.map((t) => t.id), "Extra") ? "Op je boodschappenlijstje gezet." : "Stond al op je lijstje.")}
              >
                Zet op lijstje
              </button>
            </div>
          ) : null}
          {keuze.shot ? (
            <div style={{ borderRadius: 18, background: "#fff", border: `1px solid ${tint}`, padding: 14, display: "flex", flexDirection: "column", gap: 6 }}>
              <strong style={{ fontSize: 15, color: kleur }}>Of maak een shotje</strong>
              <span className="display" style={{ fontSize: 20 }}>{keuze.shot.naam}</span>
              <span style={{ fontSize: 13, lineHeight: 1.4 }}>{keuze.shot.hoeveel}</span>
              <span style={{ fontSize: 13, lineHeight: 1.4, color: "var(--muted)" }}>{keuze.shot.reden}</span>
              <span style={{ fontSize: 12.5, lineHeight: 1.4, color: "var(--muted)" }}>{SHOT_BEREIDING}</span>
              <button
                type="button"
                className="btn btn-light"
                style={{ minHeight: 44, borderRadius: 14, fontSize: 14 }}
                onClick={() => setStatus(zetOpLijst(keuze.shot!.ids, "Extra") ? "Op je boodschappenlijstje gezet." : "Stond al op je lijstje.")}
              >
                Zet op lijstje
              </button>
            </div>
          ) : null}
          {!keuze.toppings.length && !keuze.shot ? (
            <p style={{ fontSize: 14, lineHeight: 1.5 }}>Met jouw allergieën en voorkeuren heeft Juna nu geen extra gevonden. Pas je voorkeuren aan.</p>
          ) : null}
          <span role="status" aria-live="polite" style={{ fontSize: 13, minHeight: 16 }}>{status}</span>
          <span style={{ fontSize: 11.5, lineHeight: 1.4, color: "var(--muted)" }}>
            Dit zijn voedzame keuzes. Juna belooft geen resultaat voor je huid of haar en geeft geen medisch advies.
          </span>
        </div>
      ) : null}
    </div>
  );
}
