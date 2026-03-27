import Nav from "../../../components/Nav";

export default function MatchScoutingPage() {
  return (
    <main>
      <Nav />
      <section style={{ padding: 24 }}>
        <h1>Live Match Scouting</h1>
        <p>Mobile-first data entry form placeholder (connect to /api/v1/scouting/match).</p>
        <button style={{ padding: "10px 14px", borderRadius: 8, background: "#22c55e", border: "none" }}>Submit Entry</button>
      </section>
    </main>
  );
}
