import nerdamer from 'nerdamer';
import 'nerdamer/all.min';

/**
 * Validates a user's mathematical input against the correct answer.
 * @param {string} userAnswer The user's inputted math string.
 * @param {string} correctAnswer The correct mathematical expression.
 * @param {number} tolerance The numerical tolerance for float answers.
 * @returns {object} { isCorrect: boolean, isExact: boolean, error?: string }
 */
export function validateAnswer(userAnswer, correctAnswer, tolerance = 0.001) {
  if (!userAnswer || !correctAnswer) {
    return { isCorrect: false, isExact: false, error: 'Empty input' };
  }
  
  try {
    // 1. Direct string match after removing spaces
    const cleanUser = userAnswer.trim().replace(/\s/g, '');
    const cleanCorrect = correctAnswer.trim().replace(/\s/g, '');
    
    if (cleanUser === cleanCorrect) {
      return { isCorrect: true, isExact: true };
    }

    // 2. Symbolic equivalence check using Nerdamer
    // We check if (userAnswer) - (correctAnswer) simplifies to 0
    const diff = nerdamer(`simplify((${userAnswer}) - (${correctAnswer}))`);
    if (diff.text() === '0') {
      return { isCorrect: true, isExact: true };
    }

    // 3. Numerical approximation fallback for numerical equivalence
    const userEval = nerdamer(userAnswer).evaluate();
    const correctEval = nerdamer(correctAnswer).evaluate();
    
    const userNum = Number(userEval.text());
    const correctNum = Number(correctEval.text());

    if (!isNaN(userNum) && !isNaN(correctNum)) {
      if (Math.abs(userNum - correctNum) <= tolerance) {
        // If it's valid numerically but not symbolically, we count it as correct but perhaps not exact.
        // E.g., if user types 1.57 and correct answer is pi/2
        return { isCorrect: true, isExact: false };
      }
    }

    return { isCorrect: false, isExact: false };
  } catch (err) {
    // Parser error, meaning the user input might be incomplete or invalid math
    return { isCorrect: false, isExact: false, error: 'Unparseable mathematical expression' };
  }
}
