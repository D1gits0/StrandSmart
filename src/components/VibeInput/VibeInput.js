/**
 * src/components/VibeInput/VibeInput.js
 *
 * "What's on your mind?" text area that sits above the UrgeTracker.
 *
 * Props:
 *   value          — controlled string value
 *   onChange(text) — called on every keystroke
 *   onSaveNote     — called when "Save Note" is clicked (standalone reflection)
 *   saving         — bool, disables button while Firestore write is in flight
 *   saved          — bool, shows brief success state
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const SS_GREEN = "#00c864";

const VibeInput = ({ value, onChange, onSaveNote, saving, saved }) => {
  const hasText = value.trim().length > 0;

  return (
    <div style={{ marginBottom: "1.25rem" }}>
      {/* Label */}
      <label
        htmlFor="vibe-input"
        style={{
          display: "block",
          fontSize: "0.78rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          opacity: 0.55,
          marginBottom: "0.6rem",
        }}
      >
        What's on your mind?
      </label>

      {/* Textarea */}
      <textarea
        id="vibe-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Optional: Describe your current mood or triggers…"
        rows={3}
        style={{
          width: "100%",
          background: "rgba(0,200,100,0.04)",
          border: "1px solid rgba(0,200,100,0.18)",
          borderRadius: "6px",
          color: "#fff",
          fontSize: "0.9rem",
          lineHeight: 1.6,
          padding: "0.75rem 1rem",
          resize: "vertical",
          outline: "none",
          transition: "border-color 0.18s ease, box-shadow 0.18s ease",
          fontFamily: "inherit",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = SS_GREEN;
          e.target.style.boxShadow   = `0 0 0 3px rgba(0,200,100,0.12)`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "rgba(0,200,100,0.18)";
          e.target.style.boxShadow   = "none";
        }}
      />

      {/* Save Note button + feedback */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "0.75rem",
          marginTop: "0.6rem",
          minHeight: "2rem",
        }}
      >
        <AnimatePresence>
          {saved && (
            <motion.span
              key="saved"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ fontSize: "0.82rem", color: SS_GREEN }}
            >
              <i className="tim-icons icon-check-2" style={{ marginRight: 4 }} />
              Note saved
            </motion.span>
          )}
        </AnimatePresence>

        <motion.button
          onClick={onSaveNote}
          disabled={!hasText || saving}
          whileHover={hasText && !saving ? { scale: 1.04 } : {}}
          whileTap={hasText && !saving ? { scale: 0.96 } : {}}
          style={{
            background: "transparent",
            border: `1px solid ${hasText ? SS_GREEN : "rgba(255,255,255,0.15)"}`,
            borderRadius: "6px",
            color: hasText ? SS_GREEN : "rgba(255,255,255,0.3)",
            cursor: hasText && !saving ? "pointer" : "not-allowed",
            fontSize: "0.82rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
            padding: "0.35rem 0.9rem",
            transition: "border-color 0.18s ease, color 0.18s ease",
          }}
        >
          {saving ? "Saving…" : "Save Note"}
        </motion.button>
      </div>
    </div>
  );
};

export default VibeInput;
