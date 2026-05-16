/**
 * src/components/CVStatusCard/CVStatusCard.jsx
 *
 * Hero card on the Dashboard showing CV connection state.
 *
 * Props:
 *   isConnected — bool: whether the CV backend WebSocket is connected
 *
 * Connected state (isConnected=true):
 *   - Camera active indicator (green dot with pulse animation)
 *   - "CV Connected" label
 *   - Live pulse animation that activates when the model is analyzing frames
 *   - Note that detection logs are local only and never transmitted
 *
 * Disconnected state (isConnected=false):
 *   - Friendly explainer text
 *   - "Set up CV detection" button linking to /settings#cv-detection
 *   - Note that detection logs are local only and never transmitted
 *
 * Requirements: 7.2, 7.3, 7.4, 16.2
 */

import React from "react";
import { Link } from "react-router-dom";

// ── Keyframe injection ────────────────────────────────────────────────────────
// Inject pulse and ripple keyframes once into the document head.

const STYLE_ID = "cv-status-card-keyframes";

if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes cvDotPulse {
      0%   { box-shadow: 0 0 0 0 rgba(0, 200, 100, 0.55); }
      70%  { box-shadow: 0 0 0 8px rgba(0, 200, 100, 0); }
      100% { box-shadow: 0 0 0 0 rgba(0, 200, 100, 0); }
    }

    @keyframes cvRipple {
      0%   { transform: scale(1);   opacity: 0.6; }
      100% { transform: scale(2.4); opacity: 0; }
    }

    @keyframes cvFadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}

// ── Styles ────────────────────────────────────────────────────────────────────

/** Outer card — visually prominent with a distinct green accent border */
const cardStyle = {
  background:      "rgba(13, 43, 26, 0.82)",
  border:          "1px solid rgba(0, 200, 100, 0.45)",
  borderRadius:    "12px",
  padding:         "1.1rem 1.35rem",
  boxShadow:       "0 4px 24px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(0, 200, 100, 0.08)",
  backdropFilter:  "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  color:           "#fff",
  fontFamily:      "inherit",
  animation:       "cvFadeIn 0.3s ease both",
  marginBottom:    "1.25rem",
};

/** Top row: indicator + label */
const headerRowStyle = {
  display:        "flex",
  alignItems:     "center",
  gap:            "0.65rem",
  marginBottom:   "0.55rem",
};

/** Wrapper for the animated dot + ripple rings */
const dotWrapperStyle = {
  position:   "relative",
  width:      14,
  height:     14,
  flexShrink: 0,
};

/** The solid green dot */
const dotStyle = {
  position:     "absolute",
  inset:        0,
  borderRadius: "50%",
  background:   "#00c864",
  animation:    "cvDotPulse 1.8s ease-out infinite",
};

/** Ripple ring behind the dot */
const rippleStyle = {
  position:     "absolute",
  inset:        0,
  borderRadius: "50%",
  border:       "2px solid rgba(0, 200, 100, 0.5)",
  animation:    "cvRipple 1.8s ease-out infinite",
};

/** "CV Connected" label */
const connectedLabelStyle = {
  fontWeight:   700,
  fontSize:     "0.95rem",
  color:        "#00c864",
  letterSpacing: "0.01em",
};

/** Disconnected icon */
const disconnectedIconStyle = {
  width:        14,
  height:       14,
  borderRadius: "50%",
  background:   "rgba(255, 255, 255, 0.18)",
  flexShrink:   0,
};

/** Disconnected label */
const disconnectedLabelStyle = {
  fontWeight:   600,
  fontSize:     "0.95rem",
  color:        "rgba(255, 255, 255, 0.55)",
};

/** Body text */
const bodyTextStyle = {
  fontSize:    "0.84rem",
  color:       "rgba(255, 255, 255, 0.72)",
  lineHeight:  1.55,
  margin:      "0 0 0.75rem",
};

/** Privacy note at the bottom of both states */
const privacyNoteStyle = {
  display:     "flex",
  alignItems:  "flex-start",
  gap:         "0.4rem",
  marginTop:   "0.65rem",
  fontSize:    "0.76rem",
  color:       "rgba(255, 255, 255, 0.42)",
  lineHeight:  1.45,
};

/** "Set up CV detection" button */
const setupBtnStyle = {
  display:       "inline-block",
  background:    "rgba(0, 200, 100, 0.12)",
  border:        "1px solid rgba(0, 200, 100, 0.4)",
  borderRadius:  "7px",
  color:         "#00c864",
  padding:       "0.45rem 1.1rem",
  fontSize:      "0.84rem",
  fontWeight:    700,
  textDecoration: "none",
  cursor:        "pointer",
  transition:    "background 0.15s ease, box-shadow 0.15s ease",
  letterSpacing: "0.02em",
};

// ── Sub-components ────────────────────────────────────────────────────────────

/** Shared privacy note rendered in both states (Requirement 16.2) */
const PrivacyNote = () => (
  <div style={privacyNoteStyle} aria-label="Privacy note">
    <span aria-hidden="true" style={{ flexShrink: 0 }}>🔒</span>
    <span>Detection logs are local only and never transmitted.</span>
  </div>
);

/** Connected state — camera active indicator + pulse animation */
const ConnectedState = () => (
  <>
    {/* Header row: animated dot + label */}
    <div style={headerRowStyle}>
      <div style={dotWrapperStyle} aria-hidden="true">
        <div style={rippleStyle} />
        <div style={dotStyle} />
      </div>
      <span style={connectedLabelStyle}>CV Connected</span>
    </div>

    {/* Status description */}
    <p style={bodyTextStyle}>
      Real-time hand-to-face detection is active. The model is analyzing frames
      locally on your device.
    </p>

    <PrivacyNote />
  </>
);

/** Disconnected state — explainer + setup button */
const DisconnectedState = () => (
  <>
    {/* Header row: muted dot + label */}
    <div style={headerRowStyle}>
      <div style={disconnectedIconStyle} aria-hidden="true" />
      <span style={disconnectedLabelStyle}>CV Not Connected</span>
    </div>

    {/* Friendly explainer (Requirement 7.3) */}
    <p style={bodyTextStyle}>
      CV detection adds real-time awareness. It runs locally on your device —
      no video or images ever leave your computer.
    </p>

    {/* "Set up CV detection" button → /settings#cv-detection (Requirement 7.3) */}
    <Link
      to="/settings#cv-detection"
      style={setupBtnStyle}
      onMouseEnter={e => {
        e.currentTarget.style.background  = "rgba(0, 200, 100, 0.22)";
        e.currentTarget.style.boxShadow   = "0 4px 14px rgba(0, 200, 100, 0.25)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background  = "rgba(0, 200, 100, 0.12)";
        e.currentTarget.style.boxShadow   = "none";
      }}
    >
      Set up CV detection
    </Link>

    <PrivacyNote />
  </>
);

// ── CVStatusCard ──────────────────────────────────────────────────────────────

/**
 * CVStatusCard
 *
 * @param {{ isConnected: boolean }} props
 */
const CVStatusCard = ({ isConnected }) => (
  <div
    style={cardStyle}
    role="region"
    aria-label={isConnected ? "CV detection connected" : "CV detection not connected"}
    data-testid="cv-status-card"
  >
    {isConnected ? <ConnectedState /> : <DisconnectedState />}
  </div>
);

export default CVStatusCard;
