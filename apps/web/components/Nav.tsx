import Link from "next/link";

const links = [
  ["Dashboard", "/dashboard"],
  ["Teams", "/teams/2056"],
  ["Match", "/matches/2026miket_qm42"],
  ["Scouting", "/scouting/match"],
  ["Alliance", "/alliance"]
] as const;

export default function Nav() {
  return (
    <nav style={{ display: "flex", gap: 12, padding: 16, borderBottom: "1px solid #243244" }}>
      {links.map(([label, href]) => (
        <Link key={href} href={href} style={{ color: "#7dd3fc", textDecoration: "none", fontWeight: 600 }}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
