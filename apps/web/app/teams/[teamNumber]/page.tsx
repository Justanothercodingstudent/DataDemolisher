import Nav from "../../../components/Nav";

export default async function TeamPage({ params }: { params: Promise<{ teamNumber: string }> }) {
  const { teamNumber } = await params;

  return (
    <main>
      <Nav />
      <section style={{ padding: 24 }}>
        <h1>Team {teamNumber}</h1>
        <p>Role: Primary Scorer • Secondary: Climb Specialist</p>
        <ul>
          <li>EPA Total: 48.2</li>
          <li>Auto Success: 82%</li>
          <li>Reliability: 91/100</li>
          <li>Defense Resilience: High</li>
        </ul>
      </section>
    </main>
  );
}
