import Nav from "../../../components/Nav";

export default async function MatchPage({ params }: { params: Promise<{ matchKey: string }> }) {
  const { matchKey } = await params;

  return (
    <main>
      <Nav />
      <section style={{ padding: 24 }}>
        <h1>Match Preview: {matchKey}</h1>
        <p>Red Win Probability: 62%</p>
        <p>Likely RPs: Red 2.3 • Blue 1.7</p>
        <p>Key swing factor: Endgame consistency under pressure defense.</p>
      </section>
    </main>
  );
}
