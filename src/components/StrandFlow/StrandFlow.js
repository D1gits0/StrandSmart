/**
 * src/components/StrandFlow/StrandFlow.js
 *
 * The Digital Fidget canvas widget.
 *
 * Props:
 *   onSessionComplete(secondsLeft) — called when the 60s timer finishes
 */

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useStrandCanvas   from "hooks/useStrandCanvas";
import useGroundingTimer from "hooks/useGroundingTimer";

const SS_GREEN  = "#00c864";
const SS_FOREST = "#0d2b1a";
const DURATION  = 60;

// ── Progress bar ──────────────────────────────────────────────────────────────
const ProgressBar = ({ progress, secondsLeft, isComplete }) => (
  <div style={{ marginBottom: "0.75rem" }}>
    <div
      style={{
        display:        "flex",
        justifyContent: "space-between",
        alignItems:     "center",
        marginBottom:   "0.4rem",
      }}
    >
      <span style={{ fontSize: "0.75rem", opacity: 0.5, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {isComplete ? "Session complete 🌿" : "Draw to start the timer"}
      </span>
      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: SS_GREEN }}>
        {isComplete ? "60s" : `${secondsLeft}s`}
      </span>
    </div>
    <div
      style={{
        height:       6,
        borderRadius: 3,
        background:   "rgba(255,255,255,0.07)",
        overflow:     "hidden",
      }}
    >
      <motion.div
        animate={{ width: `${progress * 100}%` }}
        transition={{ duration: 0.5, ease: "linear" }}
        style={{
          height:       "100%",
          borderRadius: 3,
          background:   `linear-gradient(90deg, ${SS_FOREST} 0%, ${SS_GREEN} 100%)`,
          boxShadow:    `0 0 8px rgba(0,200,100,0.5)`,
        }}
      />
    </div>
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────────
const StrandFlow = ({ onSessionComplete }) => {
  const {
    canvasRef,
    isDrawing,
    bgPulse,
    clearCanvas,
    handlers,
  } = useStrandCanvas();

  const { secondsLeft, progress, isComplete, reset } = useGroundingTimer(isDrawing);

  // Fire the callback once when the session completes
  useEffect(() => {
    if (isComplete && onSessionComplete) {
      onSessionComplete();
    }
  }, [isComplete, onSessionComplete]);

  const handleReset = () => {
    clearCanvas();
    reset();
  };

  return (
    <div>
      {/* Progress bar */}
      <ProgressBar
        progress={progress}
        secondsLeft={secondsLeft}
        isComplete={isComplete}
      />

      {/* Canvas wrapper — scale pulses on each new stroke */}
      <motion.div
        animate={{ scale: isDrawing ? 1.008 : 1 }}
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
        style={{
          position:     "relative",
          borderRadius: "10px",
          overflow:     "hidden",
          border:       `1px solid rgba(0,200,100,${isDrawing ? "0.45" : "0.18"})`,
          boxShadow:    isDrawing
            ? "0 0 32px rgba(0,200,100,0.18), 0 8px 32px rgba(0,0,0,0.4)"
            : "0 4px 20px rgba(0,0,0,0.4)",
          transition:   "border-color 0.2s ease, box-shadow 0.2s ease",
          background:   "#060f0a",
          touchAction:  "none",   // prevent scroll-hijack on mobile
        }}
      >
        <canvas
          ref={canvasRef}
          {...handlers}
          style={{
            display: "block",
            width:   "100%",
            height:  320,
            cursor:  "crosshair",
          }}
        />

        {/* Idle hint overlay — fades out once the user starts drawing */}
        <AnimatePresence>
          {progress === 0 && !isDrawing && (
            <motion.div
              key="hint"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                position:       "absolute",
                inset:          0,
                display:        "flex",
                flexDirection:  "column",
                alignItems:     "center",
                justifyContent: "center",
                pointerEvents:  "none",
                gap:            "0.5rem",
              }}
            >
              <div
                style={{
                  width:          52,
                  height:         52,
                  borderRadius:   "50%",
                  border:         `1px dashed rgba(0,200,100,0.35)`,
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                }}
              >
                <i className="tim-icons icon-tap-02" style={{ color: "rgba(0,200,100,0.5)", fontSize: "1.4rem" }} />
              </div>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.3)", margin: 0 }}>
                Draw here to begin
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completion overlay */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              key="complete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                position:       "absolute",
                inset:          0,
                background:     "rgba(6,15,10,0.82)",
                display:        "flex",
                flexDirection:  "column",
                alignItems:     "center",
                justifyContent: "center",
                gap:            "0.75rem",
                backdropFilter: "blur(4px)",
              }}
            >
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1,   opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{
                  width:          72,
                  height:         72,
                  borderRadius:   "50%",
                  background:     "rgba(0,200,100,0.15)",
                  border:         `2px solid ${SS_GREEN}`,
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                }}
              >
                <i className="tim-icons icon-check-2" style={{ color: SS_GREEN, fontSize: "2rem" }} />
              </motion.div>
              <p style={{ fontWeight: 700, fontSize: "1rem", margin: 0 }}>
                60 seconds. Well done.
              </p>
              <button
                onClick={handleReset}
                style={{
                  background:   "transparent",
                  border:       `1px solid rgba(0,200,100,0.35)`,
                  borderRadius: "6px",
                  color:        "rgba(255,255,255,0.6)",
                  cursor:       "pointer",
                  fontSize:     "0.8rem",
                  padding:      "0.3rem 0.8rem",
                }}
              >
                Draw again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Clear button */}
      {!isComplete && (
        <div style={{ textAlign: "right", marginTop: "0.5rem" }}>
          <button
            onClick={clearCanvas}
            style={{
              background:  "none",
              border:      "none",
              color:       "rgba(255,255,255,0.25)",
              cursor:      "pointer",
              fontSize:    "0.75rem",
              padding:     0,
            }}
          >
            Clear canvas
          </button>
        </div>
      )}
    </div>
  );
};

export default StrandFlow;
