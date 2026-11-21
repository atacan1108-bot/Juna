"use client";

import { PHASES, getRecipe } from "@/lib/data";
import { beschikbaar } from "@/lib/ingredients";

export default function VoorkeurTelling({ uitgesloten }: { uitgesloten: string[] }) {
  const telling = PHASES.map((p) => ({ naam: getRecipe(p.recipes[0])?.name ?? p.label, label: p.label, n: beschikbaar(p.id, uitgesloten).length }));
  const leeg = telling.filter((t) => t.n === 0);
  return (
    <div className="card" style={{ borderRadius: 22, display: "flex", flexDirection: "column", gap: 6 }} role="status">
      <strong style={{ fontSize: 15 }}>Zo blijft het variëren</strong>
      {leeg.length ? (
        <span style={{ fontSize: 14, lineHeight: 1.45, color: "var(--berry-d)" }}>
          Voor {leeg.map((t) => t.label.toLowerCase()).join(" en ")} blijft er geen sapje over. Haal een voorkeur weg, dan zoekt Juna weer combinaties. Allergieën laat Juna altijd staan.
        </span>
      ) : (
        <span style={{ fontSize: 14, lineHeight: 1.45 }}>
          Aantal verschillende sapjes die overblijven: {telling.map((t) => `${t.naam} ${t.n}`).join(", ")}.
        </span>
      )}
    </div>
  );
}
