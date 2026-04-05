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

    // Stripping constants
    cleanUser = cleanUser.replace(/\+c$/, '');
    cleanCorrect = cleanCorrect.replace(/\+c$/, '');

    // Ensure logarithmic functions are mapped properly
    cleanUser = cleanUser.replace(/ln/g, 'log');
    cleanCorrect = cleanCorrect.replace(/ln/g, 'log');

    // Fast string match check
    if (cleanUser === cleanCorrect) {
      return { isCorrect: true, isExact: true };
    }

    // 2. Exact Mathematical Symbolic Equivalence
    // By simulating (A - B), a mathematically equivalent statement will resolve exactly to 0
    try {
      const expr = nerdamer(`simplify((${cleanUser}) - (${cleanCorrect}))`);
      if (expr.text() === '0' || expr.evaluate().text() === '0') {
        return { isCorrect: true, isExact: true };
      }
    } catch (e) {
      // Ignored: Nerdamer parsing fault (e.g. invalid syntax for symbolic mode)
    }

    // 3. Fallback Numerical Evaluator
    try {
      const userNum = Number(nerdamer(cleanUser).evaluate().text());
      const correctNum = Number(nerdamer(cleanCorrect).evaluate().text());

      if (!isNaN(userNum) && !isNaN(correctNum)) {
        if (Math.abs(userNum - correctNum) <= tolerance) {
          return { isCorrect: true, isExact: false }; 
        }
      }
    } catch (e) {
      // Ignored
    }

    return { isCorrect: false, isExact: false };
  } catch (err) {
    return { isCorrect: false, isExact: false, error: 'Unparseable mathematical expression' };
  }
}
