import { useState, useEffect, useCallback } from "react";
import {
  Accessibility, X, ZoomIn, ZoomOut, Eye, Link2, Pause, Play,
  Sun, Moon, RotateCcw
} from "lucide-react";

interface A11yState {
  fontSize: number;
  highContrast: boolean;
  highlightLinks: boolean;
  pauseAnimations: boolean;
  darkMode: boolean;
}

const DEFAULT_STATE: A11yState = {
  fontSize: 0,
  highContrast: false,
  highlightLinks: false,
  pauseAnimations: false,
  darkMode: false,
};

const STORAGE_KEY = "a11y-settings";

const AccessibilityPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<A11yState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_STATE, ...JSON.parse(saved) } : DEFAULT_STATE;
    } catch {
      return DEFAULT_STATE;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    const sizes = ["100%", "112.5%", "125%"];
    root.style.fontSize = sizes[settings.fontSize];
    root.classList.toggle("a11y-high-contrast", settings.highContrast);
    root.classList.toggle("a11y-highlight-links", settings.highlightLinks);
    root.classList.toggle("a11y-pause-animations", settings.pauseAnimations);
    root.classList.toggle("dark", settings.darkMode);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const update = useCallback((partial: Partial<A11yState>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const reset = useCallback(() => {
    setSettings(DEFAULT_STATE);
  }, []);

  const fontLabel = ["Normal", "Large", "Extra Large"][settings.fontSize];
  const isModified = JSON.stringify(settings) !== JSON.stringify(DEFAULT_STATE);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close accessibility panel" : "Open accessibility panel"}
        aria-expanded={isOpen}
        className="fixed bottom-6 left-6 z-[60] h-12 w-12 rounded-full bg-secondary text-secondary-foreground shadow-lg flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-background"
      >
        <Accessibility size={22} aria-hidden="true" focusable="false" />
      </button>

      {/* Panel */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-foreground/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-label="Accessibility Settings"
            aria-modal="true"
            className="fixed bottom-20 left-6 z-[61] w-[320px] max-h-[80vh] overflow-y-auto rounded-sm border border-border bg-background shadow-2xl animate-fade-in"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2.5">
                <Accessibility size={18} className="text-secondary" aria-hidden="true" focusable="false" />
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  Accessibility
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close accessibility panel"
                className="rounded-sm p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-secondary transition-colors"
              >
                <X size={18} aria-hidden="true" focusable="false" />
              </button>
            </div>

            {/* Controls */}
            <div className="p-5 space-y-4">
              {/* Font Size */}
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground font-heading">
                  Font Size - {fontLabel}
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => update({ fontSize: Math.max(0, settings.fontSize - 1) as 0 | 1 | 2 })}
                    disabled={settings.fontSize === 0}
                    aria-label="Decrease font size"
                    className="a11y-btn flex-1"
                  >
                    <ZoomOut size={16} aria-hidden="true" focusable="false" />
                    <span>Smaller</span>
                  </button>
                  <button
                    onClick={() => update({ fontSize: Math.min(2, settings.fontSize + 1) as 0 | 1 | 2 })}
                    disabled={settings.fontSize === 2}
                    aria-label="Increase font size"
                    className="a11y-btn flex-1"
                  >
                    <ZoomIn size={16} aria-hidden="true" focusable="false" />
                    <span>Larger</span>
                  </button>
                </div>
              </div>

              <ToggleControl
                icon={<Eye size={16} />}
                label="High Contrast"
                checked={settings.highContrast}
                onChange={(v) => update({ highContrast: v })}
              />
              <ToggleControl
                icon={<Link2 size={16} />}
                label="Highlight Links"
                checked={settings.highlightLinks}
                onChange={(v) => update({ highlightLinks: v })}
              />
              <ToggleControl
                icon={settings.pauseAnimations ? <Play size={16} /> : <Pause size={16} />}
                label="Pause Animations"
                checked={settings.pauseAnimations}
                onChange={(v) => update({ pauseAnimations: v })}
              />
              <ToggleControl
                icon={settings.darkMode ? <Sun size={16} /> : <Moon size={16} />}
                label="Dark Mode"
                checked={settings.darkMode}
                onChange={(v) => update({ darkMode: v })}
              />

              {isModified && (
                <button
                  onClick={reset}
                  aria-label="Reset all accessibility settings"
                  className="w-full mt-2 flex items-center justify-center gap-2 rounded-sm border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary font-body"
                >
                  <RotateCcw size={14} aria-hidden="true" focusable="false" />
                  Reset All Settings
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

const ToggleControl = ({
  icon, label, checked, onChange,
}: {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) => (
  <button
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`a11y-btn w-full justify-between ${checked ? "a11y-btn-active" : ""}`}
  >
    <span className="flex items-center gap-2">
      {icon}
      {label}
    </span>
    <span
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        checked ? "bg-secondary" : "bg-muted"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-background shadow-sm transition-transform ${
          checked ? "translate-x-[18px]" : "translate-x-[3px]"
        }`}
      />
    </span>
  </button>
);

export default AccessibilityPanel;
