import Nav from "../../components/Nav";

const cards = [
  { label: "Matches Completed", value: "42/90" },
  { label: "Top EPA Mover", value: "2056 (+8.4)" },
  { label: "Underrated Alerts", value: "6" },
  { label: "Model Confidence", value: "78%" }
];

export default function DashboardPage() {
  return (
    <main>
      <Nav />
      <section style={{ padding: 24 }}>
        <h1>Event Dashboard</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {cards.map((card) => (
            <div key={card.label} style={{ background: "#111827", border: "1px solid #243244", borderRadius: 10, padding: 16 }}>
              <div style={{ color: "#93c5fd" }}>{card.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{card.value}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
