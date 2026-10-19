/*
 * File: IdeActivityBar.jsx
 * Purpose: Provide shared icon-only navigation for ScamShield KE pages.
 */

import Link from "next/link";

const tools = [
  { href: "/", label: "Analyzer", icon: "⌕", page: "scanner" },
  { href: "/history", label: "Analysis history", icon: "◷", page: "history" },
  { href: "/safety", label: "Safety guide", icon: "▤", page: "safety" },
];

export default function IdeActivityBar({ activePage = "scanner" }) {
  return (
    <nav className="ide-activitybar" aria-label="Workspace tools">
      {tools.map((tool) => (
        <Link
          key={tool.page}
          href={tool.href}
          className={`activity-button ${
            activePage === tool.page ? "active" : ""
          }`}
          aria-label={tool.label}
          aria-current={activePage === tool.page ? "page" : undefined}
          title={tool.label}
        >
          <span aria-hidden="true">{tool.icon}</span>
        </Link>
      ))}

      <div className="activity-spacer" />

      <Link
        href="/about"
        className={`activity-button activity-info ${
          activePage === "about" ? "active" : ""
        }`}
        aria-label="About ScamShield"
        aria-current={activePage === "about" ? "page" : undefined}
        title="About ScamShield"
      >
        <span aria-hidden="true">ⓘ</span>
      </Link>
    </nav>
  );
}
