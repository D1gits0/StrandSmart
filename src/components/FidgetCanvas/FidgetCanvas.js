/**
 * src/components/FidgetCanvas/FidgetCanvas.js
 *
 * The upgraded Sensory Substitute canvas for the /grounding page.
 *
 * Features:
 *   • Glowing #00c864 silk strands that fade over ~2.5s
 *   • Pulsing ∞ infinity guide drawn on a second canvas layer
 *   • Background glow brightens when the user draws near the guide path
 *   • 60-second active-drawing timer with progress bar
 *   • "Mindfulness Achieved" completion overlay
 *   • onSessionComplete callback → auto-logs to Firestore
 *
 * Props:
 *   onSessionComplete() — called once when the 60s timer finishes
 */

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useGroundingTimer from "hooks/useGroundingTimer";

// ── Constants ──────────────────────────────────────────────────────────────────
const SS_GREEN      = "#00c864";
const SS_FOREST_BG  = "#060f0a";
const FADE_RATE     = 0.006;    // ~2.5s fade at 60fps
const LINE_WIDTH    = 3.5;
const GLOW_BLUR     = 20;
const PROXIMITY_R   = 40;       // px — distance to guide that triggers glow

// ── Infinity path helpers ──────────────────────────────────────────────────────
/**
 * Returns an array of {x, y} points tracing a lemniscate (∞) centred at
 * (cx, cy) with horizontal radius rx and vertical radius ry.
 * Uses the parametric form: x = cx + rx·cos(t) / (1 + sin²(t))
 *                           y = cy + ry·sin(t)·cos(t) / (1 + sin²(t))
 */
const buildInfinityPath = (cx, cy, rx, ry, steps = 300) => {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t    = (i / steps) * 2 * Math.PI;
    const denom = 1 + Math.sin(t) * Math.sin(t);
    pts.push({
      x: cx + (rx * Math.cos(t)) / denom,
      y: cy + (ry * Math.sin(t) * Math.cos(t)) / denom,
    });
  }
  return pts;
};

/**
 * Returns true if point p is within PROXIMITY_R pixels of any guide point.
 * Checks every 5th guide point for performance.
 */
const isNearGuide = (p, guidePts) => {
  for (let i = 0; i < guidePts.length; i += 5) {
    const dx = p.x - guidePts[i].x;
    const dy = p.y - guidePts[i].y;
    if (dx * dx + dy * dy < PROXIMITY_R * PROXIMITY_R) return true;
  }
  return false;
};

