"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconCycle, IconHome, IconLink, IconSparkle } from "./Icons";

const TABS = [
  { href: "/app", label: "Vandaag", Icon: IconHome },
  { href: "/app/fases", label: "Fases", Icon: IconCycle },
  { href: "/app/glow", label: "Glow & haar", Icon: IconSparkle },
  { href: "/app/koppelen", label: "Koppelen", Icon: IconLink },
];

export default function TabBar() {
  const path = usePathname();
  if (path === "/app/welkom") return null;
  return (
    <nav aria-label="Tabbalk" className="tabbar">
      {TABS.map(({ href, label, Icon }) => {
        const active = href === "/app" ? path === "/app" : path.startsWith(href);
        return (
          <Link key={href} href={href} className="tab" aria-current={active ? "page" : undefined}>
            <Icon />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
