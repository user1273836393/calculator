import { useState, useEffect } from "react";
import { Delete, History, Sun, Moon, Settings, DollarSign, Ruler, Wrench } from "lucide-react";
import { evaluateExpression } from "@/lib/mathEval";

type TabType = 'basic' | 'scientific' | 'convert' | 'tools' | 'finance' | 'settings';

// Button configurations
const buttons = [
  ['7', '8', '9', '÷'],
  ['4', '5', '6', '×'],
  ['1', '2', '3', '-'],
  ['0', '.', '=', '+'],
];

const scientificButtons = [
  ['sin', 'cos', 'tan', '√'],
  ['log', 'ln', 'x²', 'x³'],
  ['π', 'e', '(', ')'],
  ['C', '⌫', '(', ')']
];

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isResult, setIsResult] = useState(false);

  // Load saved theme and history on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" || "light";
    const savedHistory = JSON.parse(localStorage.getItem("calcHistory") || "[]");
    setTheme(savedTheme);
    setHistory(savedHistory);
    
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle between light and dark theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Handle button clicks from the calculator
  const handleButtonClick = (value: string) => {
    if (value === '=') {
      handleEquals();
    } else if (value === 'C') {
      handleClear();
    } else if (value === '⌫') {
      handleDelete();
    } else if (['+', '-', '×', '÷'].includes(value)) {
      handleOperator(value);
    } else {
      handleNumber(value);
    }
  };

  // Handle number input
  const handleNumber = (num: string) => {
    if (display === "0" || display === "Error" || isResult) {
      setDisplay(num);
      setEquation(num);
      setIsResult(false);
    } else {
      setDisplay(display + num);
      setEquation(equation + num);
    }
  };

  // Handle operator input
  const handleOperator = (op: string) => {
    if (display === "Error") return;
    setEquation(equation + " " + op + " ");
    setDisplay("0");
    setIsResult(false);
  };

  // Clear the calculator
  const handleClear = () => {
    setDisplay("0");
    setEquation("");
    setIsResult(false);
  };

  // Delete the last character
  const handleDelete = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
      setEquation(equation.slice(0, -1));
    } else {
      setDisplay("0");
      setEquation("");
    }
  };

  // Handle scientific functions
  const handleScientific = (func: string) => {
    try {
      let result = 0;
      const num = parseFloat(display);
      
      switch (func) {
        case 'sin':
          result = Math.sin(num * Math.PI / 180);
          break;
        case 'cos':
          result = Math.cos(num * Math.PI / 180);
          break;
        case 'tan':
          result = Math.tan(num * Math.PI / 180);
          break;
        case 'log':
          result = Math.log10(num);
          break;
        case 'ln':
          result = Math.log(num);
          break;
        case 'sqrt':
          result = Math.sqrt(num);
          break;
        case 'square':
          result = num * num;
          break;
        case 'π':
          result = Math.PI;
          break;
        case 'e':
          result = Math.E;
          break;
        default:
          return;
      }
      
      setDisplay(result.toString());
      setEquation(result.toString());
      setIsResult(true);
    } catch (error) {
      setDisplay("Error");
      setEquation("");
      setIsResult(false);
    }
  };

  // Handle equals operation
  const handleEquals = () => {
    try {
      if (!equation.trim()) return;
      
      // Don't calculate if equation ends with an operator
      const operatorPattern = /[+×÷-] $/;
      if (operatorPattern.test(equation)) return;
      
      const sanitizedEquation = equation
        .replace(/×/g, '*')
        .replace(/÷/g, '/');

      const result = evaluateExpression(sanitizedEquation);
      const resultStr = result.toString();
      
      setDisplay(resultStr);
      setEquation(resultStr);
      setIsResult(true);
      
      // Update history
      const historyEntry = `${equation} = ${resultStr}`;
      const newHistory = [historyEntry, ...history].slice(0, 20);
      setHistory(newHistory);
      localStorage.setItem("calcHistory", JSON.stringify(newHistory));
    } catch (error) {
      console.error("Calculation error:", error);
      setDisplay("Error");
      setEquation("");
      setIsResult(false);
    }
  };

  // Toggle history panel
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  // Render the appropriate content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
      case 'scientific':
        return (
          <>
            {activeTab === 'scientific' && (
              <div className="grid grid-cols-4 gap-3 mb-4">
                {scientificButtons.flat().map((btn) => (
                  <button
                    key={btn}
                    onClick={() => handleScientific(btn === "√" ? "sqrt" : btn === "x²" ? "square" : btn === "π" ? "pi" : btn)}
                    className="neu-button p-4 font-medium text-primary hover:scale-105 transition-transform"
                  >
                    {btn}
                  </button>
                ))}
              </div>
            )}
            <div className="grid grid-cols-4 gap-3">
              {buttons.flat().map((btn, index) => (
                <button
                  key={index}
                  onClick={() => handleButtonClick(btn)}
                  className={`p-4 rounded-xl font-medium transition-all text-lg ${
                    btn === "="
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : btn === "C"
                      ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      : "neu-button text-foreground hover:scale-105"
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>
          </>
        );
      case 'convert':
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Unit Conversion</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">From</label>
                  <select className="w-full p-2 rounded-lg border">
                    <option>Meters</option>
                    <option>Feet</option>
                    <option>Inches</option>
                    <option>Centimeters</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">To</label>
                  <select className="w-full p-2 rounded-lg border">
                    <option>Feet</option>
                    <option>Meters</option>
                    <option>Inches</option>
                    <option>Centimeters</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Value</label>
                <input 
                  type="number" 
                  className="w-full p-2 rounded-lg border"
                  placeholder="Enter value"
                />
              </div>
              <button className="w-full bg-primary text-white p-3 rounded-lg hover:bg-primary/90">
                Convert
              </button>
            </div>
          </div>
        );
      case 'tools':
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Tools</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 rounded-xl neu-button text-center">
                <div className="text-2xl mb-1">📅</div>
                <div>Date Calc</div>
              </button>
              <button className="p-4 rounded-xl neu-button text-center">
                <div className="text-2xl mb-1">💲</div>
                <div>Tip Calc</div>
              </button>
              <button className="p-4 rounded-xl neu-button text-center">
                <div className="text-2xl mb-1">📏</div>
                <div>Length</div>
              </button>
              <button className="p-4 rounded-xl neu-button text-center">
                <div className="text-2xl mb-1">⚖️</div>
                <div>Weight</div>
              </button>
            </div>
          </div>
        );
      case 'finance':
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Financial Tools</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Principal Amount</label>
                <input type="number" className="w-full p-2 rounded-lg border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Interest Rate (%)</label>
                <input type="number" className="w-full p-2 rounded-lg border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time (years)</label>
                <input type="number" className="w-full p-2 rounded-lg border" />
              </div>
              <button className="w-full bg-primary text-white p-3 rounded-lg hover:bg-primary/90">
                Calculate Interest
              </button>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Dark Mode</span>
                <button 
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${theme === 'dark' ? 'bg-primary' : 'bg-gray-200'}`}
                >
                  <span 
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span>Vibrate on Press</span>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                </button>
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">About</h4>
                <p className="text-sm text-muted-foreground">
                  Smart Calculator v1.0.0
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-gray-100'}`}>
      <header className="p-4 shadow-md bg-white dark:bg-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Smart Calculator</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={toggleHistory}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Show history"
            >
              <History size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Display */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700">
            <div className="text-right text-gray-500 dark:text-gray-400 text-sm h-5 overflow-hidden">
              {equation}
            </div>
            <div className="text-right text-4xl font-bold mt-2 overflow-x-auto">
              {display}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('basic')}
              className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'basic' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 dark:text-gray-400'}`}
            >
              Basic
            </button>
            <button
              onClick={() => setActiveTab('scientific')}
              className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'scientific' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 dark:text-gray-400'}`}
            >
              Scientific
            </button>
            <button
              onClick={() => setActiveTab('convert')}
              className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'convert' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 dark:text-gray-400'}`}
            >
              <Ruler size={20} className="mx-auto" />
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'tools' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 dark:text-gray-400'}`}
            >
              <Wrench size={20} className="mx-auto" />
            </button>
            <button
              onClick={() => setActiveTab('finance')}
              className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'finance' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 dark:text-gray-400'}`}
            >
              <DollarSign size={20} className="mx-auto" />
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'settings' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 dark:text-gray-400'}`}
            >
              <Settings size={20} className="mx-auto" />
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {renderTabContent()}
          </div>
        </div>
      </main>

      {/* History Panel */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white dark:bg-gray-800 w-80 h-full shadow-xl p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">History</h2>
              <button
                onClick={toggleHistory}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Close history"
              >
                <Delete size={20} />
              </button>
            </div>
            {history.length > 0 ? (
              <div className="space-y-2">
                {history.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const [eq] = item.split(' = ');
                      setEquation(eq);
                      setDisplay(eq);
                      setIsResult(false);
                      setShowHistory(false);
                    }}
                    className="w-full text-right p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="text-sm text-gray-600 dark:text-gray-300">{item}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                No history yet
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;
