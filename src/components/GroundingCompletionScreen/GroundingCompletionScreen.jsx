/**
 * src/components/GroundingCompletionScreen/GroundingCompletionScreen.jsx
 *
 * Warm completion screen shown when a grounding session ends.
 *
 * Props:
 *   duration          — string, e.g. "60 seconds" or "1 minute"
 *   onLogUrge         — () => void — navigates to urge logging flow
 *   onBackToDashboard — () => void — navigates to /dashboard
 */

import React from "react";
import { motion } from "framer-motion";

const SS_GREEN = "#00c864";

const GroundingCompletionScreen = ({ duration, onLogUrge, onBackToDashboard }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2.5rem 1.5rem",
        gap: "1.25rem",
      }}
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.1 }}
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "rgba(0,200,100,0.12)",
          border: `2px solid ${SS_GREEN}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 32px rgba(0,200,100,0.25)",
        }}
      >
        <span style={{ fontSize: "2.2rem" }} role="img" aria-label="plant">🌿</span>
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p
          style={{
            fontWeight: 800,
            fontSize: "1.15rem",
            margin: "0 0 0.35rem",
            color: "#fff",
            lineHeight: 1.35,
          }}
        >
          Nice work.
        </p>
        <p
          style={{
            fontSize: "0.92rem",
            opacity: 0.65,
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Your hands stayed busy for{" "}
          <span style={{ color: SS_GREEN, fontWeight: 700 }}>{duration}</span>.
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.65rem",
          width: "100%",
          maxWidth: 280,
        }}
      >
        <button
          onClick={onLogUrge}
          style={{
            background: SS_GREEN,
            border: "none",
            borderRadius: "8px",
            color: "#060f0a",
            cursor: "pointer",
            fontSize: "0.88rem",
            fontWeight: 700,
            padding: "0.7rem 1.25rem",
            letterSpacing: "0.04em",
            boxShadow: "0 4px 16px rgba(0,200,100,0.3)",
            transition: "opacity 0.18s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <i className="tim-icons icon-pencil" style={{ marginRight: 7, fontSize: "0.8rem" }} />
          Log an urge
        </button>

        <button
          onClick={onBackToDashboard}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "8px",
            color: "rgba(255,255,255,0.6)",
            cursor: "pointer",
            fontSize: "0.88rem",
            fontWeight: 600,
            padding: "0.7rem 1.25rem",
            letterSpacing: "0.04em",
            transition: "border-color 0.18s ease, color 0.18s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)";
            e.currentTarget.style.color = "rgba(255,255,255,0.85)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
            e.currentTarget.style.color = "rgba(255,255,255,0.6)";
          }}
        >
          <i className="tim-icons icon-minimal-left" style={{ marginRight: 7, fontSize: "0.8rem" }} />
          Back to dashboard
        </button>
      </motion.div>
    </motion.div>
  );
};

export default GroundingCompletionScreen;
