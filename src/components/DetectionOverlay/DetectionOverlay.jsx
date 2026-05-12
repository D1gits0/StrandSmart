/**
 * src/components/DetectionOverlay/DetectionOverlay.jsx
 *
 * Renders a soft vignette overlay when the CV backend fires a hand-to-face
 * proximity alert, then opens the Grounding flow after 2 seconds.
 *
 * Behaviour:
 *   • Always renders a small debug badge (top-right) so you can see hook state
 *     without devtools. Remove the <DebugBadge> block when no longer needed.
 *   • isConnected: false  → only debug badge visible, no vignette
 *   • alert: true         → dark-green vignette fades in around screen edges
 *   • After 2 s of alert  → navigates to /grounding
 *   • Dismiss button      → suppresses alerts for 5 minutes
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useDetection from "hooks/useDetection";

const GROUNDING_DELAY_MS = 2000;
const SUPPRESS_MS        = 5 * 60 * 1000;

// ── Debug badge — remove once confirmed working ───────────────────────────────
const DebugBadge = ({ isConnected, alert, confidence, zone }) => (
  <div
    style={{
      position:        "fixed",
      top:             "12px",
      right:           "12px",
      zIndex:          99999,
      background:      "rgba(0,0,0,0.82)",
      border:          `1px solid ${isConnected ? "#00c864" : "#ff4444"}`,
      borderRadius:    "8px",
      padding:         "6px 12px",
      fontSize:        "11px",
      fontFamily:      "monospace",
      color:           "#fff",
      lineHeight:      1.6,
      pointerEvents:   "none",
      backdropFilter:  "blur(6px)",
    }}
  >
    <div>
      CV&nbsp;
      <span style={{ color: isConnected ? "#00c864" : "#ff4444", fontWeight: 700 }}>
        {isConnected ? "CONNECTED" : "OFFLINE"}
      </span>
    </div>
    <div>
      alert&nbsp;
      <span style={{ color: alert ? "#ffcc00" : "#888", fontWeight: 700 }}>
        {alert ? "TRUE" : "false"}
      </span>
      {alert && confidence > 0 && (
        <span style={{ color: "#aaa" }}> ({Math.round(confidence * 100)}% {zone})</span>
      )}
    </div>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
const DetectionOverlay = () => {
  const navigate = useNavigate();
  const { alert: cvAlert, confidence, zone, isConnected } = useDetection();

  const [suppressed,   setSuppressed]   = useState(false);
  const [showVignette, setShowVignette] = useState(false);
  const [countdown,    setCountdown]    = useState(null);

  const suppressTimer  = useRef(null);
  const groundingTimer = useRef(null);
  const countdownTimer = useRef(null);

  // ── Dismiss ───────────────────────────────────────────────────────────────
  const handleDismiss = useCallback(() => {
    setSuppressed(true);
    setShowVignette(false);
    setCountdown(null);
    clearTimeout(groundingTimer.current);
    clearInterval(countdownTimer.current);
    clearTimeout(suppressTimer.current);
    suppressTimer.current = setTimeout(() => setSuppressed(false), SUPPRESS_MS);
  }, []);

  // ── Alert → vignette + grounding timer ───────────────────────────────────
  useEffect(() => {
    if (suppressed) return;

    if (cvAlert && isConnected) {
      setShowVignette(true);

      // Countdown label
      let secs = Math.ceil(GROUNDING_DELAY_MS / 1000);
      setCountdown(secs);
      clearInterval(countdownTimer.current);
      countdownTimer.current = setInterval(() => {
        secs -= 1;
        if (secs <= 0) {
          clearInterval(countdownTimer.current);
          setCountdown(null);
        } else {
          setCountdown(secs);
        }
      }, 1000);

      // Navigate after delay
      clearTimeout(groundingTimer.current);
      groundingTimer.current = setTimeout(() => {
        setShowVignette(false);
        navigate("/grounding");
      }, GROUNDING_DELAY_MS);
    } else {
      // Alert cleared — cancel everything
      setShowVignette(false);
      setCountdown(null);
      clearTimeout(groundingTimer.current);
      clearInterval(countdownTimer.current);
    }

    return () => {
      clearTimeout(groundingTimer.current);
      clearInterval(countdownTimer.current);
    };
  }, [cvAlert, isConnected, suppressed, navigate]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => () => {
    clearTimeout(suppressTimer.current);
    clearTimeout(groundingTimer.current);
    clearInterval(countdownTimer.current);
  }, []);

  return (
    <>
      {/* Debug badge — always visible so you can confirm hook state */}
      <DebugBadge
        isConnected={isConnected}
        alert={cvAlert}
        confidence={confidence}
        zone={zone}
      />

      {/* Vignette */}
      <AnimatePresence>
        {showVignette && (
          <motion.div
            key="vignette"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{
              position:      "fixed",
              inset:         0,
              pointerEvents: "none",
              zIndex:        9998,
              background: `radial-gradient(
                ellipse at center,
                transparent 40%,
                rgba(0, 40, 20, 0.6) 72%,
                rgba(0, 60, 30, 0.88) 100%
              )`,
              boxShadow: "inset 0 0 140px rgba(0, 200, 100, 0.22)",
            }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Countdown label */}
      <AnimatePresence>
        {showVignette && countdown !== null && (
          <motion.div
            key="label"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position:      "fixed",
              bottom:        "5rem",
              left:          "50%",
              transform:     "translateX(-50%)",
              zIndex:        9999,
              pointerEvents: "none",
              color:         "rgba(0, 220, 110, 0.9)",
              fontSize:      "0.9rem",
              fontWeight:    600,
              letterSpacing: "0.06em",
              textAlign:     "center",
              textShadow:    "0 1px 8px rgba(0,0,0,0.8)",
            }}
            aria-live="polite"
          >
            Opening grounding flow in {countdown}…
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dismiss button */}
      <AnimatePresence>
        {showVignette && (
          <motion.button
            key="dismiss"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            onClick={handleDismiss}
            aria-label="Dismiss alert for 5 minutes"
            style={{
              position:      "fixed",
              bottom:        "2rem",
              right:         "2rem",
              zIndex:        9999,
              background:    "rgba(0, 200, 100, 0.14)",
              border:        "1px solid rgba(0, 200, 100, 0.45)",
              borderRadius:  "8px",
              color:         "#00c864",
              padding:       "0.5rem 1.2rem",
              fontSize:      "0.82rem",
              fontWeight:    600,
              cursor:        "pointer",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              letterSpacing: "0.04em",
            }}
          >
            Dismiss (5 min)
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default DetectionOverlay;
