import type { PhaseId } from "@/lib/data";

type P = { size?: number; color?: string };

function Svg({ size = 24, color = "currentColor", children }: P & { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export const IconDrop = (p: P) => (
  <Svg {...p}>
    <path d="M12 3c3 4 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-7 6-11z" />
  </Svg>
);
export const IconLeaf = (p: P) => (
  <Svg {...p}>
    <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z" />
    <path d="M5 19l8-8" />
  </Svg>
);
export const IconSun = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Svg>
);
export const IconMoon = (p: P) => (
  <Svg {...p}>
    <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
  </Svg>
);
export const IconSparkle = (p: P) => (
  <Svg {...p}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
  </Svg>
);
export const IconWave = (p: P) => (
  <Svg {...p}>
    <path d="M4 8c3-3 5 3 8 0s5 3 8 0" />
    <path d="M4 14c3-3 5 3 8 0s5 3 8 0" />
  </Svg>
);
export const IconHome = (p: P) => (
  <Svg {...p}>
    <path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" />
  </Svg>
);
export const IconCycle = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 4v8l6 4" />
  </Svg>
);
export const IconLink = (p: P) => (
  <Svg {...p}>
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
    <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  </Svg>
);
export const IconBack = (p: P) => (
  <Svg {...p}>
    <path d="M15 5l-7 7 7 7" />
  </Svg>
);
export const IconHeart = (p: P) => (
  <Svg {...p}>
    <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
  </Svg>
);
export const IconLock = (p: P) => (
  <Svg {...p}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </Svg>
);
export const IconCheck = (p: P) => (
  <Svg {...p}>
    <path d="M5 12l5 5 9-10" />
  </Svg>
);

export function PhaseIcon({ id, ...p }: P & { id: PhaseId }) {
  if (id === "menstruatie") return <IconDrop {...p} />;
  if (id === "folliculair") return <IconLeaf {...p} />;
  if (id === "ovulatie") return <IconSun {...p} />;
  return <IconMoon {...p} />;
}

export function Logo({ size = 36, bg = "#FFF7F2" }: { size?: number; bg?: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background:
          "conic-gradient(#C2185B 0 64deg, #3F8F4E 64deg 167deg, #E07A1F 167deg 206deg, #6B4FA8 206deg 360deg)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span style={{ width: size / 2, height: size / 2, borderRadius: "50%", background: bg }} />
    </span>
  );
}

export const IconCart = (p: P) => (
  <Svg {...p}>
    <path d="M6 6h15l-2 9H8zM6 6L5 3H2" />
    <circle cx="9" cy="20" r="1" />
    <circle cx="18" cy="20" r="1" />
  </Svg>
);
export const IconBook = (p: P) => (
  <Svg {...p}>
    <rect x="4" y="4" width="7" height="7" rx="2" />
    <rect x="13" y="4" width="7" height="7" rx="2" />
    <rect x="4" y="13" width="7" height="7" rx="2" />
    <rect x="13" y="13" width="7" height="7" rx="2" />
  </Svg>
);