// ── Progress bar ──────────────────────────────────────────────────────────────
const ProgressBar = ({ progress, secondsLeft, isComplete }) => (
  <div style={{ marginBottom: "0.85rem" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
      <span style={{ fontSize: "0.72rem", opacity: 0.45, letterSpacing: "0.07em", textTransform: "uppercase" }}>
        {isComplete ? "Mindfulness achieved 🌿" : "Trace the loop to fill the bar"}
      </span>
      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: SS_GREEN }}>
        {isComplete ? "60s" : `${secondsLeft}s`}
      </span>
    </div>
    <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
      <motion.div
        animate={{ width: `${progress * 100}%` }}
        transition={{ duration: 0.6, ease: "linear" }}
        style={{
          height: "100%",
          borderRadius: 3,
          background: `linear-gradient(90deg, #0d2b1a 0%, ${SS_GREEN} 100%)`,
          boxShadow: `0 0 10px rgba(0,200,100,0.55)`,
        }}
      />
    </div>
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────────
const FidgetCanvas = ({ onSessionComplete }) => {
  const canvasRef    = useRef(null);
  const strandsRef   = useRef([]);
  const rafRef       = useRef(null);
  const drawingRef   = useRef(false);
  const guidePtsRef  = useRef([]);
  const pulseRef     = useRef(0);       // 0–1, drives guide opacity pulse
  const pulseDir     = useRef(1);
  const nearGlowRef  = useRef(0);       // 0–1, background glow intensity
  const sessionFired = useRef(false);

  const [isDrawing,  setIsDrawing]  = useState(false);
  const [nearGuide,  setNearGuide]  = useState(false);

  const { secondsLeft, progress, isComplete, reset } = useGroundingTimer(isDrawing);

  // ── Fire completion callback once ───────────────────────────────────────────
  useEffect(() => {
    if (isComplete && !sessionFired.current && onSessionComplete) {
      sessionFired.current = true;
      onSessionComplete();
    }
  }, [isComplete, onSessionComplete]);

  // ── Resize observer ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const sync = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      // Rebuild guide path whenever canvas resizes
      const cx = canvas.width  / 2;
      const cy = canvas.height / 2;
      const rx = Math.min(canvas.width  * 0.32, 160);
      const ry = Math.min(canvas.height * 0.22, 70);
      guidePtsRef.current = buildInfinityPath(cx, cy, rx, ry);
    };
    const ro = new ResizeObserver(sync);
    ro.observe(canvas);
    sync();
    return () => ro.disconnect();
  }, []);

  // ── RAF drawing loop ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const loop = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // ── Background glow when near guide ──
      const targetGlow = nearGlowRef.current;
      if (targetGlow > 0) {
        const grad = ctx.createRadialGradient(
          width / 2, height / 2, 0,
          width / 2, height / 2, Math.max(width, height) * 0.6
        );
        grad.addColorStop(0, `rgba(0,200,100,${targetGlow * 0.12})`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // ── Pulsing infinity guide ──
      pulseRef.current += pulseDir.current * 0.008;
      if (pulseRef.current >= 1) { pulseRef.current = 1; pulseDir.current = -1; }
      if (pulseRef.current <= 0) { pulseRef.current = 0; pulseDir.current =  1; }

      const guideAlpha = 0.06 + pulseRef.current * 0.1;
      const pts = guidePtsRef.current;
      if (pts.length > 1) {
        ctx.save();
        ctx.globalAlpha = guideAlpha;
        ctx.strokeStyle = SS_GREEN;
        ctx.lineWidth   = 2;
        ctx.lineCap     = "round";
        ctx.lineJoin    = "round";
        ctx.shadowBlur  = 12;
        ctx.shadowColor = SS_GREEN;
        ctx.setLineDash([6, 8]);
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i].x, pts[i].y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      // ── Silk strands ──
      strandsRef.current = strandsRef.current.filter((s) => s.alpha > 0);
      strandsRef.current.forEach((strand) => {
        if (strand.points.length < 2) return;
        ctx.save();
        ctx.globalAlpha = strand.alpha;
        ctx.strokeStyle = SS_GREEN;
        ctx.lineWidth   = LINE_WIDTH;
        ctx.lineCap     = "round";
        ctx.lineJoin    = "round";
        ctx.shadowBlur  = GLOW_BLUR;
        ctx.shadowColor = SS_GREEN;
        ctx.beginPath();
        ctx.moveTo(strand.points[0].x, strand.points[0].y);
        for (let i = 1; i < strand.points.length; i++) {
          const mx = (strand.points[i - 1].x + strand.points[i].x) / 2;
          const my = (strand.points[i - 1].y + strand.points[i].y) / 2;
          ctx.quadraticCurveTo(strand.points[i - 1].x, strand.points[i - 1].y, mx, my);
        }
        ctx.stroke();
        ctx.restore();
        if (!strand.active) {
          strand.alpha = Math.max(0, strand.alpha - FADE_RATE);
        }
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ── Pointer helpers ──────────────────────────────────────────────────────────
  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };

  const onPointerDown = useCallback((e) => {
    e.preventDefault();
    drawingRef.current = true;
    setIsDrawing(true);
    const pos = getPos(e);
    strandsRef.current.push({ points: [pos], alpha: 1, active: true });
  }, []);

  const onPointerMove = useCallback((e) => {
    e.preventDefault();
    if (!drawingRef.current) return;
    const pos    = getPos(e);
    const strand = strandsRef.current[strandsRef.current.length - 1];
    if (strand) strand.points.push(pos);

    // Proximity check — update glow target
    const near = isNearGuide(pos, guidePtsRef.current);
    nearGlowRef.current = near ? Math.min(1, nearGlowRef.current + 0.15) : Math.max(0, nearGlowRef.current - 0.05);
    setNearGuide(near);
  }, []);

  const stopDrawing = useCallback(() => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    setIsDrawing(false);
    nearGlowRef.current = 0;
    setNearGuide(false);
    const strand = strandsRef.current[strandsRef.current.length - 1];
    if (strand) strand.active = false;
  }, []);

  const clearCanvas = useCallback(() => {
    strandsRef.current  = [];
    nearGlowRef.current = 0;
  }, []);

  const handleReset = () => {
    clearCanvas();
    sessionFired.current = false;
    reset();
  };

  return (
    <div>
      <ProgressBar progress={progress} secondsLeft={secondsLeft} isComplete={isComplete} />

      {/* Canvas wrapper */}
      <motion.div
        animate={{
          scale:     isDrawing ? 1.006 : 1,
          boxShadow: nearGuide
            ? "0 0 48px rgba(0,200,100,0.28), 0 8px 32px rgba(0,0,0,0.5)"
            : isDrawing
              ? "0 0 24px rgba(0,200,100,0.14), 0 8px 32px rgba(0,0,0,0.45)"
              : "0 4px 20px rgba(0,0,0,0.4)",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        style={{
          position:    "relative",
          borderRadius: "10px",
          overflow:    "hidden",
          border:      `1px solid rgba(0,200,100,${nearGuide ? "0.55" : isDrawing ? "0.35" : "0.15"})`,
          background:  SS_FOREST_BG,
          touchAction: "none",
          transition:  "border-color 0.2s ease",
        }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
          onTouchStart={onPointerDown}
          onTouchMove={onPointerMove}
          onTouchEnd={stopDrawing}
          style={{ display: "block", width: "100%", height: 500, cursor: "crosshair" }}
        />

        {/* Guide label — always visible, fades when drawing */}
        <AnimatePresence>
          {!isComplete && (
            <motion.div
              key="guide-label"
              animate={{ opacity: isDrawing ? 0.25 : 0.7 }}
              transition={{ duration: 0.4 }}
              style={{
                position:       "absolute",
                bottom:         "1rem",
                left:           0,
                right:          0,
                textAlign:      "center",
                pointerEvents:  "none",
              }}
            >
              <p style={{ fontSize: "0.78rem", color: SS_GREEN, margin: 0, letterSpacing: "0.06em" }}>
                Focus your energy here. Trace the loop.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Idle hint */}
        <AnimatePresence>
          {progress === 0 && !isDrawing && (
            <motion.div
              key="hint"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{
                position:       "absolute",
                inset:          0,
                display:        "flex",
                flexDirection:  "column",
                alignItems:     "center",
                justifyContent: "center",
                pointerEvents:  "none",
                gap:            "0.5rem",
                paddingBottom:  "2.5rem",
              }}
            >
              <div style={{ width: 52, height: 52, borderRadius: "50%", border: "1px dashed rgba(0,200,100,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="tim-icons icon-tap-02" style={{ color: "rgba(0,200,100,0.45)", fontSize: "1.4rem" }} />
              </div>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.28)", margin: 0 }}>
                Touch and drag to begin
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
                background:     "rgba(6,15,10,0.88)",
                backdropFilter: "blur(6px)",
                display:        "flex",
                flexDirection:  "column",
                alignItems:     "center",
                justifyContent: "center",
                gap:            "0.85rem",
              }}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1,   opacity: 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.1 }}
                style={{
                  width:          80,
                  height:         80,
                  borderRadius:   "50%",
                  background:     "rgba(0,200,100,0.12)",
                  border:         `2px solid ${SS_GREEN}`,
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  boxShadow:      "0 0 32px rgba(0,200,100,0.3)",
                }}
              >
                <span style={{ fontSize: "2.2rem" }}>🌿</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                style={{ textAlign: "center" }}
              >
                <p style={{ fontWeight: 800, fontSize: "1.1rem", margin: "0 0 0.25rem", color: "#fff" }}>
                  Mindfulness Achieved
                </p>
                <p style={{ fontSize: "0.82rem", opacity: 0.5, margin: 0 }}>
                  1 minute of sensory grounding complete.
                </p>
              </motion.div>

              <button
                onClick={handleReset}
                style={{
                  background:   "transparent",
                  border:       "1px solid rgba(0,200,100,0.3)",
                  borderRadius: "6px",
                  color:        "rgba(255,255,255,0.5)",
                  cursor:       "pointer",
                  fontSize:     "0.78rem",
                  padding:      "0.3rem 0.85rem",
                  marginTop:    "0.25rem",
                }}
              >
                Go again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem" }}>
        <Link
          to="/dashboard"
          style={{
            display:        "inline-flex",
            alignItems:     "center",
            gap:            "0.4rem",
            fontSize:       "0.82rem",
            fontWeight:     600,
            letterSpacing:  "0.04em",
            color:          SS_GREEN,
            textDecoration: "none",
            border:         `1px solid rgba(0,200,100,0.35)`,
            borderRadius:   "6px",
            padding:        "0.4rem 0.9rem",
            transition:     "border-color 0.18s ease, background 0.18s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background    = "rgba(0,200,100,0.08)";
            e.currentTarget.style.borderColor   = "rgba(0,200,100,0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background    = "transparent";
            e.currentTarget.style.borderColor   = "rgba(0,200,100,0.35)";
          }}
        >
          <i className="tim-icons icon-minimal-left" style={{ fontSize: "0.7rem" }} />
          Return to Dashboard
        </Link>
        {!isComplete && (
          <button
            onClick={clearCanvas}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.2)", cursor: "pointer", fontSize: "0.72rem", padding: 0 }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default FidgetCanvas;
