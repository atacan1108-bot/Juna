"use client";

import ExtraBlok from "@/components/ExtraBlok";
import { computeToday, useCycle } from "@/lib/cycle";
import { getPhase } from "@/lib/data";
import { useVoorkeuren } from "@/lib/voorkeuren";

export default function Extra() {
  const cycle = useCycle();
  const phase = cycle ? getPhase(computeToday(cycle).phase) : null;
  const { uitgesloten } = useVoorkeuren();

  return (
    <main className="app-main" style={{ gap: 16 }}>
      <h1 className="display" style={{ fontSize: 30 }}>Extra voor huid of haar</h1>
      <p style={{ fontSize: 14, lineHeight: 1.5, color: "var(--ink-2)", margin: 0 }}>
        Je sapje van de week volgt je cyclus. Hier kies je er iets extra&apos;s bij: een toevoeging voor in je sapje, of een klein shotje. Dat komt erbovenop, niet in plaats van je fase.
      </p>
      <ExtraBlok uitgesloten={uitgesloten} kleur={phase?.dark ?? "#8F4A0C"} tint={phase?.tint ?? "var(--orange-t)"} />
      <div style={{ borderRadius: 22, background: "var(--green-t)", padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <strong style={{ fontSize: 15 }}>Geef het de tijd</strong>
        <span style={{ fontSize: 13, lineHeight: 1.45, color: "#2D4A30" }}>
          Haar groeit ongeveer 1 cm per maand. Van voeding merk je dus hooguit na een paar maanden iets.
        </span>
      </div>
    </main>
  );
}
