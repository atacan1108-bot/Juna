import Link from "next/link";
import { Logo } from "@/components/Icons";

const blobs = [
  { l: 6, t: 40, s: 64, c: "#C2185B" },
  { l: 264, t: 20, s: 56, c: "#3F8F4E" },
  { l: 270, t: 236, s: 70, c: "#E07A1F" },
  { l: 30, t: 246, s: 44, c: "#F3D36B" },
];

export default function Welkom() {
  return (
    <main className="app-main" style={{ gap: 28, paddingBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Logo size={30} />
        <span className="display" style={{ fontSize: 24 }}>juna</span>
      </div>

      <div aria-hidden="true" style={{ position: "relative", height: 320, width: 340, alignSelf: "center", flexShrink: 0 }}>
        <div style={{ position: "absolute", left: 20, top: 10, width: 300, height: 300, borderRadius: "50%", background: "conic-gradient(#FBE3EC 0 64deg, #E2F1E0 64deg 167deg, #FDEBD6 167deg 206deg, #ECE5F7 206deg 360deg)" }} />
        <div style={{ position: "absolute", left: 70, top: 60, width: 200, height: 200, borderRadius: "50%", background: "var(--ground)" }} />
        <div style={{ position: "absolute", left: 118, top: 96, width: 104, height: 136, borderRadius: "18px 18px 34px 34px", background: "#6B4FA8" }} />
        <div style={{ position: "absolute", left: 118, top: 96, width: 104, height: 30, borderRadius: "18px 18px 0 0", background: "#8A70C4" }} />
        <div style={{ position: "absolute", left: 176, top: 58, width: 8, height: 70, borderRadius: 4, background: "#E07A1F", transform: "rotate(14deg)" }} />
        {blobs.map((b, i) => (
          <div key={i} style={{ position: "absolute", left: b.l, top: b.t, width: b.s, height: b.s, borderRadius: "50%", background: b.c }} />
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <h1 className="display" style={{ fontSize: 40, lineHeight: 1, letterSpacing: -1 }}>
          Drink op het ritme van je cyclus
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.5, color: "var(--ink-2)" }}>
          Elke fase het juiste sapje, met uitleg waarom. Voor je energie, je huid en je haar.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: "auto" }}>
        <Link href="/app/koppelen" className="btn btn-dark btn-block" style={{ minHeight: 56, borderRadius: 18 }}>
          Aan de slag
        </Link>
        <Link href="/" className="btn btn-block" style={{ border: "none", background: "transparent", fontWeight: 500, fontSize: 15 }}>
          Meer over Juna
        </Link>
      </div>
    </main>
  );
}
