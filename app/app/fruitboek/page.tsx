"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCycle } from "@/lib/cycle";
import { getPhase, getRecipe } from "@/lib/data";
import { ING } from "@/lib/ingredients";
import { bewaardStore, boekStore } from "@/lib/mijn";

const datumFmt = new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "short" });

export default function Fruitboek() {
  const router = useRouter();
  const cycle = useCycle();
  const boek = boekStore.useHook();
  const bewaard = bewaardStore.useHook();
  const [tab, setTab] = useState<"boek" | "bewaard">("boek");
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    if (cycle === null) router.replace("/app/welkom");
  }, [cycle, router]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setOpen(null), 6000);
    return () => clearTimeout(t);
  }, [open]);

  if (!cycle) return <main className="app-main" aria-busy="true" />;

  const alle = Object.values(ING).sort((a, b) => Number(boek.includes(b.id)) - Number(boek.includes(a.id)) || a.naam.localeCompare(b.naam, "nl"));
  const totaal = alle.length;

  return (
    <main className="app-main">
      <h1 className="display" style={{ fontSize: 30, lineHeight: 1.05 }}>{tab === "boek" ? "Fruitboek" : "Bewaard"}</h1>
      <div className="seg2" role="group" aria-label="Kies een onderdeel">
        <button type="button" aria-pressed={tab === "boek"} onClick={() => setTab("boek")}>Fruitboek</button>
        <button type="button" aria-pressed={tab === "bewaard"} onClick={() => setTab("bewaard")}>Bewaard</button>
      </div>

      {tab === "boek" ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--ink-2)" }}>
            <span>{boek.length} van {totaal} ontdekt</span>
          </div>
          <div style={{ height: 10, borderRadius: 5, background: "#eadbe4", overflow: "hidden" }} role="img" aria-label={`${boek.length} van ${totaal} ontdekt`}>
            <div style={{ height: "100%", width: `${(boek.length / totaal) * 100}%`, background: "var(--violet)", borderRadius: 5 }} />
          </div>
          <div className="bk-grid">
            {alle.map((i) =>
              boek.includes(i.id) ? (
                <button key={i.id} type="button" className="bk-k" style={{ background: `${i.kleur}26` }} onClick={() => setOpen(i.id)} aria-label={i.naam}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/fruit/${i.id}.svg`} alt="" />
                </button>
              ) : (
                <div key={i.id} className="bk-k bk-slot" aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/fruit/${i.id}.svg`} alt="" />
                </div>
              ),
            )}
          </div>
          <span style={{ fontSize: 12.5, lineHeight: 1.45, color: "var(--ink-2)" }}>
            Fruit komt in je boek zodra je op &ldquo;Ik heb dit gemaakt&rdquo; tikt bij je sapje. De donkere vakjes zijn nog te ontdekken. Tik op een tekening in kleur voor een kort weetje.
          </span>
          {open ? (
            <div className="bk-sheet" role="status">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/fruit/${open}.svg`} alt="" />
              <span style={{ flex: 1 }}>
                <strong>{ING[open].naam}</strong>
                <br />
                {ING[open].reden}
              </span>
              <button type="button" onClick={() => setOpen(null)} aria-label="Sluiten">×</button>
            </div>
          ) : null}
        </>
      ) : bewaard.length === 0 ? (
        <p style={{ fontSize: 14, lineHeight: 1.5, color: "var(--ink-2)" }}>
          Nog niets bewaard. Tik op het hartje bij een sapje dat je lekker vindt.
        </p>
      ) : (
        <div className="card" style={{ borderRadius: 22, display: "flex", flexDirection: "column" }}>
          {[...bewaard].reverse().map((b) => {
            const p = getPhase(b.phase);
            return (
              <div key={`${b.datum}-${b.ids.join()}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #f1e7ee" }}>
                <div style={{ display: "flex" }}>
                  {b.ids.map((id) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={id} src={`/fruit/${id}.svg`} alt={ING[id].naam} style={{ width: 38, height: 38, marginRight: -8 }} />
                  ))}
                </div>
                <span style={{ flex: 1, paddingLeft: 10, display: "flex", flexDirection: "column" }}>
                  <strong style={{ color: p.dark }}>{getRecipe(p.recipes[0])?.name ?? p.label}</strong>
                  <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Gemaakt op {datumFmt.format(new Date(b.datum + "T00:00:00"))}</span>
                </span>
                <button
                  type="button"
                  aria-label="Haal weg uit bewaard"
                  onClick={() => bewaardStore.bewaar(bewaard.filter((x) => x !== b))}
                  style={{ border: "none", background: "none", fontSize: 24, color: "var(--berry)", cursor: "pointer", minWidth: 44, minHeight: 44 }}
                >
                  ♥
                </button>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
