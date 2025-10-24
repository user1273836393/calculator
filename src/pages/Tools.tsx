import { useState } from "react";
import { Activity, Calendar, Shuffle, Percent } from "lucide-react";

type Tool = "bmi" | "date" | "random" | "discount";

const Tools = () => {
  const [activeTool, setActiveTool] = useState<Tool>("bmi");

  // BMI Calculator
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);

  const calculateBMI = () => {
    const h = parseFloat(height) / 100; // convert to meters
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      setBmi(w / (h * h));
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-blue-500" };
    if (bmi < 25) return { category: "Normal", color: "text-green-500" };
    if (bmi < 30) return { category: "Overweight", color: "text-yellow-500" };
    return { category: "Obese", color: "text-red-500" };
  };

  // Date Calculator
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [dateDiff, setDateDiff] = useState<string>("");

  const calculateDateDiff = () => {
    if (date1 && date2) {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      const diff = Math.abs(d2.getTime() - d1.getTime());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const years = Math.floor(days / 365);
      const months = Math.floor((days % 365) / 30);
      const remainingDays = (days % 365) % 30;
      setDateDiff(`${years} years, ${months} months, ${remainingDays} days`);
    }
  };

  // Random Number Generator
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [randomNum, setRandomNum] = useState<number | null>(null);

  const generateRandom = () => {
    const minNum = parseInt(min);
    const maxNum = parseInt(max);
    if (minNum < maxNum) {
      setRandomNum(Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
    }
  };

  // Discount Calculator
  const [originalPrice, setOriginalPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [finalPrice, setFinalPrice] = useState<number | null>(null);

  const calculateDiscount = () => {
    const price = parseFloat(originalPrice);
    const disc = parseFloat(discount);
    if (price > 0 && disc >= 0 && disc <= 100) {
      setFinalPrice(price - (price * disc) / 100);
    }
  };

  const tools = [
    { id: "bmi" as Tool, name: "BMI", icon: Activity },
    { id: "date" as Tool, name: "Date", icon: Calendar },
    { id: "random" as Tool, name: "Random", icon: Shuffle },
    { id: "discount" as Tool, name: "Discount", icon: Percent },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-foreground">Tools</h1>

      {/* Tool Selector */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`flex flex-col items-center gap-2 py-4 rounded-xl transition-all ${activeTool === tool.id ? "neu-pressed text-primary" : "neu-button text-muted-foreground"
              }`}
          >
            <tool.icon className="w-6 h-6" />
            <span className="text-xs font-medium">{tool.name}</span>
          </button>
        ))}
      </div>

      {/* BMI Calculator */}
      {activeTool === "bmi" && (
        <div className="neu-card p-6 animate-fade-in">
          <h2 className="text-xl font-semibold mb-4 text-foreground">BMI Calculator</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full neu-inset p-4 rounded-xl text-foreground outline-none"
                placeholder="170"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full neu-inset p-4 rounded-xl text-foreground outline-none"
                placeholder="70"
              />
            </div>
            <button
              onClick={calculateBMI}
              className="w-full neu-button p-4 rounded-xl font-medium text-primary hover:scale-105 transition-transform"
            >
              Calculate BMI
            </button>
            {bmi && (
              <div className="neu-inset p-6 rounded-xl text-center animate-fade-in">
                <div className="text-4xl font-bold text-primary mb-2">{bmi.toFixed(1)}</div>
                <div className={`text-lg font-medium ${getBMICategory(bmi).color}`}>
                  {getBMICategory(bmi).category}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Date Calculator */}
      {activeTool === "date" && (
        <div className="neu-card p-6 animate-fade-in">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Date Calculator</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">From Date</label>
              <input
                type="date"
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
                className="w-full neu-inset p-4 rounded-xl text-foreground outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">To Date</label>
              <input
                type="date"
                value={date2}
                onChange={(e) => setDate2(e.target.value)}
                className="w-full neu-inset p-4 rounded-xl text-foreground outline-none"
              />
            </div>
            <button
              onClick={calculateDateDiff}
              className="w-full neu-button p-4 rounded-xl font-medium text-primary hover:scale-105 transition-transform"
            >
              Calculate Difference
            </button>
            {dateDiff && (
              <div className="neu-inset p-6 rounded-xl text-center animate-fade-in">
                <div className="text-xl font-bold text-primary">{dateDiff}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Random Number Generator */}
      {activeTool === "random" && (
        <div className="neu-card p-6 animate-fade-in">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Random Number Generator</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Min</label>
                <input
                  type="number"
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                  className="w-full neu-inset p-4 rounded-xl text-foreground outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Max</label>
                <input
                  type="number"
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                  className="w-full neu-inset p-4 rounded-xl text-foreground outline-none"
                />
              </div>
            </div>
            <button
              onClick={generateRandom}
              className="w-full neu-button p-4 rounded-xl font-medium text-primary hover:scale-105 transition-transform"
            >
              Generate Random Number
            </button>
            {randomNum !== null && (
              <div className="neu-inset p-8 rounded-xl text-center animate-fade-in">
                <div className="text-5xl font-bold text-primary">{randomNum}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Discount Calculator */}
      {activeTool === "discount" && (
        <div className="neu-card p-6 animate-fade-in">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Discount Calculator</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Original Price ($)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full neu-inset p-4 rounded-xl text-foreground outline-none"
                placeholder="100"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Discount (%)</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full neu-inset p-4 rounded-xl text-foreground outline-none"
                placeholder="20"
              />
            </div>
            <button
              onClick={calculateDiscount}
              className="w-full neu-button p-4 rounded-xl font-medium text-primary hover:scale-105 transition-transform"
            >
              Calculate Final Price
            </button>
            {finalPrice !== null && (
              <div className="neu-inset p-6 rounded-xl animate-fade-in">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Original:</span>
                  <span className="text-foreground line-through">${originalPrice}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Discount:</span>
                  <span className="text-green-500">-{discount}%</span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-foreground">Final Price:</span>
                    <span className="text-2xl font-bold text-primary">${finalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tools;
