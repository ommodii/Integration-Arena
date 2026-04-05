"use client";

import React from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function MathRenderer({ text }) {
  if (!text) return null;
  
  // Splits by $ ... $ and maintains parts correctly
  const parts = text.split(/\$(.*?)\$/g);
  
  return (
    <span style={{ lineHeight: '1.6' }}>
      {parts.map((part, index) => {
        if (index % 2 === 0) {
          // Normal text
          return <span key={index}>{part}</span>;
        } else {
          // LaTeX wrapped
          return <InlineMath key={index} math={part} />;
        }
      })}
    </span>
  );
}
