import Nav from "../../../components/Nav";

export default function PitScoutingPage() {
  return (
    <main>
      <Nav />
      <section style={{ padding: 24 }}>
        <h1>Pit Scouting</h1>
        <p>Capture drivetrain, intake style, climb options, and repair notes.</p>
        <button style={{ padding: "10px 14px", borderRadius: 8, background: "#0ea5e9", border: "none", color: "#fff" }}>Save Pit Entry</button>
      </section>
    </main>
  );
}
