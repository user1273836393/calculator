import { useState, useEffect } from "react";
import { TrendingUp, DollarSign, ArrowLeftRight } from "lucide-react";

const Finance = () => {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [amount, setAmount] = useState("100");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [loading, setLoading] = useState(true);

  const currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "INR", "BRL"];

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      // Using a public API for exchange rates
      const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
      const data = await response.json();
      setRates(data.rates);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch rates:", error);
      // Fallback rates
      setRates({
        USD: 1,
        EUR: 0.85,
        GBP: 0.73,
        JPY: 110.5,
        CAD: 1.25,
        AUD: 1.35,
        CHF: 0.92,
        CNY: 6.45,
        INR: 74.5,
        BRL: 5.25,
      });
      setLoading(false);
    }
  };

  const convert = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || !rates[fromCurrency] || !rates[toCurrency]) return "0.00";

    const inUSD = value / rates[fromCurrency];
    const result = inUSD * rates[toCurrency];
    return result.toFixed(2);
  };

  const swap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-foreground">Finance</h1>

      {/* Currency Converter */}
      <div className="neu-card p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Currency Converter</h2>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading rates...</div>
        ) : (
          <div className="space-y-4">
            {/* From */}
            <div className="neu-inset p-4 rounded-xl">
              <label className="text-sm text-muted-foreground mb-2 block">From</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 text-2xl font-bold bg-transparent outline-none text-foreground"
                  placeholder="100"
                />
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="neu-button px-4 py-2 rounded-lg text-foreground outline-none cursor-pointer font-medium"
                >
                  {currencies.map((curr) => (
                    <option key={curr} value={curr}>
                      {curr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                onClick={swap}
                className="neu-button p-3 rounded-full hover:scale-110 transition-transform"
                aria-label="Swap currencies"
              >
                <ArrowLeftRight className="w-5 h-5 text-primary" />
              </button>
            </div>

            {/* To */}
            <div className="neu-inset p-4 rounded-xl">
              <label className="text-sm text-muted-foreground mb-2 block">To</label>
              <div className="flex gap-2">
                <div className="flex-1 text-2xl font-bold text-primary">{convert()}</div>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="neu-button px-4 py-2 rounded-lg text-foreground outline-none cursor-pointer font-medium"
                >
                  {currencies.map((curr) => (
                    <option key={curr} value={curr}>
                      {curr}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Exchange Rates */}
      <div className="neu-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Exchange Rates (USD Base)</h2>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {currencies.map((curr) => (
              <div key={curr} className="neu-inset p-4 rounded-xl">
                <div className="text-sm text-muted-foreground mb-1">{curr}</div>
                <div className="text-xl font-bold text-foreground">
                  {rates[curr]?.toFixed(4) || "N/A"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Finance;
