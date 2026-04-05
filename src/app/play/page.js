"use client";

import { useState, useEffect } from 'react';
import MathKeypad from '@/components/MathKeypad';
import IntegralDisplay from '@/components/IntegralDisplay';
import { validateAnswer } from '@/lib/mathEngine';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

export default function Play() {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputAnswer, setInputAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null); // null, 'correct', 'incorrect'
  const [showHint, setShowHint] = useState(0); 
  const [score, setScore] = useState(0);

  useEffect(() => {
    async function loadDailyProblems() {
      // Fetch 5 problems
      const { data } = await supabase.from('problems').select('*').limit(5); 
      
      if (data && data.length > 0) {
        setProblems(data);
      } else {
        setProblems([
          { id: 'mock1', latex_problem: '\\int x^2 \\, dx', correct_answer: 'x^3/3', difficulty: 'Easy', xp_reward: 50, hint_1: 'Power rule.', hint_2: 'Divide by n+1.', hint_3: 'x^3 / 3', solution: 'The integral is x^3/3 + C.' },
          { id: 'mock2', latex_problem: '\\int e^x \\, dx', correct_answer: 'e^x', difficulty: 'Beginner', xp_reward: 20, hint_1: 'The derivative of e^x is e^x.', hint_2: 'Same as its derivative.', hint_3: 'Just e^x.', solution: 'The integral is simply e^x + C.' }
        ]);
      }
      setLoading(false);
    }
    loadDailyProblems();
  }, []);

  const handleKeypadInput = (val) => {
    if (val === 'clear') setInputAnswer('');
    else setInputAnswer(prev => prev + val);
  };

  const handleKeypadDelete = () => setInputAnswer(prev => prev.slice(0, -1));

  const handleSubmit = async () => {
    const problem = problems[currentIndex];
    let userAnsClean = inputAnswer.replace(/\+C|\+ c/g, '');
    let correctAnsClean = problem.correct_answer.replace(/\+C|\+ c/g, '');
    
    const { isCorrect } = validateAnswer(userAnsClean, correctAnsClean);
    
    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + problem.xp_reward);

      if (user) {
        const { data: profile } = await supabase.from('user_profiles').select('xp').eq('id', user.id).single();
        if (profile) {
          await supabase.from('user_profiles').update({ xp: profile.xp + problem.xp_reward }).eq('id', user.id);
        }
      }
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't capture inputs if game is over or solved
      if (feedback === 'correct' || feedback === 'complete') {
        if (e.key === 'Enter' && feedback === 'correct') {
          handleNext();
        }
        return;
      }

      const key = e.key;
      // Allow variables, operations, and e
      const validChars = /^[0-9x+\-*/^().e]$/;
      
      if (validChars.test(key)) {
        setInputAnswer(prev => prev + key);
      } else if (key === 'Backspace') {
        setInputAnswer(prev => prev.slice(0, -1));
      } else if (key === 'Enter') {
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [feedback, inputAnswer, currentIndex, problems]);

  const handleNext = () => {
    if (currentIndex < problems.length - 1) {
      setCurrentIndex(c => c + 1);
      setInputAnswer('');
      setFeedback(null);
      setShowHint(0);
    } else {
      setFeedback('complete');
    }
  };

  if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Loading daily challenge...</div>;
  if (!problems.length) return <div className="container">No problems found for today!</div>;

  if (feedback === 'complete') {
    return (
      <section className="card" style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h2 style={{ color: 'var(--accent-primary)', fontSize: '2.5rem', marginBottom: '1rem' }}>Challenge Complete!</h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>You earned {score} XP today!</p>
        <button className="btn btn-primary" onClick={() => window.location.href = '/dashboard'}>
          Return to Dashboard
        </button>
      </section>
    );
  }

  const problem = problems[currentIndex];

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Problem {currentIndex + 1} / {problems.length}</div>
        <div style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>XP Earned: {score}</div>
      </div>
      
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
        <span style={{ 
          background: 'var(--bg-tertiary)', padding: '4px 16px', borderRadius: '16px', 
          fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px'
        }}>{problem.difficulty}</span>
      </div>

      <IntegralDisplay tex={problem.latex_problem} />

      <div style={{ 
        marginBottom: '1.5rem', background: 'var(--bg-color)', padding: '16px', borderRadius: '12px', 
        minHeight: '60px', display: 'flex', alignItems: 'center', fontSize: '1.5rem', 
        border: '2px solid var(--border-color)', position: 'relative', fontFamily: 'monospace'
      }}>
        {inputAnswer || <span style={{ color: 'var(--text-secondary)' }}>Your Answer...</span>}
      </div>

      {feedback !== 'correct' && (
        <MathKeypad onInput={handleKeypadInput} onDelete={handleKeypadDelete} />
      )}
      
      {feedback === 'incorrect' && (
        <div style={{ color: 'var(--accent-danger)', fontWeight: 700, textAlign: 'center', margin: '1rem 0', fontSize: '1.2rem' }}>
          Incorrect formulation. Look closely and try again!
        </div>
      )}

      {feedback === 'correct' ? (
        <div className="card" style={{ marginTop: '2rem', textAlign: 'left', borderColor: 'var(--accent-primary)', backgroundColor: 'rgba(88, 204, 2, 0.1)' }}>
          <h3 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem', fontSize: '1.5rem' }}>Splendid!</h3>
          <p style={{ fontWeight: 700, marginBottom: '1rem' }}>+{problem.xp_reward} XP Gained</p>
          <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Solution Explanation</h4>
            <p style={{ lineHeight: '1.6' }}>{problem.solution}</p>
          </div>
          <button onClick={handleNext} className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '16px', fontSize: '1.2rem' }}>
            {currentIndex < problems.length - 1 ? 'Next Problem' : 'Finish Challenge'}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button onClick={() => setShowHint(h => Math.min(h + 1, 3))} className="btn btn-secondary" style={{ flex: 1 }} disabled={showHint >= 3}>
            Hint ({3 - showHint} left)
          </button>
          <button onClick={handleSubmit} className="btn btn-primary" style={{ flex: 2 }}>
            Submit Answer
          </button>
        </div>
      )}

      {showHint > 0 && feedback !== 'correct' && (
        <div className="card" style={{ marginTop: '2rem', textAlign: 'left' }}>
          <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Hints</h4>
          {showHint >= 1 && <p style={{ marginBottom: '0.5rem' }}><strong>1.</strong> {problem.hint_1}</p>}
          {showHint >= 2 && <p style={{ marginBottom: '0.5rem' }}><strong>2.</strong> {problem.hint_2}</p>}
          {showHint >= 3 && <p><strong>3.</strong> {problem.hint_3}</p>}
        </div>
      )}
    </div>
  );
}
