/**
 * src/context/PrivacyContext.js
 *
 * Global Discreet Mode state.
 *
 * When discreetMode is ON:
 *   - Brand name "StrandSmart" → "SmartNote"
 *   - "Urge Tracker" → "Activity Log"
 *   - CSS variables on :root switch the emerald palette to neutral gray/blue
 *
 * Usage:
 *   const { discreetMode, toggleDiscreetMode, label } = usePrivacy();
 *   label('StrandSmart')  →  'SmartNote'  (when discreet)
 *   label('Urge Tracker') →  'Activity Log'
 */

import React, { createContext, useContext, useState, useEffect } from "react";

const LABEL_MAP = {
  "StrandSmart":   "SmartNote",
  "Strandsmart":   "SmartNote",
  "Urge Tracker":  "Activity Log",
  "Log Urge":      "Log Activity",
  "Urge Logged":   "Activity Logged",
  "Urge":          "Activity",
};

// CSS variable overrides applied to :root when discreet mode is active
const DISCREET_VARS = {
  "--ss-green":        "#4a90d9",
  "--ss-green-glow":   "rgba(74,144,217,0.25)",
  "--ss-forest":       "#1a1f2e",
  "--ss-forest-card":  "rgba(26,31,46,0.7)",
  "--ss-accent-border":"rgba(74,144,217,0.2)",
};

const NORMAL_VARS = {
  "--ss-green":        "#00c864",
  "--ss-green-glow":   "rgba(0,200,100,0.25)",
  "--ss-forest":       "#0d2b1a",
  "--ss-forest-card":  "rgba(13,43,26,0.7)",
  "--ss-accent-border":"rgba(0,200,100,0.15)",
};

const applyVars = (vars) => {
  Object.entries(vars).forEach(([k, v]) => {
    document.documentElement.style.setProperty(k, v);
  });
};

const PrivacyContext = createContext(null);

export const PrivacyProvider = ({ children }) => {
  const [discreetMode, setDiscreetMode] = useState(() => {
    // Persist across page refreshes
    return localStorage.getItem("ss_discreet") === "true";
  });

  useEffect(() => {
    applyVars(discreetMode ? DISCREET_VARS : NORMAL_VARS);
    localStorage.setItem("ss_discreet", discreetMode);
  }, [discreetMode]);

  const toggleDiscreetMode = () => setDiscreetMode((p) => !p);

  /** Swap a known brand string when discreet mode is on */
  const label = (str) => {
    if (!discreetMode) return str;
    return LABEL_MAP[str] ?? str;
  };

  return (
    <PrivacyContext.Provider value={{ discreetMode, toggleDiscreetMode, label }}>
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
