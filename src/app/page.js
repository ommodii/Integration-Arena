import Link from "next/link";
import { Calculator } from "lucide-react";

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2rem 0' }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Calculator size={48} color="var(--accent-primary)" />
          <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-1px' }}>Integral Arena</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '500px', margin: '0 auto' }}>
          The ultimate daily integration challenge platform. Level up your calculus skills globally.
        </p>
      </header>
      
      <section className="card" style={{ textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>Today&apos;s Challenge</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>5 new daily problems are waiting for you.</p>
        <Link href="/play" className="btn btn-primary" style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}>
          Play Now
        </Link>
      </section>
      
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link href="/leaderboard" className="btn" style={{ flex: 1 }}>
          Leaderboard
        </Link>
        <Link href="/practice" className="btn btn-secondary" style={{ flex: 1 }}>
          Practice Mode
        </Link>
      </div>
    </div>
  );
}
