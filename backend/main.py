"""
StrandSmart Computer Vision Backend
====================================
FastAPI + MediaPipe Hands + Face Mesh

Accepts webcam frames over WebSocket, detects hand-to-face proximity,
and emits a risk signal when the hand is near the eyebrow region for
more than `alert_duration_seconds` continuously.

Privacy-first: no frames are stored, no network calls outside localhost.
All detection metadata is logged to detections.log for dataset documentation.

Start with:
    uvicorn main:app --reload
"""

import asyncio
import base64
import json
import logging
import os
import time
from datetime import datetime
from pathlib import Path

import cv2
import mediapipe as mp
import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

# ── Load config ────────────────────────────────────────────────────────────────
CONFIG_PATH = Path(__file__).parent / "config.json"
with open(CONFIG_PATH) as f:
    CONFIG = json.load(f)

DISTANCE_THRESHOLD    = CONFIG["distance_threshold"]
ALERT_DURATION        = CONFIG["alert_duration_seconds"]
CONFIDENCE_BASE       = CONFIG["confidence_base"]
EYEBROW_POINTS        = CONFIG["face_mesh_eyebrow_points"]
LOG_FILE              = Path(__file__).parent / CONFIG["log_file"]

# ── Logging setup ──────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("strandsmart-cv")

detection_logger = logging.getLogger("detections")
detection_logger.setLevel(logging.INFO)
_fh = logging.FileHandler(LOG_FILE)
_fh.setFormatter(logging.Formatter("%(message)s"))
detection_logger.addHandler(_fh)
detection_logger.propagate = False


def log_detection(confidence: float, zone: str, normalized_dist: float) -> None:
    """
    Append a detection event to detections.log.
    Only metadata is logged — no image data, no PII.
    Format: ISO timestamp | confidence | zone | normalized_distance
    """
    entry = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "confidence": round(confidence, 4),
        "zone": zone,
        "normalized_distance": round(normalized_dist, 4),
    }
    detection_logger.info(json.dumps(entry))


# ── MediaPipe setup ────────────────────────────────────────────────────────────
mp_hands     = mp.solutions.hands
mp_face_mesh = mp.solutions.face_mesh


def decode_frame(data: bytes) -> np.ndarray | None:
    """
    Decode a base64-encoded JPEG frame sent from the browser.
    Returns an OpenCV BGR image or None on failure.
    """
    try:
        # Strip data-URL prefix if present: "data:image/jpeg;base64,..."
        if isinstance(data, (bytes, bytearray)):
            data = data.decode("utf-8")
        if "," in data:
            data = data.split(",", 1)[1]
        img_bytes = base64.b64decode(data)
        arr = np.frombuffer(img_bytes, dtype=np.uint8)
        frame = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        return frame
    except Exception as exc:
        logger.debug("Frame decode error: %s", exc)
        return None


def get_eyebrow_centroid(face_landmarks, img_w: int, img_h: int) -> tuple[float, float] | None:
    """
    Return the pixel centroid of the configured eyebrow landmark points.
    """
    pts = []
    for idx in EYEBROW_POINTS:
        lm = face_landmarks.landmark[idx]
        pts.append((lm.x * img_w, lm.y * img_h))
    if not pts:
        return None
    cx = sum(p[0] for p in pts) / len(pts)
    cy = sum(p[1] for p in pts) / len(pts)
    return cx, cy


def get_face_size(face_landmarks, img_w: int, img_h: int) -> float:
    """
    Estimate face size as the distance between the outer eye corners
    (landmarks 33 = left outer eye, 263 = right outer eye).
    These are stable, always-present landmarks in Face Mesh.
    """
    try:
        left  = face_landmarks.landmark[33]   # left eye outer corner
        right = face_landmarks.landmark[263]  # right eye outer corner
        dx = (right.x - left.x) * img_w
        dy = (right.y - left.y) * img_h
        dist = float(np.sqrt(dx * dx + dy * dy))
        return max(dist, 1.0)
    except Exception:
        return float(img_w) * 0.25


def get_wrist_position(hand_landmarks, img_w: int, img_h: int) -> tuple[float, float]:
    """
    Return the pixel position of the wrist landmark (index 0).
    """
    wrist = hand_landmarks.landmark[0]
    return wrist.x * img_w, wrist.y * img_h


def compute_normalized_distance(
    wrist: tuple[float, float],
    eyebrow: tuple[float, float],
    face_size: float,
) -> float:
    """
    Euclidean distance between wrist and eyebrow centroid,
    normalized by face size so it's camera-distance-invariant.
    """
    dx = wrist[0] - eyebrow[0]
    dy = wrist[1] - eyebrow[1]
    raw = float(np.sqrt(dx * dx + dy * dy))
    return raw / face_size


