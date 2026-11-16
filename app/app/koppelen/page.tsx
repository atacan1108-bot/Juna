"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconLock } from "@/components/Icons";
import { clearCycle, saveCycle, useCycle } from "@/lib/cycle";

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(isoDaysAgo(0));
    if (cycle) {
      setStart(cycle.lastPeriodStart);
      setLength(cycle.cycleLength);
      setPeriod(cycle.periodLength);
    } else if (cycle === null) {
      setStart(isoDaysAgo(14));
    }
  }, [cycle]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!start) return setError("Vul de eerste dag van je laatste menstruatie in.");
    if (start > isoDaysAgo(0)) return setError("Deze datum ligt in de toekomst.");
    if (length < 21 || length > 40) return setError("Een cyclus duurt meestal tussen 21 en 40 dagen.");
    if (period < 2 || period > 8) return setError("Een menstruatie duurt meestal 2 tot 8 dagen.");
    saveCycle({ lastPeriodStart: start, cycleLength: length, periodLength: period });
    router.push("/app");
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
          <div className="field">
            <label htmlFor="len">Cyclusduur</label>
            <input id="len" type="number" inputMode="numeric" min={21} max={40} value={length} onChange={(e) => setLength(Number(e.target.value))} aria-describedby="len-hint" />
            <span id="len-hint" className="hint">dagen (meestal 28)</span>
          </div>
          <div className="field">
            <label htmlFor="per">Menstruatie</label>
            <input id="per" type="number" inputMode="numeric" min={2} max={8} value={period} onChange={(e) => setPeriod(Number(e.target.value))} aria-describedby="per-hint" />
            <span id="per-hint" className="hint">dagen (meestal 5)</span>
          </div>
        </div>
        {error && (
          <p role="alert" style={{ color: "var(--berry-d)", fontSize: 14, fontWeight: 700 }}>{error}</p>
        )}
        <button type="submit" className="btn btn-dark btn-block" style={{ minHeight: 56, borderRadius: 18 }}>
          Toon mijn sap van deze week
        </button>
      </form>

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
