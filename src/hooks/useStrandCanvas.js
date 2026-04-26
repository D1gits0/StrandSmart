/**
 * src/hooks/useStrandCanvas.js
 *
 * Manages the HTML5 Canvas drawing loop for the Strand Flow fidget tool.
 *
 * Each pointer event appends a point to a strands array.
 * On every animation frame, all points are drawn as glowing emerald lines
 * and their alpha is decremented — they fade out naturally over ~2 seconds.
 *
 * Returns:
 *   canvasRef        — attach to <canvas ref={canvasRef}>
 *   isDrawing        — true while pointer is held down
 *   bgPulse          — increments on every new stroke start (drives scale anim)
 *   clearCanvas()    — wipe all strands
 *   handlers         — { onPointerDown, onPointerMove, onPointerUp, onPointerLeave }
 */

import { useRef, useEffect, useState, useCallback } from "react";

const FADE_RATE    = 0.008;   // alpha decremented per frame (~2s at 60fps)
const LINE_WIDTH   = 3.5;
const GLOW_BLUR    = 18;
const GLOW_COLOR   = "#00c864";
const STROKE_COLOR = "#00c864";

const useStrandCanvas = () => {
  const canvasRef  = useRef(null);
  const strandsRef = useRef([]);   // [{ points: [{x,y}], alpha: 0–1 }]
  const rafRef     = useRef(null);
  const drawingRef = useRef(false);

  const [isDrawing, setIsDrawing] = useState(false);
  const [bgPulse,   setBgPulse]   = useState(0);

  // ── Drawing loop ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const loop = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      strandsRef.current = strandsRef.current.filter((s) => s.alpha > 0);

      strandsRef.current.forEach((strand) => {
        if (strand.points.length < 2) return;
        ctx.save();
        ctx.globalAlpha  = strand.alpha;
        ctx.strokeStyle  = STROKE_COLOR;
        ctx.lineWidth    = LINE_WIDTH;
        ctx.lineCap      = "round";
        ctx.lineJoin     = "round";
        ctx.shadowBlur   = GLOW_BLUR;
        ctx.shadowColor  = GLOW_COLOR;

        ctx.beginPath();
        ctx.moveTo(strand.points[0].x, strand.points[0].y);
        for (let i = 1; i < strand.points.length; i++) {
          // Smooth curve through midpoints
          const mx = (strand.points[i - 1].x + strand.points[i].x) / 2;
          const my = (strand.points[i - 1].y + strand.points[i].y) / 2;
          ctx.quadraticCurveTo(strand.points[i - 1].x, strand.points[i - 1].y, mx, my);
        }
        ctx.stroke();
        ctx.restore();

        // Only fade completed strands (not the one currently being drawn)
        if (!strand.active) {
          strand.alpha = Math.max(0, strand.alpha - FADE_RATE);
        }
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ── Resize observer — keep canvas pixel size in sync with CSS size ───────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    });
    ro.observe(canvas);
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    return () => ro.disconnect();
  }, []);

  // ── Pointer helpers ───────────────────────────────────────────────────────────
  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };

  const onPointerDown = useCallback((e) => {
    e.preventDefault();
    drawingRef.current = true;
    setIsDrawing(true);
    setBgPulse((p) => p + 1);
    const pos = getPos(e);
    strandsRef.current.push({ points: [pos], alpha: 1, active: true });
  }, []);

  const onPointerMove = useCallback((e) => {
    e.preventDefault();
    if (!drawingRef.current) return;
    const pos    = getPos(e);
    const strand = strandsRef.current[strandsRef.current.length - 1];
    if (strand) strand.points.push(pos);
  }, []);

  const stopDrawing = useCallback(() => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    setIsDrawing(false);
    const strand = strandsRef.current[strandsRef.current.length - 1];
    if (strand) strand.active = false;   // allow this strand to start fading
  }, []);

  const clearCanvas = useCallback(() => {
    strandsRef.current = [];
  }, []);

  return {
    canvasRef,
    isDrawing,
    bgPulse,
    clearCanvas,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp:    stopDrawing,
      onPointerLeave: stopDrawing,
      // Touch events for mobile
      onTouchStart: onPointerDown,
      onTouchMove:  onPointerMove,
      onTouchEnd:   stopDrawing,
    },
  };
};

export default useStrandCanvas;
