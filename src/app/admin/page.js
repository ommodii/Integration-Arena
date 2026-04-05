"use client";

import { useAuth } from '@/components/AuthProvider';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Admin() {
  const { user, loading } = useAuth();
  
  const [problemData, setProblemData] = useState({
    latex_problem: '',
    correct_answer: '',
    difficulty: 'Medium',
    xp_reward: 100,
    hint_1: '',
    hint_2: '',
    hint_3: '',
    solution: '',
    schedule_date: new Date().toISOString().split('T')[0] // today YYYY-MM-DD
  });
  const [status, setStatus] = useState('');

  if (loading) return <div className="container">Loading...</div>;

  // Frontend restriction: hide route from non-admins. This must be backed by RLS in Supabase securely.
  if (user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h1 style={{ color: 'var(--accent-danger)', marginBottom: '1rem' }}>Access Denied</h1>
        <p>You do not have permission to view the Admin panel.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    setProblemData({ ...problemData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    
    const { data, error } = await supabase.from('problems').insert([problemData]);
    
    if (error) {
      console.error(error);
      setStatus(`Error: ${error.message}`);
    } else {
      setStatus('Problem added successfully!');
      setProblemData(prev => ({
        ...prev,
        latex_problem: '',
        correct_answer: '',
        hint_1: '',
        hint_2: '',
        hint_3: '',
        solution: ''
      }));
      setTimeout(() => setStatus(''), 4000);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', paddingBottom: '4rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>
      
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>Add New Integral Problem</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Schedule Date</label>
            <input type="date" name="schedule_date" value={problemData.schedule_date} onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>LaTeX Problem (e.g. \int x^2 dx)</label>
            <input type="text" name="latex_problem" value={problemData.latex_problem} onChange={handleChange} required placeholder="\int x^2 dx" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontFamily: 'monospace' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Correct Answer (Exact syntax for JS CAS)</label>
            <input type="text" name="correct_answer" value={problemData.correct_answer} onChange={handleChange} required placeholder="x^3/3" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontFamily: 'monospace' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Difficulty</label>
              <select name="difficulty" value={problemData.difficulty} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                <option>Beginner</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
                <option>MIT Level</option>
              </select>
            </div>
            
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>XP Reward</label>
              <input type="number" name="xp_reward" value={problemData.xp_reward} onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', margin: '1rem 0', paddingTop: '1rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Learning Content</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Hint 1 (Vague direction)</label>
              <input type="text" name="hint_1" value={problemData.hint_1} onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Hint 2 (Method hint)</label>
              <input type="text" name="hint_2" value={problemData.hint_2} onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Hint 3 (Near-solution)</label>
              <input type="text" name="hint_3" value={problemData.hint_3} onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Full Solution (Text/Math)</label>
              <textarea name="solution" value={problemData.solution} onChange={handleChange} required rows={4} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontFamily: 'inherit', resize: 'vertical' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '16px', fontSize: '1.2rem' }}>
            Publish Problem
          </button>
          
          {status && <p style={{ textAlign: 'center', marginTop: '1rem', fontWeight: 700, color: status.includes('Error') ? 'var(--accent-danger)' : 'var(--accent-primary)' }}>{status}</p>}
        </form>
      </div>
    </div>
  );
}
