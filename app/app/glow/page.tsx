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
      <h1 className="display" style={{ fontSize: 30 }}>Glow &amp; haar</h1>

      <div className="segmented" role="group" aria-label="Kies je doel">
        <button type="button" aria-pressed={isGlow} onClick={() => setGoal("glow")}>De Glow</button>
        <button type="button" aria-pressed={!isGlow} onClick={() => setGoal("haar")}>Haargroei</button>
      </div>

      <div style={{ borderRadius: 26, background: isGlow ? "var(--orange-t)" : "var(--green-t)", padding: 18, display: "flex", gap: 14, alignItems: "center" }}>
        <span className="phase-icon" style={{ width: 60, height: 60, background: isGlow ? "var(--orange)" : "var(--green)" }}>
          {isGlow ? <IconSparkle size={28} color="#fff" /> : <IconWave size={28} color="#fff" />}
        </span>
        <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <strong style={{ fontSize: 16 }}>
            {phase ? `Je ${isGlow ? "huid" : "haar"} in de ${phase.label.toLowerCase()}` : isGlow ? "Voor een stralende huid" : "Voor sterk, voller haar"}
          </strong>
          <span style={{ fontSize: 13, lineHeight: 1.4, color: "var(--ink-2)" }}>
            {phase
              ? isGlow
                ? phase.skin
                : phase.hair
              : isGlow
                ? "Vitamine C voor collageen, bètacaroteen en veel vocht."
                : "IJzer, zink, biotine en eiwit – met voedingsrijke toppings."}
          </span>
        </span>
      </div>

      <h2 style={{ fontWeight: 700, fontSize: 19 }}>{isGlow ? "Glow-sapjes" : "Haar-smoothies"}</h2>
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
