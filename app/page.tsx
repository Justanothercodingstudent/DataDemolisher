'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import * as THREE from 'three';
import { LiveData } from '@/lib/types';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const defaultData: LiveData = {
  ranking: 7,
  winRate: 0.81,
  epa: { auto: 28.4, teleop: 52.1, total: 86.2 },
  matchHistory: [
    { key: 'qm1', result: 'W', predictedWin: 0.83 },
    { key: 'qm6', result: 'W', predictedWin: 0.77 },
    { key: 'qm13', result: 'L', predictedWin: 0.49 },
    { key: 'sf2m1', result: 'W', predictedWin: 0.72 }
  ]
};

const robotSystems = [
  { id: 'swerve', title: 'Swerve Drive', detail: '4-module autonomous pathing at 4.8 m/s with auto-balancing control loops.' },
  { id: 'shooter', title: 'Shooter', detail: 'Dual-wheel variable velocity launcher with closed-loop RPM and dynamic angle control.' },
  { id: 'intake', title: 'Intake', detail: 'Ground + station intake with anti-jam state machine and beam-break feedback.' },
  { id: 'vision', title: 'Vision', detail: 'PhotonVision + Limelight fusion for AprilTag localization and note tracking.' }
];

const scoutingTeams = [
  { team: 'frc254', epa: 92.4, consistency: 9.7, defense: 6.8 },
  { team: 'frc1678', epa: 88.1, consistency: 9.4, defense: 7.1 },
  { team: 'frc1323', epa: 84.8, consistency: 8.9, defense: 7.6 },
  { team: 'frc2910', epa: 83.2, consistency: 8.7, defense: 8.2 }
];

function RobotRender() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mountNode.clientWidth / 320, 0.1, 1000);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountNode.clientWidth, 320);
    mountNode.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1.5, 1);
    const material = new THREE.MeshStandardMaterial({ color: '#5f7bff', wireframe: true });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const glow = new THREE.PointLight(0xa855f7, 20, 35);
    glow.position.set(2, 3, 4);
    scene.add(glow);

    const ambient = new THREE.AmbientLight(0x7799ff, 1.1);
    scene.add(ambient);

    let raf = 0;
    const animate = () => {
      mesh.rotation.x += 0.005;
      mesh.rotation.y += 0.008;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!mountNode) return;
      camera.aspect = mountNode.clientWidth / 320;
      camera.updateProjectionMatrix();
      renderer.setSize(mountNode.clientWidth, 320);
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      mountNode.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="h-[320px] w-full" />;
}

