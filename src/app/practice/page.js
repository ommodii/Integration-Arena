"use client";

import { useState, useEffect } from 'react';
import MathKeypad from '@/components/MathKeypad';
import IntegralDisplay from '@/components/IntegralDisplay';
import { validateAnswer } from '@/lib/mathEngine';
import { supabase } from '@/lib/supabase';

export default function Practice() {
  const [problems, setProblems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputAnswer, setInputAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null); 
  const [showHint, setShowHint] = useState(0); 

  useEffect(() => {
    async function loadPracticeProblems() {
      // In practice mode we fetch up to 50 problems and shuffle
      const { data } = await supabase.from('problems').select('*').limit(50);
      
      if (data && data.length > 0) {
        setProblems(data.sort(() => Math.random() - 0.5));
      } else {
        setProblems([
          { id: 'mock1', latex_problem: '\\int \\sin(x) \\, dx', correct_answer: '-cos(x)', difficulty: 'Medium', hint_1: 'Derivative of cos is -sin', hint_2: 'Reverse the derivative', hint_3: 'Add negative sign', solution: 'The integral is -cos(x) + C.' }
        ]);
      }
      setLoading(false);
    }
    loadPracticeProblems();
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
      // No XP modification for practice!
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleNext = () => {
    setCurrentIndex(c => c + 1);
    setInputAnswer('');
    setFeedback(null);
    setShowHint(0);
  };

  if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Gathering unlimited practice challenges...</div>;
  if (!problems.length || currentIndex >= problems.length) return (
    <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h2>You solved all available problems!</h2>
      <button onClick={() => window.location.reload()} className="btn btn-primary" style={{marginTop:'1rem'}}>Reload Practice Mode</button>
    </div>
  );

  const problem = problems[currentIndex];

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Practice Mode — Infinite Queue</div>
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
          Not quite right. Give it another thought!
        </div>
      )}

      {feedback === 'correct' ? (
        <div className="card" style={{ marginTop: '2rem', textAlign: 'left', borderColor: 'var(--accent-primary)', backgroundColor: 'rgba(88, 204, 2, 0.1)' }}>
          <h3 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem', fontSize: '1.5rem' }}>Nailed it!</h3>
          <p style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--text-secondary)' }}>Practice solves grant no XP.</p>
          <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Solution Explanation</h4>
            <p style={{ lineHeight: '1.6' }}>{problem.solution || 'No explanation available.'}</p>
          </div>
          <button onClick={handleNext} className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '16px', fontSize: '1.2rem' }}>
            Next Practice Problem
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button onClick={() => setShowHint(Math.min(showHint + 1, 3))} className="btn btn-secondary" style={{ flex: 1 }} disabled={showHint >= 3}>
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
          {showHint >= 1 && <p style={{ marginBottom: '0.5rem' }}><strong>1.</strong> {problem.hint_1 || "Unavailable"}</p>}
          {showHint >= 2 && <p style={{ marginBottom: '0.5rem' }}><strong>2.</strong> {problem.hint_2 || "Unavailable"}</p>}
          {showHint >= 3 && <p><strong>3.</strong> {problem.hint_3 || "Unavailable"}</p>}
        </div>
      )}
    </div>
  );
}
