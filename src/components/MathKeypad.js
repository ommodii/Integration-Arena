"use client";

import React from 'react';

const keys = [
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '÷', value: '/' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '×', value: '*' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '-', value: '-' },
  { label: '.', value: '.' },
  { label: '0', value: '0' },
  { label: 'x', value: 'x' },
  { label: '+', value: '+' },
  { label: '(', value: '(' },
  { label: ')', value: ')' },
  { label: '^', value: '^' },
  { label: 'e', value: 'e' },
  { label: 'ln', value: 'log(' },
  { label: 'sin', value: 'sin(' },
  { label: 'cos', value: 'cos(' },
  { label: 'π', value: 'pi' },
  { label: 'C', value: '+ C' },
];

export default function MathKeypad({ onInput, onDelete }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '8px',
      padding: '16px',
      backgroundColor: 'var(--bg-tertiary)',
      borderRadius: 'var(--border-radius)',
      marginTop: '1rem',
      userSelect: 'none'
    }}>
      {keys.map((key) => (
        <button
          key={key.label}
          onClick={() => onInput(key.value)}
          className="btn"
          style={{ 
            padding: '10px 4px', 
            fontSize: '1.2rem', 
            boxShadow: '0 2px 0 var(--border-color)', 
            borderRadius: '8px',
            fontFamily: 'monospace'
          }}
        >
          {key.label}
        </button>
      ))}
      <button 
        onClick={onDelete} 
        className="btn btn-secondary"
        style={{ gridColumn: 'span 3', padding: '10px', boxShadow: '0 2px 0 var(--accent-secondary-hover)', borderRadius: '8px' }}
      >
        ⌫ Delete
      </button>
      <button 
        onClick={() => onInput('clear')} 
        className="btn btn-primary"
        style={{ gridColumn: 'span 2', padding: '10px', boxShadow: '0 2px 0 var(--accent-primary-hover)', borderRadius: '8px' }}
      >
        Clear All
      </button>
    </div>
  );
}
