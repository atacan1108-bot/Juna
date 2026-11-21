"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { IconSparkle, IconWave } from "@/components/Icons";
import { computeToday, useCycle } from "@/lib/cycle";
import { RECIPES, getPhase } from "@/lib/data";
import { receptOk, useVoorkeuren } from "@/lib/voorkeuren";

function GlowInner() {
  const params = useSearchParams();
  const [goal, setGoal] = useState<"glow" | "haar">(params.get("doel") === "haar" ? "haar" : "glow");
  const cycle = useCycle();
  const phase = cycle ? getPhase(computeToday(cycle).phase) : null;
  const { uitgesloten } = useVoorkeuren();
  const list = RECIPES.filter((r) => r.category === goal && receptOk(r, uitgesloten));
  const isGlow = goal === "glow";

  return (
    <main className="app-main" style={{ gap: 16 }}>
      <h1 className="display" style={{ fontSize: 30 }}>Extra voor huid of haar</h1>
      <p style={{ fontSize: 14, lineHeight: 1.5, color: "var(--ink-2)", margin: 0 }}>Je sapje van de week volgt je cyclus. Hier kies je er iets extra's bij. Dat komt erbovenop, niet in plaats van je fase.</p>

      <div className="segmented" role="group" aria-label="Kies je extra">
        <button type="button" aria-pressed={isGlow} onClick={() => setGoal("glow")}>Voor je huid</button>
        <button type="button" aria-pressed={!isGlow} onClick={() => setGoal("haar")}>Voor je haar</button>
      </div>

      <div style={{ borderRadius: 26, background: isGlow ? "var(--orange-t)" : "var(--green-t)", padding: 18, display: "flex", gap: 14, alignItems: "center" }}>
        <span className="phase-icon" style={{ width: 60, height: 60, background: isGlow ? "var(--orange)" : "var(--green)" }}>
          {isGlow ? <IconSparkle size={28} color="#fff" /> : <IconWave size={28} color="#fff" />}
        </span>
        <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <strong style={{ fontSize: 16 }}>
            {isGlow ? (phase ? `Je huid in de ${phase.label.toLowerCase()}` : "Voor je huid") : "Voor je haar"}
          </strong>
          <span style={{ fontSize: 13, lineHeight: 1.4, color: "var(--ink-2)" }}>
            {isGlow
              ? phase
                ? phase.skin
                : "Sapjes met vitamine C, bètacaroteen en veel vocht."
              : "Smoothies met ijzer, zink, biotine en eiwit. Juna belooft geen sneller of voller haar, het zijn voedzame keuzes."}
          </span>
        </span>
      </div>

      <h2 style={{ fontWeight: 700, fontSize: 19 }}>{isGlow ? "Sapjes voor je huid" : "Smoothies voor je haar"}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {list.map((r) => (
          <Link key={r.slug} href={`/app/recept/${r.slug}`} className="list-recipe">
            <span className="dot" style={{ width: 48, height: 48, background: r.colors[0] }} />
            <span style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
              <strong>{r.name}</strong>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>{r.short}</span>
            </span>
          </Link>
        ))}
      </div>

      {!isGlow && (
        <div style={{ borderRadius: 22, background: "var(--green-t)", padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          <strong style={{ fontSize: 15 }}>Tip: geef het 12 weken</strong>
          <span style={{ fontSize: 13, lineHeight: 1.45, color: "#2D4A30" }}>
            Haar groeit ongeveer 1 cm per maand. Resultaat van voeding zie je dus pas na een paar maanden.
          </span>
        </div>
      )}
    </main>
  );
}

export default function Glow() {
  return (
    <Suspense fallback={<main className="app-main" />}>
      <GlowInner />
    </Suspense>
  );
}
