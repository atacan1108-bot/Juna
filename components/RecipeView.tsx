"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconBack, IconCheck, IconHeart } from "./Icons";
import { getPhase, type Recipe } from "@/lib/data";

const FAV_KEY = "juna.favs.v1";

function readFavs(): string[] {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function RecipeView({ recipe }: { recipe: Recipe }) {
  const router = useRouter();
  const phase = recipe.phase ? getPhase(recipe.phase) : null;
  const color = phase?.color ?? (recipe.category === "glow" ? "#E07A1F" : "#3F8F4E");
  const tint = phase?.tint ?? (recipe.category === "glow" ? "#FDEBD6" : "#E2F1E0");
  const dark = phase?.dark ?? (recipe.category === "glow" ? "#8F4A0C" : "#2F6E3B");
  const tag = phase ? `${phase.label} · ${recipe.kind}` : `${recipe.category === "glow" ? "Glow" : "Haar"} · ${recipe.kind}`;

  const [fav, setFav] = useState(false);
  const [done, setDone] = useState<number[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFav(readFavs().includes(recipe.slug));
  }, [recipe.slug]);

  function toggleFav() {
    const favs = readFavs();
    const next = favs.includes(recipe.slug) ? favs.filter((s) => s !== recipe.slug) : [...favs, recipe.slug];
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    setFav(next.includes(recipe.slug));
  }

  function back() {
    if (window.history.length > 1) router.back();
    else router.push("/app");
  }

  return (
    <main style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          background: color,
          color: "#fff",
          padding: "calc(env(safe-area-inset-top, 0px) + 28px) 20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          borderRadius: "0 0 32px 32px",
          position: "relative",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        <div aria-hidden="true" style={{ position: "absolute", right: -60, bottom: -70, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
        {recipe.colors.slice(0, 2).map((c, i) => (
          <div key={i} aria-hidden="true" style={{ position: "absolute", right: i ? 64 : -10, bottom: i ? 14 : -14, width: i ? 34 : 70, height: i ? 34 : 70, borderRadius: "50%", background: c }} />
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
          <button type="button" onClick={back} aria-label="Terug" className="icon-btn" style={{ background: "#fff", color: "var(--ink)" }}>
            <IconBack size={22} />
          </button>
          <button type="button" onClick={toggleFav} aria-label={fav ? "Verwijder uit favorieten" : "Bewaar recept"} aria-pressed={fav} className="icon-btn" style={{ background: "#fff", color: "var(--berry)" }}>
            <IconHeart size={22} />
            {fav && <span style={{ position: "absolute", width: 10, height: 10, background: "var(--berry)", borderRadius: "50%", marginLeft: 22, marginTop: -22 }} />}
          </button>
        </div>
        <span className="chip" style={{ alignSelf: "flex-start", background: "#fff", color: dark, position: "relative", fontSize: 12 }}>{tag}</span>
        <h1 className="display" style={{ fontSize: 36, lineHeight: 1, position: "relative", maxWidth: "75%" }}>{recipe.name}</h1>
        <div style={{ display: "flex", gap: 16, fontSize: 13, position: "relative" }}>
          <span>{recipe.minutes} min</span>
          <span>1 glas</span>
          <span>Geen toegevoegde suiker</span>
        </div>
      </div>

      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 20, flexShrink: 0 }}>
        <div style={{ background: tint, borderRadius: 22, padding: 16, display: "flex", flexDirection: "column", gap: 6 }}>
          <span className="eyebrow" style={{ color: dark }}>Waarom nu?</span>
          <p style={{ fontSize: 14, lineHeight: 1.5 }}>{recipe.why}</p>
        </div>

        <section style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <h2 style={{ fontWeight: 700, fontSize: 19, marginBottom: 4 }}>Ingrediënten</h2>
          {recipe.ingredients.map((i) => (
            <div key={i.name} className="ingredient">
              <span>{i.name}</span>
              <span style={{ color: "var(--muted)", textAlign: "right" }}>{i.amount}</span>
            </div>
          ))}
        </section>

        <section style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <h2 style={{ fontWeight: 700, fontSize: 19, marginBottom: 4 }}>Bereiding</h2>
          {recipe.steps.map((s, idx) => {
            const isDone = done.includes(idx);
            return (
              <button
                key={idx}
                type="button"
                className="check-row"
                aria-pressed={isDone}
                onClick={() => setDone((d) => (d.includes(idx) ? d.filter((x) => x !== idx) : [...d, idx]))}
              >
                <span className="check-box" style={{ background: isDone ? "var(--ink)" : "#fff" }}>
                  {isDone ? <IconCheck size={16} color="#fff" /> : <span style={{ fontSize: 13, fontWeight: 700 }}>{idx + 1}</span>}
                </span>
                <span style={{ textDecoration: isDone ? "line-through" : "none", color: isDone ? "var(--muted)" : "var(--ink)" }}>{s}</span>
              </button>
            );
          })}
          {done.length === recipe.steps.length && (
            <p role="status" style={{ marginTop: 8, background: "var(--green-t)", color: "var(--green-d)", fontWeight: 700, padding: "12px 14px", borderRadius: 14 }}>
              Proost! Geniet ervan.
            </p>
          )}
        </section>

        <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
          Voedingsinspiratie, geen medisch advies. Gebruik je medicijnen of heb je klachten? Overleg met je huisarts of diëtist.
        </p>
      </div>
    </main>
  );
}