export default function HomePage() {
  const [liveData, setLiveData] = useState<LiveData>(defaultData);
  const [activeSystem, setActiveSystem] = useState(robotSystems[0]);
  const [devMode, setDevMode] = useState(false);
  const [theme, setTheme] = useState<'mission' | 'driver'>('mission');
  const [konami, setKonami] = useState<string[]>([]);

  const { scrollYProgress } = useScroll();
  const spring = useSpring(scrollYProgress, { stiffness: 120, damping: 22 });
  const width = useTransform(spring, [0, 1], ['0%', '100%']);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/live');
      const data = await res.json();
      setLiveData(data);
    };
    load();
    const timer = setInterval(load, 45000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    const onKey = (event: KeyboardEvent) => {
      setKonami((prev) => {
        const next = [...prev, event.key].slice(-seq.length);
        if (next.join('|').toLowerCase() === seq.join('|').toLowerCase()) {
          setDevMode(true);
        }
        return next;
      });
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const epaChart = useMemo(
    () => ({
      labels: ['Auto', 'Teleop', 'Total'],
      datasets: [
        {
          label: 'EPA',
          data: [liveData.epa.auto, liveData.epa.teleop, liveData.epa.total],
          backgroundColor: ['#4D7CFF', '#A855F7', '#F5C451']
        }
      ]
    }),
    [liveData]
  );

  const predictorData = useMemo(
    () => ({
      labels: liveData.matchHistory.map((m) => m.key),
      datasets: [
        {
          label: 'Win Probability',
          data: liveData.matchHistory.map((m) => m.predictedWin * 100),
          borderColor: '#F5C451',
          backgroundColor: 'rgba(245,196,81,.25)',
          tension: 0.4
        }
      ]
    }),
    [liveData]
  );

  return (
    <main className="relative overflow-hidden px-4 pb-16 md:px-8">
      <motion.div style={{ width }} className="fixed left-0 top-0 z-50 h-[3px] bg-gradient-to-r from-neonBlue via-neonPurple to-neonGold" />
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-40" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center gap-8 py-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(76,123,255,0.25),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(168,85,247,0.2),transparent_40%)]" />

        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl text-4xl font-black uppercase leading-tight md:text-7xl">
          We Don’t Build Robots. <span className="text-neonGold">We Build Legends.</span>
        </motion.h1>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="glass rounded-2xl p-5 shadow-neon">
            <RobotRender />
            <p className="mt-3 text-sm text-slate-300">AI-rendered robot core • animated trajectory field • optimized WebGL loop</p>
          </motion.div>

          <div className="grid gap-4">
            <div className="glass rounded-2xl p-5">
              <h2 className="text-xl font-semibold">Live Competitive Snapshot</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-950/40 p-3">Ranking <span className="float-right text-neonBlue">#{liveData.ranking}</span></div>
                <div className="rounded-xl bg-slate-950/40 p-3">Win rate <span className="float-right text-neonGold">{(liveData.winRate * 100).toFixed(1)}%</span></div>
                <div className="rounded-xl bg-slate-950/40 p-3">Auto EPA <span className="float-right text-neonBlue">{liveData.epa.auto}</span></div>
                <div className="rounded-xl bg-slate-950/40 p-3">Teleop EPA <span className="float-right text-neonPurple">{liveData.epa.teleop}</span></div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {['Explore Robot', 'View Matches', 'Join the Team'].map((cta) => (
                <motion.button key={cta} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }} className="rounded-xl border border-blue-200/25 bg-slate-900/60 px-4 py-2 text-sm font-semibold shadow-glow transition hover:border-neonBlue">
                  {cta}
                </motion.button>
              ))}
              <button onClick={() => setTheme((t) => (t === 'mission' ? 'driver' : 'mission'))} className="rounded-xl border border-neonGold/40 px-4 py-2 text-sm">
                Theme: {theme === 'mission' ? 'Mission Control' : 'Driver Station'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 grid w-full max-w-7xl gap-6 lg:grid-cols-2">
        <article className="glass rounded-2xl p-5">
          <h3 className="section-title">Live Data & Predictions</h3>
          <p className="mt-2 text-sm text-slate-300">Auto-refreshing data pipeline from The Blue Alliance + Statbotics APIs for match trends and EPA.</p>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <Doughnut data={epaChart} />
            <Line data={predictorData} />
          </div>
        </article>
        <article className="glass rounded-2xl p-5">
          <h3 className="section-title">Alliance Selection Simulator</h3>
          <p className="mt-2 text-sm text-slate-300">Drag-ready concept UI for scouting captains to test alliance combinations.</p>
          <div className="mt-4 space-y-3">
            {scoutingTeams.map((team) => (
              <motion.div key={team.team} whileHover={{ x: 4 }} className="rounded-xl border border-white/10 bg-slate-900/40 p-3 text-sm">
                <span className="font-semibold text-neonBlue">{team.team}</span>
                <span className="ml-4 text-slate-300">EPA {team.epa}</span>
                <span className="ml-4 text-slate-300">Consistency {team.consistency}</span>
                <span className="ml-4 text-slate-300">Defense {team.defense}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-slate-950/50 p-3 text-sm text-neonGold">AI Suggestion: Best value second-round pick = frc1323</div>
        </article>
      </section>

      <section className="mx-auto mt-8 w-full max-w-7xl glass rounded-2xl p-5">
        <h3 className="section-title">Robot Systems // Inside the Brain</h3>
        <div className="mt-4 grid gap-6 md:grid-cols-[.8fr_1.2fr]">
          <div className="space-y-3">
            {robotSystems.map((system) => (
              <button key={system.id} onClick={() => setActiveSystem(system)} className={`w-full rounded-xl border px-4 py-3 text-left ${activeSystem.id === system.id ? 'border-neonBlue bg-neonBlue/20' : 'border-white/10 bg-slate-900/35'}`}>
                {system.title}
              </button>
            ))}
          </div>
          <motion.div key={activeSystem.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-slate-950/45 p-4">
            <h4 className="text-xl font-semibold text-neonPurple">{activeSystem.title}</h4>
            <p className="mt-2 text-slate-300">{activeSystem.detail}</p>
            <pre className="mt-4 overflow-auto rounded-lg bg-black/40 p-3 text-xs text-emerald-300">{`// WPILib command sample
new SwerveAutoAlign(drivetrain, vision)
  .withHeadingTarget(FieldPose.SPEAKER)
  .schedule();`}</pre>
            <div className="mt-3 rounded-lg border border-neonGold/30 bg-gradient-to-r from-neonBlue/10 to-neonPurple/10 p-3 text-sm">Pose Estimation: AprilTag fused pose ±0.09m @ 50Hz.</div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto mt-8 grid w-full max-w-7xl gap-6 lg:grid-cols-2">
        <article className="glass rounded-2xl p-5">
          <h3 className="section-title">Media & Season Timeline</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((id) => (
              <motion.div key={id} whileHover={{ scale: 1.03 }} className="h-28 rounded-xl bg-gradient-to-br from-neonBlue/30 to-neonPurple/20 p-2 text-xs">
                Cinematic Clip {id}
              </motion.div>
            ))}
          </div>
          <ul className="mt-5 space-y-2 text-sm text-slate-300">
            <li>2022 — Rookie launch & first playoff appearance</li>
            <li>2023 — Regional finalist + outreach expansion</li>
            <li>2024 — Championship division run</li>
            <li>2025 — Autonomous record breaker</li>
          </ul>
        </article>

        <article className="glass rounded-2xl p-5">
          <h3 className="section-title">Sponsors & Outreach Impact</h3>
          <div className="relative mt-4 flex h-64 items-center justify-center overflow-hidden rounded-xl border border-white/10">
            <div className="orbit absolute text-neonGold">NVIDIA</div>
            <div className="orbit absolute [animation-delay:-4s] text-neonBlue">SpaceX</div>
            <div className="orbit absolute [animation-delay:-9s] text-neonPurple">PTC</div>
            <div className="text-center">
              <p className="text-sm text-slate-300">Students reached</p>
              <p className="text-4xl font-bold">12,450</p>
              <p className="mt-2 text-sm text-slate-300">Events hosted: 86 • Upward Bound STEM Labs</p>
            </div>
          </div>
        </article>
      </section>

      <section className="mx-auto mt-8 w-full max-w-7xl glass rounded-2xl p-5">
        <h3 className="section-title">Scouting Command Center + AI Assistant</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-slate-950/45 p-3 text-sm">Heatmaps: Loading dynamic zone pressure maps...</div>
          <div className="rounded-xl bg-slate-950/45 p-3 text-sm">Defense Effectiveness: 7.8 / 10 (live estimate)</div>
          <div className="rounded-xl bg-slate-950/45 p-3 text-sm">Chatbot: “Ask about our robot.” (RAG-ready placeholder)</div>
        </div>
      </section>

      {devMode && (
        <motion.aside initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="fixed bottom-4 right-4 z-50 max-w-sm rounded-xl border border-neonGold/40 bg-black/80 p-4 text-xs shadow-neon">
          <p className="font-semibold text-neonGold">Developer Mode Unlocked</p>
          <p className="mt-2">Hidden stats panel: drivetrain current, loop timing, shot variance, CAN utilization.</p>
        </motion.aside>
      )}
    </main>
  );
}
