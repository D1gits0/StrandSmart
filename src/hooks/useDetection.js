/**
 * src/hooks/useDetection.js
 *
 * Streams webcam frames to the StrandSmart CV backend over WebSocket
 * and returns real-time detection state.
 *
 * Parameters:
 *   enabled     — when false, do not open WebSocket and do not start camera (Req 27.2, 28.2)
 *   currentUser — when null, do not open WebSocket (Req 28.1, 28.2)
 *
 * Returns:
 *   alert        — true when hand-to-face proximity alert is active
 *   confidence   — float 0–1
 *   zone         — string e.g. "eyebrow"
 *   isConnected  — true when the WebSocket is open
 *
 * Design notes:
 *   • WebSocket connection is attempted immediately on mount (when enabled and authenticated),
 *     independent of camera state. Camera is set up in parallel.
 *   • All reconnect/interval logic uses refs so closures never go stale.
 *   • When discreetMode is true, frames are not sent but the socket stays open.
 *   • Gracefully handles backend offline — isConnected stays false, no throws.
 *   • On sign-out (currentUser → null) or enabled → false, WebSocket is closed immediately.
 */

import { useEffect, useRef, useState } from "react";
import { usePrivacy } from "context/PrivacyContext";

const WS_URL          = "ws://localhost:8000/ws";
const FPS             = 15;
const FRAME_MS        = Math.round(1000 / FPS);
const JPEG_QUALITY    = 0.7;
const RECONNECT_MS    = 3000;

// Requirements 27.2, 28.1, 28.2
const useDetection = ({ enabled = true, currentUser = null } = {}) => {
  const { discreetMode } = usePrivacy();

  const [isConnected, setIsConnected] = useState(false);
  const [alert,       setAlert]       = useState(false);
  const [confidence,  setConfidence]  = useState(0);
  const [zone,        setZone]        = useState(null);

  // All mutable state lives in refs so callbacks never capture stale closures
  const wsRef           = useRef(null);
  const videoRef        = useRef(null);
  const canvasRef       = useRef(null);
  const intervalRef     = useRef(null);
  const reconnectRef    = useRef(null);
  const mountedRef      = useRef(false);
  const discreetRef     = useRef(discreetMode);

  // Mirror discreetMode into a ref so the interval callback sees the latest value
  useEffect(() => {
    discreetRef.current = discreetMode;
  }, [discreetMode]);

  // ── Sign-out / disabled cleanup effect (Req 28.4) ───────────────────────────
  // Runs whenever enabled or currentUser changes. When either becomes falsy,
  // immediately close the WebSocket and stop the frame interval so the camera
  // and connection are torn down without waiting for the main effect to re-run.
  useEffect(() => {
    if (!enabled || !currentUser) {
      clearInterval(intervalRef.current);
      clearTimeout(reconnectRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null; // prevent reconnect loop
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
      setAlert(false);
    }
  }, [enabled, currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // ── Guard: do not connect when disabled or unauthenticated (Req 27.2, 28.1, 28.2) ──
    if (!enabled || !currentUser) {
      return;
    }

    mountedRef.current = true;

    // ── Off-screen video + canvas for frame capture ──────────────────────────
    const video  = document.createElement("video");
    const canvas = document.createElement("canvas");
    video.muted       = true;
    video.playsInline = true;
    videoRef.current  = video;
    canvasRef.current = canvas;

    // ── Frame sender (called by setInterval) ─────────────────────────────────
    const sendFrame = () => {
      if (discreetRef.current) return;
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      const v = videoRef.current;
      const c = canvasRef.current;
      if (!v || v.readyState < 2) return; // not enough data yet
      c.width  = v.videoWidth  || 320;
      c.height = v.videoHeight || 240;
      c.getContext("2d").drawImage(v, 0, 0, c.width, c.height);
      try {
        ws.send(c.toDataURL("image/jpeg", JPEG_QUALITY));
      } catch (e) {
        console.warn("[useDetection] send error:", e);
      }
    };

    // ── WebSocket connect (defined inside effect so it closes over refs) ──────
    const connect = () => {
      if (!mountedRef.current) return;
      console.log("[useDetection] connecting to", WS_URL);

      let ws;
      try {
        ws = new WebSocket(WS_URL);
      } catch (e) {
        console.warn("[useDetection] WebSocket constructor threw:", e);
        scheduleReconnect();
        return;
      }
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) { ws.close(); return; }
        console.log("[useDetection] WebSocket connected ✓");
        setIsConnected(true);
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(sendFrame, FRAME_MS);
      };

      ws.onmessage = (evt) => {
        if (!mountedRef.current) return;
        try {
          const d = JSON.parse(evt.data);
          setAlert(!!d.alert);
          setConfidence(d.confidence ?? 0);
          setZone(d.zone ?? null);
        } catch { /* ignore malformed */ }
      };

      ws.onerror = (e) => {
        console.warn("[useDetection] WebSocket error:", e);
      };

      ws.onclose = (evt) => {
        if (!mountedRef.current) return;
        console.log("[useDetection] WebSocket closed, code:", evt.code, "— scheduling reconnect");
        setIsConnected(false);
        setAlert(false);
        clearInterval(intervalRef.current);
        scheduleReconnect();
      };
    };

    // ── Reconnect scheduler ───────────────────────────────────────────────────
    // Defined after connect so it can reference it safely
    const scheduleReconnect = () => {
      if (!mountedRef.current) return;
      clearTimeout(reconnectRef.current);
      reconnectRef.current = setTimeout(() => {
        if (mountedRef.current) connect();
      }, RECONNECT_MS);
    };

    // ── Camera setup (best-effort, does not block WS connection) ─────────────
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode: "user" },
          audio: false,
        });
        if (!mountedRef.current) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        video.srcObject = stream;
        await video.play();
        console.log("[useDetection] camera ready ✓");
      } catch (e) {
        console.warn("[useDetection] camera unavailable:", e.message);
        // App and WS still work — frames just won't be sent
      }
    };

    // Start both in parallel — WS doesn't wait for camera
    connect();
    startCamera();

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      mountedRef.current = false;
      clearInterval(intervalRef.current);
      clearTimeout(reconnectRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null; // prevent reconnect loop on intentional close
        wsRef.current.close();
      }
      if (video.srcObject) {
        video.srcObject.getTracks().forEach((t) => t.stop());
        video.srcObject = null;
      }
    };
  }, [enabled, currentUser]); // re-run when auth state or enabled flag changes

  return { alert, confidence, zone, isConnected };
};

export default useDetection;
