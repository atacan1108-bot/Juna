"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { computeToday, useCycle } from "@/lib/cycle";
import { getPhase, getRecipe } from "@/lib/data";
import { AMT, ING, weekId } from "@/lib/ingredients";
import { dezeSet, lijstStore, schudVolgende, vastStore, volgendeSet, volgendeStore, weekOver, zetOpLijst, type LijstItem } from "@/lib/mijn";
import { useVoorkeuren } from "@/lib/voorkeuren";

function Rij({ set }: { set: string[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {set.map((id) => (
        <div key={id} className="lj-li" style={{ cursor: "default" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/fruit/${id}.svg`} alt="" />
          <span className="lj-n">
            {ING[id].naam}
            <small>{AMT[id]}</small>
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Lijstje() {
  const router = useRouter();
  const cycle = useCycle();
  const { uitgesloten } = useVoorkeuren();
  const vast = vastStore.useHook();
  const lijst = lijstStore.useHook();
  const opgeslagen = volgendeStore.useHook();
  const [week, setWeek] = useState<"deze" | "volgende">("deze");
  const [eigen, setEigen] = useState("");
  const [status, setStatus] = useState("");
  const [vervaag, setVervaag] = useState(false);

  useEffect(() => {
    if (cycle === null) router.replace("/app/welkom");
  }, [cycle, router]);

  if (!cycle) return <main className="app-main" aria-busy="true" />;

  const nu = computeToday(cycle).phase;
  const straks = computeToday(cycle, weekOver(7)).phase;
  const fase = week === "deze" ? nu : straks;
  const set = week === "deze" ? dezeSet(nu, uitgesloten, vast) : volgendeSet(straks, uitgesloten, vast, opgeslagen);
  const naam = getRecipe(getPhase(fase).recipes[0])?.name ?? getPhase(fase).label;
  const label = `${weekId(week === "deze" ? new Date() : weekOver(7))}:${fase}`;

  const zet = (index: number, wijzig: (i: LijstItem) => LijstItem | null) => {
    lijstStore.bewaar(lijst.flatMap((i, n) => (n === index ? (wijzig(i) ? [wijzig(i) as LijstItem] : []) : [i])));
  };
  const groepen: { titel: string; filter: (i: LijstItem) => boolean }[] = [
    { titel: "Fruit", filter: (i) => !!i.ing && ING[i.ing].soort === "fruit" },
    { titel: "Groente", filter: (i) => !!i.ing && ING[i.ing].soort === "groente" },
    { titel: "Overig", filter: (i) => !!i.ing && (ING[i.ing].soort === "kruid" || ING[i.ing].soort === "zaad") },
    { titel: "Eigen items", filter: (i) => !i.ing },
  ];
  const open = lijst.filter((i) => !i.klaar).length;

  return (
    <main className="app-main">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h1 className="display" style={{ fontSize: 30, lineHeight: 1.05 }}>Boodschappen</h1>
        <span style={{ fontSize: 13, color: "var(--muted)" }}>{lijst.length ? `${lijst.length - open} van ${lijst.length}` : ""}</span>
      </div>

      <div className="seg2" role="group" aria-label="Kies de week">
        <button type="button" aria-pressed={week === "deze"} onClick={() => setWeek("deze")}>Deze week</button>
        <button type="button" aria-pressed={week === "volgende"} onClick={() => setWeek("volgende")}>Volgende week</button>
      </div>

      {set.length ? (
        <div className="card" style={{ background: getPhase(fase).tint, borderRadius: 22, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span className="display" style={{ fontSize: 24, color: getPhase(fase).dark }}>{naam}{week === "volgende" ? ", verwacht" : ""}</span>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>4 ingrediënten</span>
          </div>
          {week === "volgende" ? (
            <span style={{ fontSize: 13, lineHeight: 1.45, color: "var(--ink-2)" }}>
              Volgens je cyclus zit je volgende week waarschijnlijk in deze fase. Dat kan een paar dagen verschuiven.
            </span>
          ) : null}
          <div style={{ opacity: vervaag ? 0 : 1, transition: "opacity .18s" }}>
            <Rij set={set} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: week === "volgende" ? "1fr 1fr" : "1fr", gap: 8 }}>
            <button
              type="button"
              className="btn btn-dark"
              style={{ minHeight: 48, borderRadius: 16 }}
              onClick={() => setStatus(zetOpLijst(set, label) ? "Op je lijstje gezet." : "Stond al op je lijstje.")}
            >
              Zet op mijn lijstje
            </button>
            {week === "volgende" ? (
              <button
                type="button"
                className="btn btn-light"
                style={{ minHeight: 48, borderRadius: 16 }}
                onClick={() => {
                  setVervaag(true);
                  setTimeout(() => {
                    schudVolgende(straks, set, uitgesloten, vast);
                    setVervaag(false);
                    setStatus("Nieuw sapje voor volgende week. Het blijft staan tot de week begint.");
                  }, 180);
                }}
              >
                Schud
              </button>
            ) : null}
          </div>
          <span role="status" aria-live="polite" style={{ fontSize: 13, minHeight: 18 }}>{status}</span>
        </div>
      ) : (
        <p style={{ fontSize: 14, lineHeight: 1.5 }}>Met jouw allergieën en voorkeuren heeft Juna voor deze fase geen sapje. Pas je voorkeuren aan.</p>
      )}

      <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Mijn lijstje</h2>
      {lijst.length === 0 ? (
        <p style={{ fontSize: 14, lineHeight: 1.5, color: "var(--ink-2)", margin: 0 }}>
          Nog leeg. Zet een sapje op je lijstje of voeg hieronder zelf iets toe.
        </p>
      ) : (
        <div className="card" style={{ borderRadius: 22, display: "flex", flexDirection: "column" }}>
          {groepen.map((g) => {
            const items = lijst.map((i, n) => ({ i, n })).filter((x) => g.filter(x.i));
            if (!items.length) return null;
            return (
              <div key={g.titel} style={{ display: "flex", flexDirection: "column" }}>
                <span className="lj-groep">{g.titel}</span>
                {items.map(({ i, n }) => (
                  <button key={n} type="button" className="lj-li" aria-pressed={i.klaar} onClick={() => zet(n, (x) => ({ ...x, klaar: !x.klaar }))}>
                    <span className="lj-cb" aria-hidden="true">✓</span>
                    {i.ing ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`/fruit/${i.ing}.svg`} alt="" />
                    ) : null}
                    <span className="lj-n">
                      {i.naam}
                      <small>{i.ing ? `${AMT[i.ing]}${i.bron.length > 1 ? ` · ${i.bron.length} sapjes` : ""}` : "Eigen item"}</small>
                    </span>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      )}

      <form
        style={{ display: "flex", gap: 8 }}
        onSubmit={(e) => {
          e.preventDefault();
          const naam = eigen.trim();
          if (!naam) return;
          lijstStore.bewaar([...lijst, { naam: naam.slice(0, 60), bron: [], klaar: false }]);
          setEigen("");
        }}
      >
        <div className="field" style={{ flex: 1 }}>
          <input aria-label="Eigen item toevoegen" placeholder="Eigen item toevoegen" value={eigen} onChange={(e) => setEigen(e.target.value)} maxLength={60} />
        </div>
        <button type="submit" className="btn btn-light" style={{ minHeight: 48, borderRadius: 14, padding: "0 18px" }} aria-label="Toevoegen">+</button>
      </form>
      {lijst.some((i) => i.klaar) ? (
        <button type="button" className="btn btn-light btn-block" style={{ minHeight: 48, borderRadius: 16 }} onClick={() => lijstStore.bewaar(lijst.filter((i) => !i.klaar))}>
          Haal afgevinkte weg
        </button>
      ) : null}
      <span style={{ fontSize: 12.5, lineHeight: 1.45, color: "var(--ink-2)" }}>
        Juna houdt rekening met je allergieën en voorkeuren. Zet je meerdere weken op je lijstje, dan telt Juna dezelfde ingrediënten bij elkaar op. Je lijstje blijft alleen op dit toestel.
      </span>
    </main>
  );
}
