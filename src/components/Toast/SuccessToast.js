/**
 * src/components/Toast/SuccessToast.js
 *
 * A lightweight, self-dismissing toast notification.
 * Slides in from the bottom-right, auto-dismisses after `duration` ms.
 *
 * Props:
 *   message   — string to display
 *   visible   — boolean controlling visibility
 *   onDismiss — called when the toast finishes or is closed
 *   duration  — ms before auto-dismiss (default 4000)
 */

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SS_GREEN = "#00c864";

const SuccessToast = ({ message, visible, onDismiss, duration = 4000 }) => {
  useEffect(() => {
    if (!visible) return;
    const id = setTimeout(onDismiss, duration);
    return () => clearTimeout(id);
  }, [visible, duration, onDismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{    opacity: 0, y: 20,  scale: 0.95 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          style={{
            position:     "fixed",
            bottom:       "2rem",
            right:        "2rem",
            zIndex:       9999,
            background:   "#0d2b1a",
            border:       `1px solid rgba(0,200,100,0.4)`,
            borderRadius: "8px",
            padding:      "0.9rem 1.25rem",
            display:      "flex",
            alignItems:   "center",
            gap:          "0.75rem",
            boxShadow:    "0 8px 32px rgba(0,0,0,0.5)",
            maxWidth:     320,
            cursor:       "pointer",
          }}
          onClick={onDismiss}
          role="alert"
          aria-live="polite"
        >
          {/* Icon */}
          <div
            style={{
              width:          36,
              height:         36,
              borderRadius:   "50%",
              background:     "rgba(0,200,100,0.15)",
              border:         `1px solid rgba(0,200,100,0.4)`,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              flexShrink:     0,
            }}
          >
            <i className="tim-icons icon-check-2" style={{ color: SS_GREEN, fontSize: "1rem" }} />
          </div>

          {/* Message */}
          <p style={{ margin: 0, fontSize: "0.88rem", fontWeight: 600, lineHeight: 1.4 }}>
            {message}
          </p>

          {/* Dismiss × */}
          <button
            onClick={(e) => { e.stopPropagation(); onDismiss(); }}
            style={{
              background:  "none",
              border:      "none",
              color:       "rgba(255,255,255,0.4)",
              cursor:      "pointer",
              fontSize:    "1rem",
              lineHeight:  1,
              padding:     0,
              marginLeft:  "auto",
              flexShrink:  0,
            }}
            aria-label="Dismiss"
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessToast;
