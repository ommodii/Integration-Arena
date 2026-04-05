"use client";

import { useAuth } from '@/components/AuthProvider';
import { Flame, Star, Trophy, Award } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) return <div className="container" style={{ textAlign: 'center' }}>Loading profile...</div>;
  
  if (!user && process.env.NODE_ENV !== 'development') {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2>Please sign in to view your dashboard.</h2>
      </div>
    );
  }

  // Mock stats - in reality we query this from the 'users' table in Supabase
  const stats = {
    xp: 450,
    streak: 3,
    level: 5,
    rank: 14,
  };

  const badges = [
    { title: "First Blood", desc: "Solve your first integral challenge." },
    { title: "Substitution Master", desc: "Perfectly solve 10 u-substitution problems." },
    { title: "Streak Maintainer", desc: "Keep a streak of 3 days." },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Welcome back, {user?.user_metadata?.full_name || 'Integration Master'}</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderColor: 'var(--accent-primary)' }}>
          <Star size={32} color="var(--accent-primary)" />
          <div>
            <div style={{ color: 'var(--text-secondary)' }}>Total XP</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.xp}</div>
          </div>
        </div>
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderColor: '#ff9600' }}>
          <Flame size={32} color="#ff9600" />
          <div>
            <div style={{ color: 'var(--text-secondary)' }}>Day Streak</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.streak} 🔥</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderColor: 'var(--accent-secondary)' }}>
          <Trophy size={32} color="var(--accent-secondary)" />
          <div>
            <div style={{ color: 'var(--text-secondary)' }}>Global Rank</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>#{stats.rank}</div>
          </div>
        </div>
      </div>

      <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Award size={28} /> Your Badges
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        {badges.map(b => (
          <div key={b.title} className="card" style={{ padding: '1.5rem', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{b.title}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{b.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <Link href="/play" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}>
          Continue Daily Challenge
        </Link>
      </div>
    </div>
  );
}
