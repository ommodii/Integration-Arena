import nerdamer from 'nerdamer';
import 'nerdamer/all.min';

export function validateAnswer(userAnswer, correctAnswer, tolerance = 0.001) {
  if (!userAnswer || !correctAnswer) {
    return { isCorrect: false, isExact: false, error: 'Empty input' };
  }
  
  try {
    // 1. Normalize logic
    let cleanUser = userAnswer.toLowerCase().replace(/\s/g, '');
    let cleanCorrect = correctAnswer.toLowerCase().replace(/\s/g, '');

    // Stripping constants if isolated
    cleanUser = cleanUser.replace(/\+c$/, '');
    cleanCorrect = cleanCorrect.replace(/\+c$/, '');

    // Fast string match check
    if (cleanUser === cleanCorrect) {
      return { isCorrect: true, isExact: true };
    }

    // 2. Exact Mathematical Symbolic Equivalence through Native EQ
    try {
      const isSymbolicMatch = nerdamer(cleanUser).eq(cleanCorrect);
      if (isSymbolicMatch) {
        return { isCorrect: true, isExact: true };
      }
    } catch (e) {
      // Ignored: Nerdamer parsing fault (e.g. invalid syntax for symbolic mode)
    }

    // 3. Fallback Numerical Evaluator (Crucial for constants like ln(e) vs 1, or 0.5 vs 1/2)
    try {
      const userNum = Number(nerdamer(cleanUser).evaluate().text());
      const correctNum = Number(nerdamer(cleanCorrect).evaluate().text());

      if (!isNaN(userNum) && !isNaN(correctNum)) {
        if (Math.abs(userNum - correctNum) <= tolerance) {
          return { isCorrect: true, isExact: false }; // Semantically correct
        }
      }
    } catch (e) {
      // Ignored: Cannot be evaluated numerically
    }

    return { isCorrect: false, isExact: false };
  } catch (err) {
    return { isCorrect: false, isExact: false, error: 'Unparseable mathematical expression' };
  }
}
