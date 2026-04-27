/**
 * src/components/FAB/FloatingActionButton.js
 *
 * Persistent fixed button at bottom-right of the viewport.
 *
 * Single tap  → opens a glassmorphism popup with a 1–10 intensity slider
 *               to log an urge without leaving the current page.
 * Double tap  → immediately navigates to /grounding.
 *               (Two taps within 350ms = double tap)
 *
 * Nudge pulse → if the user hasn't logged an urge in 4+ hours, the FAB
 *               pulses with a gentle green glow animation.
 *
 * Props:
 *   recentLogs  — from useUrgeLog, used to compute nudge timing
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useUrgeLog from "hooks/useUrgeLog";
import { usePrivacy } from "context/PrivacyContext";

const SS_GREEN  = "#00c864";
const DOUBLE_TAP_MS  = 350;
const NUDGE_HOURS    = 4;

// ── Intensity slider ───────────────────────────────────────────────────────────
const IntensitySlider = ({ value, onChange }) => (
  <div style={{ margin: "1rem 0" }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
      <span style={{ fontSize: "0.72rem", opacity: 0.5 }}>Mild</span>
      <span style={{ fontWeight: 700, fontSize: "1.1rem", color: SS_GREEN }}>{value}</span>
      <span style={{ fontSize: "0.72rem", opacity: 0.5 }}>Intense</span>
    </div>
    <input
      type="range"
      min={1}
      max={10}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        width:       "100%",
        accentColor: SS_GREEN,
        cursor:      "pointer",
        height:      6,
      }}
    />
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.25rem" }}>
      {[1,2,3,4,5,6,7,8,9,10].map((n) => (
        <span key={n} style={{ fontSize: "0.6rem", opacity: n === value ? 1 : 0.25, color: SS_GREEN }}>
          {n}
        </span>
      ))}
    </div>
  </div>
);

// ── Popup ──────────────────────────────────────────────────────────────────────
const FABPopup = ({ onClose, onLogged }) => {
  const { logUrge }    = useUrgeLog();
  const { label }      = usePrivacy();
  const [intensity, setIntensity] = useState(5);
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);

  const handleLog = async () => {
    setSaving(true);
    try {
      await logUrge(`Intensity: ${intensity}/10`);
      setSaved(true);
      setTimeout(() => { onLogged(); onClose(); }, 1400);
    } catch (err) {
      console.error("FAB logUrge error:", err);
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 16 }}
      animate={{ opacity: 1, scale: 1,    y: 0  }}
      exit={{   opacity: 0, scale: 0.88,  y: 16 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      style={{
        position:        "fixed",
        bottom:          "5.5rem",
        right:           "1.5rem",
        zIndex:          9998,
        width:           300,
        background:      "rgba(13,43,26,0.88)",
        backdropFilter:  "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border:          "1px solid rgba(0,200,100,0.25)",
        borderRadius:    "14px",
        padding:         "1.25rem 1.5rem",
        boxShadow:       "0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,200,100,0.08)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.1rem" }}>
            {label("Log Urge")}
          </p>
          <p style={{ fontSize: "0.75rem", opacity: 0.45, marginBottom: 0 }}>
            How intense is it right now?
          </p>
        </div>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "1.1rem", lineHeight: 1, padding: 0 }}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {/* Slider */}
      <IntensitySlider value={intensity} onChange={setIntensity} />

      {/* Actions */}
      {saved ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: "center", color: SS_GREEN, fontWeight: 600, fontSize: "0.9rem", margin: "0.5rem 0 0" }}
        >
          <i className="tim-icons icon-check-2" style={{ marginRight: 5 }} />
          Logged ✓
        </motion.p>
      ) : (
        <button
          onClick={handleLog}
          disabled={saving}
          style={{
            width:        "100%",
            background:   saving ? "rgba(0,200,100,0.4)" : SS_GREEN,
            border:       "none",
            borderRadius: "8px",
            color:        "#000",
            fontWeight:   700,
            fontSize:     "0.9rem",
            padding:      "0.6rem",
            cursor:       saving ? "not-allowed" : "pointer",
            marginTop:    "0.5rem",
            transition:   "background 0.15s ease",
          }}
        >
          {saving ? "Saving…" : `Log — ${intensity}/10`}
        </button>
      )}

      {/* Double-tap hint */}
      <p style={{ fontSize: "0.68rem", opacity: 0.3, textAlign: "center", marginTop: "0.75rem", marginBottom: 0 }}>
        Double-tap the button to go to Grounding
      </p>
    </motion.div>
  );
};

// ── Main FAB ───────────────────────────────────────────────────────────────────
const FloatingActionButton = () => {
  const navigate          = useNavigate();
  const { recentLogs }    = useUrgeLog();
  const { label }         = usePrivacy();
  const [open, setOpen]   = useState(false);
  const [logged, setLogged] = useState(false);
  const lastTapRef        = useRef(0);

  // ── Nudge: pulse if no log in 4+ hours ──────────────────────────────────────
  const shouldNudge = (() => {
    if (!recentLogs.length) return false;
    const latest = recentLogs[0]?.loggedAt;
    if (!(latest instanceof Date)) return false;
    const hoursAgo = (Date.now() - latest.getTime()) / 3_600_000;
    return hoursAgo >= NUDGE_HOURS;
  })();

  // ── Tap handler ──────────────────────────────────────────────────────────────
  const handleTap = useCallback(() => {
    const now = Date.now();
    const gap = now - lastTapRef.current;
    lastTapRef.current = now;

    if (gap < DOUBLE_TAP_MS) {
      // Double tap → grounding
      setOpen(false);
      navigate("/grounding");
    } else {
      // Single tap → toggle popup
      setOpen((p) => !p);
    }
  }, [navigate]);

  // Close popup on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!e.target.closest("[data-fab]")) setOpen(false);
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [open]);

  return (
    <>
      {/* Popup */}
      <AnimatePresence>
        {open && (
          <div data-fab>
            <FABPopup
              onClose={() => setOpen(false)}
              onLogged={() => setLogged(true)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <div data-fab style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 9999 }}>
        {/* Nudge pulse ring — only visible when shouldNudge */}
        {shouldNudge && (
          <motion.div
            animate={{ scale: [1, 1.55, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position:     "absolute",
              inset:        -6,
              borderRadius: "50%",
              border:       `2px solid ${SS_GREEN}`,
              pointerEvents: "none",
            }}
          />
        )}

        <motion.button
          onClick={handleTap}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width:        56,
            height:       56,
            borderRadius: "50%",
            background:   open
              ? "rgba(0,200,100,0.85)"
              : `linear-gradient(135deg, ${SS_GREEN} 0%, #00a050 100%)`,
            border:       "none",
            cursor:       "pointer",
            display:      "flex",
            alignItems:   "center",
            justifyContent: "center",
            boxShadow:    open
              ? `0 0 0 4px rgba(0,200,100,0.2), 0 8px 24px rgba(0,0,0,0.5)`
              : `0 6px 20px rgba(0,200,100,0.4), 0 4px 12px rgba(0,0,0,0.4)`,
            transition:   "background 0.2s ease, box-shadow 0.2s ease",
            position:     "relative",
          }}
          aria-label={open ? "Close urge logger" : label("Log Urge")}
          title="Single tap to log · Double tap for Grounding"
        >
          <motion.i
            className={open ? "tim-icons icon-simple-remove" : "tim-icons icon-heart-2"}
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ color: "#fff", fontSize: "1.3rem" }}
          />
        </motion.button>
      </div>
    </>
  );
};

export default FloatingActionButton;
