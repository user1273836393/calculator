import { useState, useEffect } from "react";
import { Delete, History, Sun, Moon, Settings, DollarSign, Ruler, Wrench } from "lucide-react";

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  type TabType = 'basic' | 'scientific' | 'convert' | 'tools' | 'finance' | 'settings';
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const isScientific = activeTab === 'scientific';

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" || "light";
    const savedHistory = JSON.parse(localStorage.getItem("calcHistory") || "[]");
    setTheme(savedTheme);
    setHistory(savedHistory);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

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
              {basicButtons.flat().map((btn) => (
                <button
                  key={btn}
                  onClick={() => {
                    if (btn === "=") handleEquals();
                    else if (["+", "-", "×", "÷"].includes(btn)) handleOperator(btn);
                    else handleNumber(btn);
                  }}
                  className={`neu-button p-6 text-xl font-semibold hover:scale-105 transition-all ${
                    btn === "=" ? "text-primary" : ["+", "-", "×", "÷"].includes(btn) ? "text-accent" : "text-foreground"
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
                  <select className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600">
                    <option>Meters</option>
                    <option>Feet</option>
                    <option>Inches</option>
                    <option>Centimeters</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">To</label>
                  <select className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600">
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
                  className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
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
                <input type="number" className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Interest Rate (%)</label>
                <input type="number" className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time (years)</label>
                <input type="number" className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600" />
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
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">About</h4>
                <p className="text-sm text-muted-foreground">
                  Smart Calculator v1.0.0
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  const handleNumber = (num: string) => {
    if (display === "0" || display === "Error") {
      setDisplay(num);
      if (equation === "" || display === "Error") {
        setEquation(num);
      } else {
        setEquation(equation + num);
      }
    } else {
      setDisplay(display + num);
      setEquation(equation + num);
    }
  };

  const handleOperator = (op: string) => {
    if (display === "Error") return;
    setEquation(equation + " " + op + " ");
    setDisplay("0");
  };

  const handleClear = () => {
    setDisplay("0");
    setEquation("");
  };

  const handleDelete = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const handleEquals = () => {
    try {
      const result = eval(equation.replace(/×/g, "*").replace(/÷/g, "/"));
      const resultStr = result.toString();
      setDisplay(resultStr);

      const historyEntry = `${equation} = ${resultStr}`;
      const newHistory = [historyEntry, ...history].slice(0, 20);
      setHistory(newHistory);
      localStorage.setItem("calcHistory", JSON.stringify(newHistory));

      setEquation(resultStr);
    } catch (error) {
      setDisplay("Error");
      setEquation("");
    }
  };

  const handleScientific = (func: string) => {
    try {
      const num = parseFloat(display);
      let result;

      switch (func) {
        case "sin":
          result = Math.sin(num * (Math.PI / 180));
          break;
        case "cos":
          result = Math.cos(num * (Math.PI / 180));
          break;
        case "tan":
          result = Math.tan(num * (Math.PI / 180));
          break;
        case "log":
          result = Math.log10(num);
          break;
        case "ln":
          result = Math.log(num);
          break;
        case "sqrt":
          result = Math.sqrt(num);
          break;
        case "square":
          result = num * num;
          break;
        case "pi":
          result = Math.PI;
          break;
        case "e":
          result = Math.E;
          break;
        default:
          return;
      }

      setDisplay(result.toString());
      setEquation(result.toString());
    } catch (error) {
      setDisplay("Error");
    }
  };

  const basicButtons = [
    ["7", "8", "9", "÷"],
    ["4", "5", "6", "×"],
    ["1", "2", "3", "-"],
    ["0", ".", "=", "+"],
  ];

  const scientificButtons = [
    ["sin", "cos", "tan", "log"],
    ["ln", "√", "x²", "π"],
    ["e", "(", ")", "^"],
  ];

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Calculator</h1>
        <div className="flex gap-2">
          <button
            onClick={toggleTheme}
            className="neu-button p-3 text-foreground"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="neu-button p-3 text-foreground"
            aria-label="Show history"
          >
            <History className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* History Panel */}
      {showHistory && (
        <div className="neu-card p-4 mb-4 animate-fade-in">
          <h2 className="text-lg font-semibold mb-3 text-foreground">History</h2>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-muted-foreground text-sm">No history yet</p>
            ) : (
              history.map((entry, index) => (
                <div
                  key={index}
                  className="text-sm text-foreground p-2 rounded-lg neu-inset cursor-pointer hover:text-primary transition-colors"
                  onClick={() => {
                    const result = entry.split("=")[1].trim();
                    setDisplay(result);
                    setEquation(result);
                    setShowHistory(false);
                  }}
                >
                  {entry}
                </div>
              ))
            )}
          </div>
          {history.length > 0 && (
            <button
              onClick={() => {
                setHistory([]);
                localStorage.removeItem("calcHistory");
              }}
              className="mt-3 text-sm text-destructive hover:underline"
            >
              Clear History
            </button>
          )}
        </div>
      )}

      {/* Display */}
      <div className="neu-inset p-6 mb-6">
        {equation && <div className="text-sm text-muted-foreground mb-2 min-h-5">{equation}</div>}
        <div className="text-4xl md:text-5xl font-bold text-right text-foreground break-all">
          {display}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
        {(['basic', 'scientific', 'convert', 'tools', 'finance', 'settings'] as TabType[]).map((tab) => {
          const icons = {
            basic: '123',
            scientific: 'f(x)',
            convert: <Ruler size={20} />,
            tools: <Wrench size={20} />,
            finance: <DollarSign size={20} />,
            settings: <Settings size={20} />
          };
          
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-2 text-center font-medium transition-colors ${
                activeTab === tab 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {typeof icons[tab] === 'string' ? (
                <span>{icons[tab]}</span>
              ) : (
                <span className="inline-block">{icons[tab]}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mb-4">
        {renderTabContent()}
      </div>


      {/* Basic Buttons */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {basicButtons.flat().map((btn) => (
          <button
            key={btn}
            onClick={() => {
              if (btn === "=") handleEquals();
              else if (["+", "-", "×", "÷"].includes(btn)) handleOperator(btn);
              else handleNumber(btn);
            }}
            className={`neu-button p-6 text-xl font-semibold hover:scale-105 transition-all ${btn === "=" ? "text-primary" : ["+", "-", "×", "÷"].includes(btn) ? "text-accent" : "text-foreground"
              }`}
          >
            {btn}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleClear}
          className="neu-button p-4 text-destructive font-medium hover:scale-105 transition-transform"
        >
          Clear
        </button>
        <button
          onClick={handleDelete}
          className="neu-button p-4 flex items-center justify-center gap-2 text-foreground font-medium hover:scale-105 transition-transform"
        >
          <Delete className="w-5 h-5" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default Calculator;
