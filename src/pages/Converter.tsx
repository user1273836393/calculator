import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";

type ConversionType = "length" | "mass" | "temperature" | "area" | "volume" | "data";

interface ConversionUnit {
  name: string;
  symbol: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

const Converter = () => {
  const [type, setType] = useState<ConversionType>("length");
  const [fromValue, setFromValue] = useState("1");
  const [fromUnit, setFromUnit] = useState(0);
  const [toUnit, setToUnit] = useState(1);

  const conversions: Record<ConversionType, ConversionUnit[]> = {
    length: [
      { name: "Meter", symbol: "m", toBase: (v) => v, fromBase: (v) => v },
      { name: "Kilometer", symbol: "km", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { name: "Centimeter", symbol: "cm", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      { name: "Millimeter", symbol: "mm", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { name: "Mile", symbol: "mi", toBase: (v) => v * 1609.34, fromBase: (v) => v / 1609.34 },
      { name: "Yard", symbol: "yd", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      { name: "Foot", symbol: "ft", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { name: "Inch", symbol: "in", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    ],
    mass: [
      { name: "Kilogram", symbol: "kg", toBase: (v) => v, fromBase: (v) => v },
      { name: "Gram", symbol: "g", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { name: "Milligram", symbol: "mg", toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
      { name: "Metric Ton", symbol: "t", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { name: "Pound", symbol: "lb", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
      { name: "Ounce", symbol: "oz", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    ],
    temperature: [
      { name: "Celsius", symbol: "°C", toBase: (v) => v, fromBase: (v) => v },
      { name: "Fahrenheit", symbol: "°F", toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
      { name: "Kelvin", symbol: "K", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
    area: [
      { name: "Square Meter", symbol: "m²", toBase: (v) => v, fromBase: (v) => v },
      { name: "Square Kilometer", symbol: "km²", toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
      { name: "Square Centimeter", symbol: "cm²", toBase: (v) => v / 10000, fromBase: (v) => v * 10000 },
      { name: "Hectare", symbol: "ha", toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
      { name: "Acre", symbol: "ac", toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
      { name: "Square Mile", symbol: "mi²", toBase: (v) => v * 2589988, fromBase: (v) => v / 2589988 },
      { name: "Square Foot", symbol: "ft²", toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
    ],
    volume: [
      { name: "Liter", symbol: "L", toBase: (v) => v, fromBase: (v) => v },
      { name: "Milliliter", symbol: "mL", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { name: "Cubic Meter", symbol: "m³", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { name: "Gallon (US)", symbol: "gal", toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
      { name: "Quart (US)", symbol: "qt", toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
      { name: "Pint (US)", symbol: "pt", toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
      { name: "Cup (US)", symbol: "cup", toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
    ],
    data: [
      { name: "Byte", symbol: "B", toBase: (v) => v, fromBase: (v) => v },
      { name: "Kilobyte", symbol: "KB", toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      { name: "Megabyte", symbol: "MB", toBase: (v) => v * 1048576, fromBase: (v) => v / 1048576 },
      { name: "Gigabyte", symbol: "GB", toBase: (v) => v * 1073741824, fromBase: (v) => v / 1073741824 },
      { name: "Terabyte", symbol: "TB", toBase: (v) => v * 1099511627776, fromBase: (v) => v / 1099511627776 },
    ],
  };

  const convert = () => {
    const value = parseFloat(fromValue);
    if (isNaN(value)) return "0";

    const units = conversions[type];
    const baseValue = units[fromUnit].toBase(value);
    const result = units[toUnit].fromBase(baseValue);

    return result.toFixed(6).replace(/\.?0+$/, "");
  };

  const swap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-foreground">Unit Converter</h1>

      {/* Type Selector */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {(Object.keys(conversions) as ConversionType[]).map((t) => (
          <button
            key={t}
            onClick={() => {
              setType(t);
              setFromUnit(0);
              setToUnit(1);
            }}
            className={`py-3 rounded-xl font-medium capitalize transition-all ${type === t ? "neu-pressed text-primary" : "neu-button text-muted-foreground"
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Conversion Area */}
      <div className="space-y-4">
        {/* From */}
        <div className="neu-card p-6">
          <label className="text-sm text-muted-foreground mb-2 block">From</label>
          <input
            type="number"
            value={fromValue}
            onChange={(e) => setFromValue(e.target.value)}
            className="w-full text-3xl font-bold bg-transparent outline-none text-foreground mb-4"
            placeholder="Enter value"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(Number(e.target.value))}
            className="w-full neu-inset p-3 rounded-xl text-foreground outline-none cursor-pointer"
          >
            {conversions[type].map((unit, index) => (
              <option key={index} value={index}>
                {unit.name} ({unit.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={swap}
            className="neu-button p-4 rounded-full hover:scale-110 transition-transform"
            aria-label="Swap units"
          >
            <ArrowLeftRight className="w-6 h-6 text-primary" />
          </button>
        </div>

        {/* To */}
        <div className="neu-card p-6">
          <label className="text-sm text-muted-foreground mb-2 block">To</label>
          <div className="text-3xl font-bold text-primary mb-4">{convert()}</div>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(Number(e.target.value))}
            className="w-full neu-inset p-3 rounded-xl text-foreground outline-none cursor-pointer"
          >
            {conversions[type].map((unit, index) => (
              <option key={index} value={index}>
                {unit.name} ({unit.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Converter;
