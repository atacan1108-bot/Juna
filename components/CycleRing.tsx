import { phaseRanges } from "@/lib/cycle";

export default function CycleRing({
  day,
  cycleLength,
  periodLength,
  size = 112,
}: {
  day: number;
  cycleLength: number;
  periodLength: number;
  size?: number;
}) {
  const r = phaseRanges(cycleLength, periodLength);
  const deg = (d: number) => (d / cycleLength) * 360;
  const bg = `conic-gradient(#C2185B 0 ${deg(r.menstruatie[1])}deg, #3F8F4E ${deg(r.menstruatie[1])}deg ${deg(
    r.folliculair[1]
  )}deg, #E07A1F ${deg(r.folliculair[1])}deg ${deg(r.ovulatie[1])}deg, #6B4FA8 ${deg(r.ovulatie[1])}deg 360deg)`;
  const angle = ((day - 0.5) / cycleLength) * 2 * Math.PI;
  const radius = size / 2 - 7;
  const mx = size / 2 + radius * Math.sin(angle) - 8;
  const my = size / 2 - radius * Math.cos(angle) - 8;
  return (
    <div
      role="img"
      aria-label={`Cyclusdag ${day} van ${cycleLength}`}
      style={{ position: "relative", width: size, height: size, flexShrink: 0, borderRadius: "50%", background: bg }}
    >
      <div
        style={{
          position: "absolute",
          inset: 14,
          borderRadius: "50%",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 11, color: "var(--muted)" }}>dag</span>
        <span className="display" style={{ fontSize: size * 0.28, lineHeight: 1 }}>
          {day}
        </span>
      </div>
      <span
        style={{
          position: "absolute",
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#fff",
          border: "3px solid var(--ink)",
          left: mx,
          top: my,
        }}
      />
    </div>
  );
}
