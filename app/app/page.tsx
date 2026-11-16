"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CycleRing from "@/components/CycleRing";
import { IconSparkle, IconWave } from "@/components/Icons";
import { computeToday, useCycle } from "@/lib/cycle";
import { getPhase, getRecipe } from "@/lib/data";

const fmt = new Intl.DateTimeFormat("nl-NL", { weekday: "long", day: "numeric", month: "long" });

export default function Vandaag() {
  const cycle = useCycle();
  const router = useRouter();

  useEffect(() => {
    if (cycle === null) router.replace("/app/welkom");
  }, [cycle, router]);

  if (!cycle) return <main className="app-main" aria-busy="true" />;

  const { day, phase: phaseId, daysToPeriod } = computeToday(cycle);
  const phase = getPhase(phaseId);
  const recipe = getRecipe(phase.recipes[0])!;
  const raw = fmt.format(new Date());
  const today = raw.charAt(0).toUpperCase() + raw.slice(1);

  return (
    <main className="app-main">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 14, color: "var(--muted)" }}>{today}</span>
          <h1 className="display" style={{ fontSize: 28 }}>Hoi!</h1>
        </div>
        <Link
          href="/app/koppelen"
          aria-label="Cyclus instellen"
          className="icon-btn"
          style={{ background: "var(--violet-t)", color: "var(--violet-d)", fontWeight: 800 }}
        >
          J
        </Link>
      </div>

      <div className="card" style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <CycleRing day={day} cycleLength={cycle.cycleLength} periodLength={cycle.periodLength} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span className="chip" style={{ alignSelf: "flex-start", background: phase.tint, color: phase.dark, fontSize: 12 }}>
            {phase.label}
          </span>
          <span style={{ fontSize: 15, lineHeight: 1.4 }}>{phase.body}</span>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>
            {phaseId === "menstruatie"
              ? `Dag ${day} van je menstruatie`
              : `Menstruatie over ± ${daysToPeriod} ${daysToPeriod === 1 ? "dag" : "dagen"}`}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <h2 style={{ fontWeight: 700, fontSize: 20 }}>Jouw {recipe.kind === "smoothie" ? "smoothie" : "sap"} van deze week</h2>
        <Link href={`/app/recept/${recipe.slug}`} className="recipe-hero" style={{ background: phase.color }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div className="stack-dots" style={{ color: phase.color }}>
              {recipe.colors.map((c, i) => (
                <span key={i} style={{ background: c }} />
              ))}
            </div>
            <span className="chip" style={{ background: "#fff", color: phase.dark }}>{recipe.minutes} min</span>
          </div>
          <span className="display" style={{ fontSize: 26 }}>{recipe.name}</span>
          <span style={{ fontSize: 14, lineHeight: 1.45 }}>{recipe.short}</span>
          <span style={{ fontSize: 14, fontWeight: 700 }}>Bekijk recept →</span>
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
        <Link href="/app/glow" style={{ textDecoration: "none", background: "var(--orange-t)", borderRadius: 22, padding: 14, display: "flex", flexDirection: "column", gap: 6 }}>
          <IconSparkle size={22} color="var(--orange-d)" />
          <span className="eyebrow" style={{ color: "var(--orange-d)" }}>Glow-tip</span>
          <span style={{ fontSize: 13, lineHeight: 1.35 }}>{phase.skin}</span>
        </Link>
        <Link href="/app/glow?doel=haar" style={{ textDecoration: "none", background: "var(--green-t)", borderRadius: 22, padding: 14, display: "flex", flexDirection: "column", gap: 6 }}>
          <IconWave size={22} color="var(--green-d)" />
          <span className="eyebrow" style={{ color: "var(--green-d)" }}>Haar</span>
          <span style={{ fontSize: 13, lineHeight: 1.35 }}>{phase.hair}</span>
        </Link>
      </div>

      <div className="card" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span className="eyebrow" style={{ color: "var(--muted)" }}>Ook goed deze fase</span>
        {phase.recipes.slice(1).map((slug) => {
          const r = getRecipe(slug)!;
          return (
            <Link key={slug} href={`/app/recept/${slug}`} style={{ display: "flex", gap: 12, alignItems: "center", textDecoration: "none" }}>
              <span className="dot" style={{ width: 40, height: 40, background: r.colors[0] }} />
              <span style={{ display: "flex", flexDirection: "column" }}>
                <strong>{r.name}</strong>
                <span style={{ fontSize: 13, color: "var(--muted)" }}>{r.short}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
