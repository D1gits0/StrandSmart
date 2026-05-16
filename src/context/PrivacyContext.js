/**
 * src/context/PrivacyContext.js
 *
 * Global Discreet Mode state and CV enabled state.
 *
 * When discreetMode is ON:
 *   - "StrandSmart"  → "Notes"
 *   - "Log Urge"     → "New Note"
 *   - "Grounding"    → "Focus"
 *   - "Dashboard"    → "Notes"
 *   - CSS variables on :root switch to plain white background, black text, system-ui font
 *
 * Usage:
 *   const { discreetMode, toggleDiscreetMode, label, cvEnabled, setCvEnabled } = usePrivacy();
 *   label('StrandSmart')  →  'Notes'     (when discreet)
 *   label('Log Urge')     →  'New Note'  (when discreet)
 *   label('Grounding')    →  'Focus'     (when discreet)
 *   label('Dashboard')    →  'Notes'     (when discreet)
 */

import React, { createContext, useContext, useState, useEffect } from "react";

// Requirements 17.4, 17.5, 17.6, 17.7
export const LABEL_MAP = {
  "StrandSmart": "Notes",
  "Log Urge":    "New Note",
  "Grounding":   "Focus",
  "Dashboard":   "Notes",
};

// CSS variable overrides applied to :root when discreet mode is active
// Requirements 17.1, 17.2 — plain white background, black text, system-ui font
const DISCREET_VARS = {
  "--ss-bg":           "#ffffff",
  "--ss-text":         "#000000",
  "--ss-font":         "system-ui, -apple-system, sans-serif",
  "--ss-green":        "#000000",
  "--ss-green-glow":   "rgba(0,0,0,0.1)",
  "--ss-forest":       "#ffffff",
  "--ss-forest-card":  "rgba(255,255,255,0.9)",
  "--ss-accent-border":"rgba(0,0,0,0.2)",
};

const NORMAL_VARS = {
  "--ss-bg":           "",
  "--ss-text":         "",
  "--ss-font":         "",
  "--ss-green":        "#00c864",
  "--ss-green-glow":   "rgba(0,200,100,0.25)",
  "--ss-forest":       "#0d2b1a",
  "--ss-forest-card":  "rgba(13,43,26,0.7)",
  "--ss-accent-border":"rgba(0,200,100,0.15)",
};

const applyVars = (vars) => {
  Object.entries(vars).forEach(([k, v]) => {
    if (v === "") {
      document.documentElement.style.removeProperty(k);
    } else {
      document.documentElement.style.setProperty(k, v);
    }
  });
};

const applyDiscreetBodyClass = (active) => {
  if (active) {
    document.body.classList.add("discreet-mode");
  } else {
    document.body.classList.remove("discreet-mode");
  }
};

const PrivacyContext = createContext(null);

export const PrivacyProvider = ({ children }) => {
  const [discreetMode, setDiscreetMode] = useState(() => {
    return localStorage.getItem("ss_discreet") === "true";
  });

  // Requirements 27.1, 27.2 — cvEnabled state persisted to localStorage
  const [cvEnabled, setCvEnabledState] = useState(() => {
    const stored = localStorage.getItem("ss_cv_enabled");
    // Default true if not set
    return stored === null ? true : stored === "true";
  });

  useEffect(() => {
    // Requirements 17.1, 17.2 — apply white/black CSS variables when discreet mode is active
    applyVars(discreetMode ? DISCREET_VARS : NORMAL_VARS);
    applyDiscreetBodyClass(discreetMode);
    localStorage.setItem("ss_discreet", discreetMode);
  }, [discreetMode]);

  const toggleDiscreetMode = () => setDiscreetMode((p) => !p);

  // Persist cvEnabled to localStorage on change
  const setCvEnabled = (value) => {
    setCvEnabledState(value);
    localStorage.setItem("ss_cv_enabled", value);
  };

  /**
   * Swap a known brand string when discreet mode is on.
   * Requirements 17.4, 17.5, 17.6, 17.7
   */
  const label = (key) => {
    if (!discreetMode) return key;
    return LABEL_MAP[key] ?? key;
  };

  return (
    <PrivacyContext.Provider
      value={{ discreetMode, toggleDiscreetMode, label, cvEnabled, setCvEnabled }}
    >
      {children}
    </PrivacyContext.Provider>
  );
};

export const usePrivacy = () => {
  const ctx = useContext(PrivacyContext);
  if (!ctx) throw new Error("usePrivacy must be used inside <PrivacyProvider>");
  return ctx;
};

export default PrivacyContext;
