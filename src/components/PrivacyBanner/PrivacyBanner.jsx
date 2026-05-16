/**
 * src/components/PrivacyBanner/PrivacyBanner.jsx
 *
 * Non-blocking overlay shown once per browser session when the camera
 * first activates. Informs the user that video is processed locally.
 *
 * Behaviour:
 *   • On mount, checks localStorage.getItem("ss_camera_banner_dismissed")
 *   • If "true" → renders nothing
 *   • Otherwise → shows a fixed-position banner with dismiss button
 *   • On dismiss → sets localStorage key and hides the banner
 *
 * Non-blocking: the outer wrapper uses pointerEvents: "none" so the banner
 * never intercepts clicks on the rest of the app. The banner card itself
 * restores pointerEvents: "auto" so the "Got it" button is clickable.
 *
 * Requirements: 12.1, 12.2, 12.3
 */

import React, { useState } from "react";

const STORAGE_KEY = "ss_camera_banner_dismissed";

const PrivacyBanner = () => {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "true"
  );

  if (dismissed) {
    return null;
  }

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setDismissed(true);
  };

  return (
    /* Outer wrapper — pointer-events: none so it never blocks the app */
    <div
      aria-live="polite"
      style={{
        position:      "fixed",
        bottom:        "1.5rem",
        left:          "50%",
        transform:     "translateX(-50%)",
        zIndex:        10000,
        pointerEvents: "none",
        width:         "100%",
        maxWidth:      "520px",
        padding:       "0 1rem",
      }}
    >
      {/* Banner card — pointer-events: auto so the button is clickable */}
      <div
        role="status"
        style={{
          pointerEvents:   "auto",
          background:      "rgba(13, 43, 26, 0.96)",
          border:          "1px solid rgba(0, 200, 100, 0.35)",
          borderRadius:    "10px",
          padding:         "0.85rem 1.1rem",
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "space-between",
          gap:             "1rem",
          boxShadow:       "0 8px 32px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(0, 200, 100, 0.08)",
          backdropFilter:  "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {/* Camera icon + message */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flex: 1 }}>
          <span
            aria-hidden="true"
            style={{
              fontSize:   "1.1rem",
              color:      "#00c864",
              flexShrink: 0,
            }}
          >
            🔒
          </span>
          <p
            style={{
              margin:      0,
              fontSize:    "0.84rem",
              color:       "rgba(255, 255, 255, 0.88)",
              lineHeight:  1.45,
              fontWeight:  400,
            }}
          >
            Camera is active. Your video is processed locally and never
            transmitted or stored.
          </p>
        </div>

        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          style={{
            flexShrink:      0,
            background:      "rgba(0, 200, 100, 0.14)",
            border:          "1px solid rgba(0, 200, 100, 0.45)",
            borderRadius:    "6px",
            color:           "#00c864",
            padding:         "0.38rem 0.9rem",
            fontSize:        "0.8rem",
            fontWeight:      600,
            cursor:          "pointer",
            letterSpacing:   "0.04em",
            whiteSpace:      "nowrap",
            transition:      "background 0.15s ease, box-shadow 0.15s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(0, 200, 100, 0.25)";
            e.currentTarget.style.boxShadow  = "0 4px 14px rgba(0, 200, 100, 0.25)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(0, 200, 100, 0.14)";
            e.currentTarget.style.boxShadow  = "none";
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default PrivacyBanner;
