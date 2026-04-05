import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'src', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const generateProblems = (count) => {
    const problems = [];
    for (let i = 0; i < count; i++) {
        const coef = Math.floor(Math.random() * 10) + 1;
        const exp = Math.floor(Math.random() * 5) + 1;
        
        let problemTex, answer, diff, hint1, hint2, hint3, solution;
        
        const type = Math.floor(Math.random() * 5);
        if (type === 0) { 
            problemTex = `\\int ${coef}x^${exp} \\, dx`;
            answer = `${coef}/${exp+1}*x^(${exp+1})`;
            diff = 'Beginner';
            hint1 = 'Use the power rule.';
            hint2 = `Add 1 to the exponent ${exp}.`;
            hint3 = `Divide by ${exp+1}.`;
            solution = `Apply the power rule: $\\int x^n \\, dx = \\frac{x^{n+1}}{n+1}$. Result is $\\frac{${coef}}{${exp+1}}x^{${exp+1}} + C$.`;
        } else if (type === 1) { 
            problemTex = `\\int ${coef}e^{${exp}x} \\, dx`;
            answer = `(${coef}/${exp})*e^(${exp}*x)`;
            diff = 'Easy';
            hint1 = 'The integral of e^(kx) is (1/k)e^(kx).';
            hint2 = `Divide by the derivative of the exponent, which is ${exp}.`;
            hint3 = `The coefficient becomes ${coef}/${exp}.`;
            solution = `Setting $u = ${exp}x$, $du = ${exp}dx$. The integral evaluates to $\\frac{${coef}}{${exp}}e^{${exp}x} + C$.`;
        } else if (type === 2) { 
            problemTex = `\\int ${coef}\\sin(${exp}x) \\, dx`;
            answer = `-(${coef}/${exp})*cos(${exp}*x)`;
            diff = 'Medium';
            hint1 = 'The integral of sin(kx) is -(1/k)cos(kx).';
            hint2 = `Don't forget the negative sign!`;
            hint3 = `Divide by ${exp}.`;
            solution = `Use u-substitution: $u = ${exp}x$, $du = ${exp}dx$. $\\int \\sin(u) \\frac{du}{${exp}} = -\\frac{1}{${exp}}\\cos(u)$. Final answer: $-\\frac{${coef}}{${exp}}\\cos(${exp}x) + C$.`;
        } else if (type === 3) { 
            problemTex = `\\int \\frac{${coef}}{x} \\, dx`;
            answer = `${coef}*ln(x)`;
            diff = 'Beginner';
            hint1 = 'What has a derivative of 1/x?';
            hint2 = 'It involves the natural logarithm.';
            hint3 = `ln(x)`;
            solution = `The integral of $\\frac{1}{x}$ is $\\ln|x|$. Multiplying by the constant gives $${coef}\\ln|x| + C$.`;
        } else { 
            problemTex = `\\int (${coef}x^2 + ${exp}) \\, dx`;
            answer = `${coef}/3*x^3 + ${exp}*x`;
            diff = 'Easy';
            hint1 = 'Integrate each term separately.';
            hint2 = `Use the power rule on x^2, and remember the integral of a constant is that constant times x.`;
            hint3 = `First term becomes (${coef}/3)*x^3.`;
            solution = `Split the integral: $\\int ${coef}x^2 dx + \\int ${exp} dx = \\frac{${coef}}{3}x^3 + ${exp}x + C$.`;
        }
        
        problems.push({
            id: `gen_${Math.random().toString(36).substring(7)}_${i}`,
            latex_problem: problemTex,
            correct_answer: answer,
            difficulty: diff,
            xp_reward: diff === 'Beginner' ? 10 : diff === 'Easy' ? 20 : 50,
            hint_1: hint1,
            hint_2: hint2,
            hint_3: hint3,
            solution: solution
        });
    }
    return problems;
};

fs.writeFileSync(path.join(dataDir, 'practiceProblems.json'), JSON.stringify(generateProblems(1000), null, 2));
fs.writeFileSync(path.join(dataDir, 'dailyProblems.json'), JSON.stringify(generateProblems(5), null, 2));
console.log('Successfully generated JSON local files!');
