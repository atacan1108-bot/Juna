"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import VoorkeurKiezer from "@/components/VoorkeurKiezer";
import { IconLock } from "@/components/Icons";
import { beschikbaar } from "@/lib/ingredients";
import { PHASES, getRecipe } from "@/lib/data";
import { useCycle } from "@/lib/cycle";
import { saveVoorkeuren, useVoorkeuren } from "@/lib/voorkeuren";

function Inhoud() {
  const router = useRouter();
  const eerst = useSearchParams().get("eerst") === "1";
  const { allergie, nietLekker, uitgesloten } = useVoorkeuren();
  const cycle = useCycle();

  const telling = PHASES.map((p) => ({ naam: getRecipe(p.recipes[0])?.name ?? p.label, label: p.label, n: beschikbaar(p.id, uitgesloten).length }));
  const leeg = telling.filter((t) => t.n === 0);

  return (
    <main className="app-main">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <h1 className="display" style={{ fontSize: 30, lineHeight: 1.05 }}>Allergieën en voorkeuren</h1>
        <p style={{ fontSize: 15, lineHeight: 1.45, color: "var(--ink-2)" }}>
          Wat je hier kiest, laat Juna niet meer zien in je sapjes, tips en recepten. Je kunt dit altijd aanpassen.
        </p>
      </div>

      <VoorkeurKiezer
        id="allergie"
        titel="Allergie of intolerantie"
        uitleg="Hier laat Juna het ingrediënt altijd weg. Controleer bij een ernstige allergie altijd zelf de verpakking."
        waarde={allergie}
        anderen={nietLekker}
        onChange={(ids) => saveVoorkeuren({ allergie: ids, nietLekker: nietLekker.filter((x) => !ids.includes(x)) })}
      />

      <VoorkeurKiezer
        id="nietlekker"
        titel="Dit vind ik niet lekker"
        uitleg="Een smaakkeuze. Juna laat dit weg uit jouw sapjes."
        waarde={nietLekker}
        anderen={allergie}
        onChange={(ids) => saveVoorkeuren({ allergie, nietLekker: ids })}
      />

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

      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "0 4px" }}>
        <IconLock size={20} color="var(--violet-d)" />
        <span style={{ fontSize: 13, lineHeight: 1.45, color: "var(--ink-2)" }}>
          Dit blijft alleen op dit toestel opgeslagen. Er wordt niets naar een server gestuurd. Juna geeft geen medisch advies.
        </span>
      </div>

      <button type="button" className="btn btn-dark btn-block" style={{ minHeight: 56, borderRadius: 18 }} onClick={() => router.push(cycle ? "/app" : "/app/koppelen")}>
        {eerst ? "Klaar, toon mijn sap" : "Opslaan en terug"}
      </button>
      {eerst && (
        <Link href="/app" style={{ textAlign: "center", fontSize: 14, fontWeight: 700, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
          Overslaan
        </Link>
      )}
    </main>
  );
}

export default function Voorkeuren() {
  return (
    <Suspense fallback={<main className="app-main" aria-busy="true" />}>
      <Inhoud />
    </Suspense>
  );
}
