"use client";

import { Trophy } from 'lucide-react';

export default function Leaderboard() {
  const users = [
    { rank: 1, name: "EulerGhost", xp: 12500, streak: 45 },
    { rank: 2, name: "GaussJr", xp: 11200, streak: 40 },
    { rank: 3, name: "IntegrationBee99", xp: 10500, streak: 38 },
    { rank: 4, name: "CalcSlayer", xp: 9800, streak: 20 },
    { rank: 5, name: "MathMagician", xp: 8600, streak: 12 },
    // You'd query `users` sorted by `xp` descending in your backend via Supabase
  ];

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <Trophy size={64} color="var(--accent-secondary)" style={{ marginBottom: '1rem' }} />
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Global Leaderboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Top integration masters in the arena.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {users.map(u => (
          <div key={u.rank} className="card" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '1.5rem',
            borderColor: u.rank === 1 ? '#ffd700' : u.rank === 2 ? '#c0c0c0' : u.rank === 3 ? '#cd7f32' : 'var(--border-color)',
            background: u.rank <= 3 ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: u.rank === 1 ? '#ffd700' : 'var(--text-secondary)', width: '30px' }}>
                {u.rank}
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{u.name}</div>
            </div>
            
            <div style={{ display: 'flex', gap: '2rem', textAlign: 'right' }}>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>XP</div>
                <div style={{ fontWeight: 800, color: 'var(--accent-primary)', fontSize: '1.1rem' }}>{u.xp}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Streak</div>
                <div style={{ fontWeight: 800, color: '#ff9600', fontSize: '1.1rem' }}>{u.streak} 🔥</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