# ── Per-connection state ───────────────────────────────────────────────────────
class DetectionState:
    """Tracks the continuous-proximity timer for a single WebSocket session."""

    def __init__(self, alert_duration: float, confidence_base: float) -> None:
        self.alert_duration   = alert_duration
        self.confidence_base  = confidence_base
        self.proximity_start: float | None = None
        self.last_alert_logged: float = 0.0
        self._last_debug_log: float = 0.0

    def update(self, in_proximity: bool) -> dict:
        now = time.monotonic()
        if in_proximity:
            if self.proximity_start is None:
                self.proximity_start = now
            elapsed = now - self.proximity_start
            if elapsed >= self.alert_duration:
                confidence = min(self.confidence_base + (elapsed - self.alert_duration) * 0.01, 0.99)
                return {"alert": True, "confidence": round(confidence, 4), "zone": "eyebrow"}
        else:
            self.proximity_start = None
        return {"alert": False}


# ── FastAPI app ────────────────────────────────────────────────────────────────
app = FastAPI(title="StrandSmart CV Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # localhost only in practice; tighten for production
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/status")
async def status() -> dict:
    """Health-check endpoint."""
    return {
        "status": "ok",
        "service": "StrandSmart CV Backend",
        "version": "1.0.0",
        "config": {
            "distance_threshold": DISTANCE_THRESHOLD,
            "alert_duration_seconds": ALERT_DURATION,
        },
    }


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    await websocket.accept()
    logger.info("WebSocket client connected: %s", websocket.client)

    # Reload config fresh on every connection so changes to config.json
    # take effect without restarting the server
    with open(CONFIG_PATH) as f:
        cfg = json.load(f)
    distance_threshold = cfg["distance_threshold"]
    alert_duration     = cfg["alert_duration_seconds"]
    confidence_base    = cfg["confidence_base"]
    logger.info("Config loaded: threshold=%.3f duration=%.1fs", distance_threshold, alert_duration)

    state = DetectionState(alert_duration=alert_duration, confidence_base=confidence_base)

    # Initialise MediaPipe models (one instance per connection)
    hands_model = mp_hands.Hands(
        static_image_mode=False,
        max_num_hands=2,
        min_detection_confidence=0.6,
        min_tracking_confidence=0.5,
    )
    face_model = mp_face_mesh.FaceMesh(
        static_image_mode=False,
        max_num_faces=1,
        refine_landmarks=True,
        min_detection_confidence=0.6,
        min_tracking_confidence=0.5,
    )

    try:
        while True:
            # Receive the next message (text or bytes) with a keepalive timeout
            try:
                raw = await asyncio.wait_for(websocket.receive(), timeout=5.0)
            except asyncio.TimeoutError:
                await websocket.send_json({"alert": False})
                continue

            frame_data = raw.get("bytes") or raw.get("text")
            if not frame_data:
                await websocket.send_json({"alert": False})
                continue

            frame = decode_frame(frame_data)
            if frame is None:
                await websocket.send_json({"alert": False})
                continue

            img_h, img_w = frame.shape[:2]
            # MediaPipe expects RGB
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            face_results = face_model.process(rgb)
            hand_results = hands_model.process(rgb)

            in_proximity = False
            normalized_dist = 1.0

            face_detected = bool(face_results.multi_face_landmarks)
            hand_detected = bool(hand_results.multi_hand_landmarks)

            if face_detected and hand_detected:
                face_lm  = face_results.multi_face_landmarks[0]
                eyebrow  = get_eyebrow_centroid(face_lm, img_w, img_h)
                face_sz  = get_face_size(face_lm, img_w, img_h)

                if eyebrow is not None:
                    for hand_lm in hand_results.multi_hand_landmarks:
                        wrist = get_wrist_position(hand_lm, img_w, img_h)
                        normalized_dist = compute_normalized_distance(wrist, eyebrow, face_sz)
                        if normalized_dist < distance_threshold:
                            in_proximity = True
                            break

            # ── Per-frame debug log (throttled to 2/sec so terminal stays readable)
            now_mono = time.monotonic()
            if not hasattr(state, "_last_debug_log"):
                state._last_debug_log = 0.0
            if now_mono - state._last_debug_log >= 0.5:
                state._last_debug_log = now_mono
                if face_detected and hand_detected:
                    logger.info(
                        "frame %dx%d | face ✓ hand ✓ | dist=%.3f threshold=%.3f | proximity=%s",
                        img_w, img_h, normalized_dist, distance_threshold, in_proximity,
                    )
                else:
                    logger.info(
                        "frame %dx%d | face=%s hand=%s",
                        img_w, img_h,
                        "✓" if face_detected else "✗",
                        "✓" if hand_detected else "✗",
                    )

            payload = state.update(in_proximity)

            # Log alert events (metadata only, no image data)
            if payload.get("alert"):
                now = time.monotonic()
                if now - state.last_alert_logged > 5.0:  # throttle log writes
                    log_detection(payload["confidence"], payload["zone"], normalized_dist)
                    state.last_alert_logged = now

            await websocket.send_json(payload)

    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected: %s", websocket.client)
    except Exception as exc:
        logger.error("WebSocket error: %s", exc, exc_info=True)
    finally:
        hands_model.close()
        face_model.close()
