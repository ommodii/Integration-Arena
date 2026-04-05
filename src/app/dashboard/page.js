"use client";

import { useAuth } from '@/components/AuthProvider';
import { Flame, Star, Trophy, Award } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({ xp: 0, streak: 0, rank: 'Unranked' });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      if (!user) {
        setStatsLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('xp, streak')
        .eq('id', user.id)
        .single();
        
      if (data) {
        setStats({ xp: data.xp, streak: data.streak, rank: 'Bronze' });
      } else {
        // Upsert user if missing
        await supabase.from('user_profiles').upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || 'Integration Master',
          xp: 0,
          streak: 0
        });
        setStats({ xp: 0, streak: 0, rank: 'Unranked' });
      }
      setStatsLoading(false);
    }
    if (!loading) loadStats();
  }, [user, loading]);

  if (loading || statsLoading) return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Loading profile...</div>;
  
  if (!user && process.env.NODE_ENV !== 'development') {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2>Please sign in to view your dashboard.</h2>
      </div>
    );
  }

  const levels = [0, 100, 500, 1500, 3000, 5000, 10000];
  const currentLevel = levels.filter(req => stats.xp >= req).length;
  const nextTarget = levels[currentLevel] || 10000;
  const progressPercent = Math.min(100, (stats.xp / nextTarget) * 100);

  const badges = [
    { title: "First Blood", desc: "Solve your first integral challenge.", earned: stats.xp > 0 },
    { title: "Streak Maintainer", desc: "Keep a streak of 3 days.", earned: stats.streak >= 3 },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Welcome back, {user?.user_metadata?.full_name || 'Integration Master'}</h1>
      
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>Level {currentLevel}</span>
          <span>{stats.xp} / {nextTarget} XP</span>
        </h3>
        <div style={{ width: '100%', backgroundColor: 'var(--bg-tertiary)', height: '16px', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ width: `${progressPercent}%`, backgroundColor: 'var(--accent-primary)', height: '100%', transition: 'width 0.5s ease-out' }}></div>
        </div>
      </div>

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
            <div style={{ color: 'var(--text-secondary)' }}>Rank/Tier</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.rank}</div>
          </div>
        </div>
      </div>

      <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Award size={28} /> Your Badges
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        {badges.map(b => (
          <div key={b.title} className="card" style={{ padding: '1.5rem', opacity: b.earned ? 1 : 0.5, borderColor: b.earned ? 'var(--accent-primary)' : 'var(--border-color)', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={e => b.earned && (e.currentTarget.style.transform = 'translateY(-4px)')} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <h4 style={{ color: b.earned ? 'var(--accent-primary)' : 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{b.title}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{b.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '3rem', textAlign: 'center', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link href="/play" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}>
          Daily Challenge
        </Link>
        <Link href="/practice" className="btn btn-secondary" style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}>
          Practice Mode
        </Link>
      </div>
    </div>
  );
}
