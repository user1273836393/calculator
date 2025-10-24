import { useState, useEffect } from "react";
import { Sun, Moon, Palette, Info } from "lucide-react";

const Settings = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" || "light";
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-foreground">Settings</h1>

      {/* Theme Settings */}
      <div className="neu-card p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Appearance</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Theme</p>
              <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
            </div>
            <button
              onClick={toggleTheme}
              className="neu-button p-4 rounded-full hover:scale-110 transition-transform"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-6 h-6 text-foreground" />
              ) : (
                <Sun className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="neu-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">About</h2>
        </div>

        <div className="space-y-3 text-sm">
          <div className="neu-inset p-4 rounded-xl">
            <p className="text-muted-foreground mb-1">App Name</p>
            <p className="font-medium text-foreground">Smart Calculator</p>
          </div>
          <div className="neu-inset p-4 rounded-xl">
            <p className="text-muted-foreground mb-1">Version</p>
            <p className="font-medium text-foreground">1.0.0</p>
          </div>
          <div className="neu-inset p-4 rounded-xl">
            <p className="text-muted-foreground mb-1">Features</p>
            <ul className="mt-2 space-y-1 text-foreground">
              <li>• Basic & Scientific Calculator</li>
              <li>• Unit Converter</li>
              <li>• BMI Calculator</li>
              <li>• Date Calculator</li>
              <li>• Random Number Generator</li>
              <li>• Discount Calculator</li>
              <li>• Currency Converter</li>
              <li>• PWA Enabled</li>
              <li>• Offline Support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
