"use client";

import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

export default function IntegralDisplay({ tex }) {
  return (
    <div className="math-display" style={{ overflowX: 'auto' }}>
      <BlockMath math={tex} />
    </div>
  );
}
