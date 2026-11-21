"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconLock } from "@/components/Icons";
import { checkStarts, clearCycle, gemiddelden, loadHistory, saveCycle, saveHistory, useCycle } from "@/lib/cycle";
import { clearVoorkeuren } from "@/lib/voorkeuren";

function isoDaysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

const CONNECTORS = [
  { l: "F", n: "Flo", d: "Via Health Connect / Apple Health", bg: "var(--berry-t)", c: "var(--berry-d)" },
  { l: "A", n: "Apple Health", d: "iPhone & Apple Watch", bg: "var(--orange-t)", c: "var(--orange-d)" },
  { l: "G", n: "Health Connect", d: "Android", bg: "var(--green-t)", c: "var(--green-d)" },
];

export default function Koppelen() {
  const router = useRouter();
  const cycle = useCycle();
  const [start, setStart] = useState("");
  const [today, setToday] = useState<string | undefined>(undefined);
  const [length, setLength] = useState(28);
  const [period, setPeriod] = useState(5);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [eerder, setEerder] = useState<{ start: string; period: string }[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(isoDaysAgo(0));
    if (cycle) {
      setStart(cycle.lastPeriodStart);
      setLength(cycle.cycleLength);
      setPeriod(cycle.periodLength);
      setEerder(loadHistory().map((e) => ({ start: e.start, period: e.periodLength ? String(e.periodLength) : "" })));
    } else if (cycle === null) {
      setStart(isoDaysAgo(14));
    }
  }, [cycle]);

  const starts = [start, ...eerder.map((r) => r.start)].filter(Boolean).sort().reverse();
  const calc = eerder.length
    ? gemiddelden(starts, [period, ...eerder.map((r) => (r.period ? Number(r.period) : undefined))])
    : null;
  const eigenLengte = calc?.cycleLength ?? length;
  const eigenPeriode = calc?.periodLength ?? period;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!start) return setError("Vul de eerste dag van je laatste menstruatie in.");
    if (start > isoDaysAgo(0)) return setError("Deze datum ligt in de toekomst.");
    if (eigenLengte < 21 || eigenLengte > 40) return setError("Een cyclus duurt meestal tussen 21 en 40 dagen.");
    if (eigenPeriode < 2 || eigenPeriode > 8) return setError("Een menstruatie duurt meestal 2 tot 8 dagen.");
    if (eerder.some((r) => r.period && (Number(r.period) < 2 || Number(r.period) > 8))) return setError("Een menstruatie duurt meestal 2 tot 8 dagen.");
    if (eerder.some((r) => r.start && r.start >= start)) return setError("Eerdere menstruaties moeten vóór je laatste menstruatie liggen.");
    const alle = [start, ...eerder.map((r) => r.start)];
    if (alle.some((d) => d && d > isoDaysAgo(0))) return setError("Een datum ligt in de toekomst.");
    const fout = checkStarts([...alle].sort().reverse(), isoDaysAgo(0));
    if (fout) return setError(fout);
    const nieuw = !cycle;
    saveHistory(eerder.map((r) => ({ start: r.start, periodLength: r.period ? Number(r.period) : undefined })));
    saveCycle({ lastPeriodStart: start, cycleLength: eigenLengte, periodLength: eigenPeriode, irregular: calc?.irregular });
    router.push(nieuw ? "/app/voorkeuren?eerst=1" : "/app");
  }

  return (
    <main className="app-main">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <h1 className="display" style={{ fontSize: 30, lineHeight: 1.05 }}>Koppel je cyclus</h1>
        <p style={{ fontSize: 15, lineHeight: 1.45, color: "var(--ink-2)" }}>
          Juna gebruikt je menstruatiedagen om te bepalen in welke fase je zit, zodat je sapjes automatisch meeschuiven.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {CONNECTORS.map((x) => (
          <div key={x.n} className="card" style={{ display: "flex", gap: 14, alignItems: "center", borderRadius: 22 }}>
            <span className="letter-tile" style={{ width: 48, height: 48, borderRadius: 14, background: x.bg, color: x.c, fontSize: 20 }}>{x.l}</span>
            <span style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
              <strong>{x.n}</strong>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>{x.d}</span>
            </span>
            <button
              type="button"
              className="btn btn-light"
              style={{ minHeight: 44, padding: "0 14px", fontSize: 14, borderRadius: 14 }}
              onClick={() => setNote(`${x.n} koppelen komt in de mobiele app. Vul hieronder voorlopig zelf je datum in.`)}
            >
              Koppel
            </button>
          </div>
        ))}
        {note && (
          <p role="status" style={{ fontSize: 13, color: "var(--violet-d)", background: "var(--violet-t)", padding: "10px 14px", borderRadius: 14 }}>
            {note}
          </p>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--muted)", fontSize: 13 }}>
        <span style={{ flex: 1, height: 1, background: "#E6D5DF" }} />
        of vul zelf in
        <span style={{ flex: 1, height: 1, background: "#E6D5DF" }} />
      </div>

      <form onSubmit={submit} className="card" style={{ display: "flex", flexDirection: "column", gap: 16, borderRadius: 22 }} noValidate>
        <div className="field">
          <label htmlFor="start">Eerste dag van je laatste menstruatie</label>
          <input id="start" type="date" value={start} max={today} onChange={(e) => setStart(e.target.value)} required />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <strong style={{ fontSize: 15 }}>Eerdere menstruaties (optioneel)</strong>
          <span style={{ fontSize: 13, lineHeight: 1.45, color: "var(--ink-2)" }}>
            Weet je ook de maanden daarvoor? Voeg ze toe en Juna rekent je gemiddelde cyclus uit, zodat het advies beter past.
          </span>
          {eerder.map((r, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 72px 44px", gap: 8, alignItems: "end" }}>
              <div className="field">
                <label htmlFor={`e${i}`}>{i + 1} {i === 0 ? "maand" : "maanden"} eerder</label>
                <input id={`e${i}`} type="date" value={r.start} max={today} onChange={(ev) => setEerder((l) => l.map((x, j) => (j === i ? { ...x, start: ev.target.value } : x)))} />
              </div>
              <div className="field">
                <label htmlFor={`p${i}`}>Dagen</label>
                <input id={`p${i}`} type="number" inputMode="numeric" min={2} max={8} placeholder="5" value={r.period} onChange={(ev) => setEerder((l) => l.map((x, j) => (j === i ? { ...x, period: ev.target.value } : x)))} />
              </div>
              <button type="button" aria-label={`Verwijder maand ${i + 1}`} onClick={() => setEerder((l) => l.filter((_, j) => j !== i))} style={{ minHeight: 44, border: "none", background: "transparent", fontSize: 20, cursor: "pointer", color: "var(--berry-d)" }}>
                ×
              </button>
            </div>
          ))}
          {eerder.length < 11 && (
            <button type="button" className="btn btn-light" style={{ minHeight: 44, borderRadius: 14, fontSize: 14 }} onClick={() => setEerder((l) => [...l, { start: "", period: "" }])}>
              Maand eerder toevoegen
            </button>
          )}
          {calc?.cycleLength ? (
            <span role="status" style={{ fontSize: 13, color: "var(--violet-d)", background: "var(--violet-t)", padding: "8px 12px", borderRadius: 12 }}>
              Gemiddeld {calc.cycleLength} dagen per cyclus, berekend uit {calc.aantal} {calc.aantal === 1 ? "cyclus" : "cycli"}.
              {calc.irregular ? " Je cyclus varieert nogal, dus de fase-inschatting is minder zeker." : ""}
            </span>
          ) : null}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
          <div className="field">
            <label htmlFor="len">Cyclusduur</label>
            <input id="len" type="number" inputMode="numeric" min={21} max={40} value={eigenLengte} disabled={!!calc?.cycleLength} onChange={(e) => setLength(Number(e.target.value))} aria-describedby="len-hint" />
            <span id="len-hint" className="hint">{calc?.cycleLength ? "berekend uit je maanden" : "dagen (meestal 28)"}</span>
          </div>
          <div className="field">
            <label htmlFor="per">Menstruatie</label>
            <input id="per" type="number" inputMode="numeric" min={2} max={8} value={eigenPeriode} disabled={!!calc?.periodLength} onChange={(e) => setPeriod(Number(e.target.value))} aria-describedby="per-hint" />
            <span id="per-hint" className="hint">{calc?.periodLength ? "berekend uit je maanden" : "dagen (meestal 5)"}</span>
          </div>
        </div>
        {error && (
          <p role="alert" style={{ color: "var(--berry-d)", fontSize: 14, fontWeight: 700 }}>{error}</p>
        )}
        <button type="submit" className="btn btn-dark btn-block" style={{ minHeight: 56, borderRadius: 18 }}>
          Toon mijn sap van deze week
        </button>
      </form>

      <Link href="/app/voorkeuren" className="btn btn-light btn-block" style={{ minHeight: 48, borderRadius: 16, fontSize: 15 }}>
        Allergieën en voorkeuren
      </Link>

      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "0 4px" }}>
        <IconLock size={20} color="var(--violet-d)" />
        <span style={{ fontSize: 13, lineHeight: 1.45, color: "var(--ink-2)" }}>
          Je gegevens blijven alleen op dit toestel opgeslagen. Er wordt niets naar een server gestuurd.
        </span>
      </div>

      {cycle && (
        <button
          type="button"
          onClick={() => {
            clearCycle();
            clearVoorkeuren();
            router.push("/app/welkom");
          }}
          style={{ background: "none", border: "none", color: "var(--berry-d)", fontWeight: 700, fontSize: 14, minHeight: 44, cursor: "pointer" }}
        >
          Wis mijn gegevens
        </button>
      )}
    </main>
  );
}
