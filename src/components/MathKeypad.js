"use client";

import React from 'react';

export default function MathKeypad({ onInput, onDelete }) {
  // Functions row
  const functions = [
    { label: 'e', value: 'e' },
    { label: 'π', value: 'pi' },
    { label: 'ln', value: 'log(' },
    { label: 'sin', value: 'sin(' },
    { label: 'cos', value: 'cos(' },
    { label: '^', value: '^' },
    { label: '√', value: 'sqrt(' },
    { label: '∫', value: 'int(' },
    { label: 'C', value: '+ C' }
  ];

  // Digits pad (standard format)
  const digits = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['0', '.', 'x']
  ];

  // Operators
  const operators = [
    { label: '÷', value: '/' },
    { label: '×', value: '*' },
    { label: '-', value: '-' },
    { label: '+', value: '+' },
    { label: '(', value: '(' },
    { label: ')', value: ')' }
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: '16px',
      backgroundColor: 'var(--bg-tertiary)',
      borderRadius: 'var(--border-radius)',
      marginTop: '1rem',
      userSelect: 'none'
    }}>
      {/* Function Keys Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
        {functions.map(f => (
          <button
            key={f.label}
            onClick={() => onInput(f.value)}
            className="btn"
            style={{ padding: '8px 4px', fontSize: '1.1rem', fontFamily: 'monospace', boxShadow: '0 2px 0 var(--border-color)', borderRadius: '6px' }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '16px' }}>
        {/* Numpad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {digits.flat().map(d => (
            <button
              key={d}
              onClick={() => onInput(d)}
              className="btn btn-secondary"
              style={{ padding: '12px 4px', fontSize: '1.2rem', fontFamily: 'monospace', boxShadow: '0 2px 0 var(--accent-secondary-hover)', borderRadius: '8px' }}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Operators */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {operators.map(op => (
            <button
              key={op.label}
              onClick={() => onInput(op.value)}
              className="btn"
              style={{ padding: '12px 4px', fontSize: '1.2rem', fontFamily: 'monospace', boxShadow: '0 2px 0 var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-color)' }}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <button 
          onClick={onDelete} 
          className="btn"
          style={{ padding: '12px', boxShadow: '0 2px 0 var(--border-color)', borderRadius: '8px', color: 'var(--accent-primary)' }}
        >
          ⌫ Delete
        </button>
        <button 
          onClick={() => onInput('clear')} 
          className="btn"
          style={{ padding: '12px', boxShadow: '0 2px 0 var(--border-color)', borderRadius: '8px', color: 'var(--accent-danger)' }}
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
