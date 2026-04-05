"use client";

import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

export default function IntegralDisplay({ tex }) {
  if (!tex) return null;

  return (
    <div className="math-display" style={{ 
      overflowX: 'auto', 
      overflowY: 'hidden', 
      whiteSpace: 'nowrap',
      padding: '1.5rem',
      backgroundColor: 'var(--bg-tertiary)',
      borderRadius: 'var(--border-radius)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '120px',
      margin: '0 auto 2rem auto',
      width: '100%'
    }}>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <BlockMath math={tex} />
      </div>
    </div>
  );
}
