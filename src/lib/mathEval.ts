// Safe math expression evaluator
const operators: Record<string, (a: number, b: number) => number> = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => {
    if (b === 0) throw new Error('Division by zero');
    return a / b;
  },
  '^': (a, b) => Math.pow(a, b),
};

const constants: Record<string, number> = {
  'π': Math.PI,
  'e': Math.E,
};

const functions: Record<string, (...args: number[]) => number> = {
  sin: (x) => Math.sin(x),
  cos: (x) => Math.cos(x),
  tan: (x) => Math.tan(x),
  log: (x) => {
    if (x <= 0) throw new Error('Logarithm of non-positive number');
    return Math.log10(x);
  },
  ln: (x) => {
    if (x <= 0) throw new Error('Natural log of non-positive number');
    return Math.log(x);
  },
  sqrt: (x) => {
    if (x < 0) throw new Error('Square root of negative number');
    return Math.sqrt(x);
  },
};

export function evaluateExpression(expression: string): number {
  // First, clean up the expression
  expression = expression.replace(/\s+/g, ''); // Remove all whitespace
  
  // Replace multiplication and division symbols
  expression = expression.replace(/×/g, '*').replace(/÷/g, '/');
  
  // Handle parentheses first
  while (expression.includes('(')) {
    expression = expression.replace(/\(([^()]+)\)/g, (_, expr) => 
      evaluateExpression(expr).toString()
    );
  }

  // Handle exponents (right associative)
  const exponentRegex = /(-?\d+\.?\d*)([\^])(-?\d+\.?\d*)/;
  while (exponentRegex.test(expression)) {
    expression = expression.replace(exponentRegex, (_, a, op, b) => 
      operators[op](parseFloat(a), parseFloat(b)).toString()
    );
  }

  // Handle multiplication and division (left to right)
  const mulDivRegex = /(-?\d+\.?\d*)([*/])(-?\d+\.?\d*)/;
  while (mulDivRegex.test(expression)) {
    expression = expression.replace(mulDivRegex, (_, a, op, b) => 
      operators[op](parseFloat(a), parseFloat(b)).toString()
    );
  }

  // Handle addition and subtraction (left to right)
  const addSubRegex = /(-?\d+\.?\d*)([+-])(-?\d+\.?\d*)/;
  while (addSubRegex.test(expression)) {
    expression = expression.replace(addSubRegex, (_, a, op, b) => 
      operators[op](parseFloat(a), parseFloat(b)).toString()
    );
  }

  const result = parseFloat(expression);
  if (isNaN(result)) {
    throw new Error('Invalid expression');
  }
  return result;
}
