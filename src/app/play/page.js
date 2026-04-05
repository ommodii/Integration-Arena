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
  const [showHint, setShowHint] = useState(0); // 0, 1, 2, 3
  
  // Scoring
  const [score, setScore] = useState(0);

  useEffect(() => {
    async function loadDailyProblems() {
      // First try to load from Supabase database
      const { data, error } = await supabase
        .from('problems')
        .select('*')
        .limit(5); // Add where clause dynamically for "daily" in final production
      
      if (data && data.length > 0) {
        setProblems(data);
      } else {
        // Fallback mock problems so app holds its weight even without DB seeded
        setProblems([
          {
            id: 'mock1',
            latex_problem: '\\int x^2 \\, dx',
            correct_answer: 'x^3/3',
            difficulty: 'Easy',
            xp_reward: 50,
            hint_1: 'Use the power rule.',
            hint_2: 'Add 1 to the exponent, then divide by the new exponent.',
            hint_3: 'What is x^(2+1) / (2+1)?',
            solution: 'Applying the power rule for integration, we get \\frac{x^3}{3} + C.'
          },
          {
            id: 'mock2',
            latex_problem: '\\int e^x \\, dx',
            correct_answer: 'e^x',
            difficulty: 'Beginner',
            xp_reward: 20,
            hint_1: 'The derivative of e^x is e^x.',
            hint_2: 'The integral of e^x is the same as its derivative.',
            hint_3: 'It is just e^x.',
            solution: 'The integral of e^x with respect to x is simply e^x + C.'
          }
        ]);
      }
      setLoading(false);
    }
    
    loadDailyProblems();
  }, []);

  const handleKeypadInput = (val) => {
    if (val === 'clear') {
      setInputAnswer('');
    } else {
      setInputAnswer(prev => prev + val);
    }
  };

  const handleKeypadDelete = () => {
    setInputAnswer(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    const problem = problems[currentIndex];
    
    // Ignore the C if user typed it or if answer expects it but doesn't get it
    // In actual production, strict checking can be enforced.
    let userAnsClean = inputAnswer.replace(/\+C|\+ c/g, '');
    let correctAnsClean = problem.correct_answer.replace(/\+C|\+ c/g, '');
    
    const { isCorrect } = validateAnswer(userAnsClean, correctAnsClean);
    
    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + problem.xp_reward);
      
      // Move to next problem after delay
      setTimeout(() => {
        if (currentIndex < problems.length - 1) {
          setCurrentIndex(c => c + 1);
          setInputAnswer('');
          setFeedback(null);
          setShowHint(0);
        } else {
          setFeedback('complete');
        }
      }, 1500);
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  if (loading) return <div className="container">Loading daily challenge...</div>;
  if (!problems.length) return <div className="container">No problems found for today!</div>;

  if (feedback === 'complete') {
    return (
      <section className="card" style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h2 style={{ color: 'var(--accent-primary)', fontSize: '2rem', marginBottom: '1rem' }}>Challenge Complete!</h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>You earned {score} XP today!</p>
        <button className="btn btn-primary" onClick={() => window.location.href = '/'}>
          Return Home
        </button>
      </section>
    );
  }

  const problem = problems[currentIndex];

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Problem {currentIndex + 1} / {problems.length}</div>
        <div style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>XP: {score}</div>
      </div>
      
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
        <span style={{ 
          background: 'var(--bg-tertiary)', 
          padding: '4px 16px', 
          borderRadius: '16px', 
          fontSize: '0.9rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>{problem.difficulty}</span>
      </div>

      <IntegralDisplay tex={problem.latex_problem} />

      <div style={{ 
        marginBottom: '1.5rem', 
        background: 'var(--bg-color)', 
        padding: '16px', 
        borderRadius: '12px', 
        minHeight: '60px', 
        display: 'flex', 
        alignItems: 'center', 
        fontSize: '1.5rem', 
        border: '2px solid var(--border-color)', 
        position: 'relative',
        fontFamily: 'monospace'
      }}>
        {inputAnswer || <span style={{ color: 'var(--text-secondary)' }}>Your Answer...</span>}
      </div>

      {feedback === 'correct' && (
        <div style={{ color: 'var(--accent-primary)', fontWeight: 700, textAlign: 'center', marginBottom: '1rem', fontSize: '1.2rem' }}>
          Correct! Next up...
        </div>
      )}
      {feedback === 'incorrect' && (
        <div style={{ color: 'var(--accent-danger)', fontWeight: 700, textAlign: 'center', marginBottom: '1rem', fontSize: '1.2rem' }}>
          Incorrect. Keep trying!
        </div>
      )}

      <MathKeypad onInput={handleKeypadInput} onDelete={handleKeypadDelete} />
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button onClick={() => setShowHint(h => Math.min(h + 1, 3))} className="btn" style={{ flex: 1 }} disabled={showHint >= 3}>
          Hint ({3 - showHint} left)
        </button>
        <button onClick={handleSubmit} className="btn btn-primary" style={{ flex: 2 }}>
          Submit Answer
        </button>
      </div>

      {showHint > 0 && (
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
