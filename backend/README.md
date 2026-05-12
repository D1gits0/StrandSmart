# StrandSmart CV Backend

Local computer vision server that detects hand-to-face proximity using MediaPipe.  
**Privacy-first**: no frames are stored, no data leaves your machine.

---

## Requirements

- Python 3.10 or 3.11 (MediaPipe 0.10.x does not yet support 3.12+)
- A webcam

---

## Setup

```bash
# 1. Create and activate a virtual environment (recommended)
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt
```

---

## Running

```bash
# Activate the venv first
.venv311\Scripts\activate   # Windows
# source .venv311/bin/activate  # macOS / Linux

uvicorn main:app --reload
```

The server starts at **http://localhost:8000**.

| Endpoint | Description |
|---|---|
| `GET /status` | Health check — returns config and version |
| `WS ws://localhost:8000/ws` | Real-time frame processing |

---

## WebSocket Protocol

**Client → Server**  
Send each webcam frame as a base64-encoded JPEG string (data-URL format is fine):

```
data:image/jpeg;base64,/9j/4AAQSkZJRgAB...
```

**Server → Client**  
JSON on every frame:

```json
// No alert
{ "alert": false }

// Alert triggered (hand near eyebrow for ≥ 2.5 s)
{ "alert": true, "confidence": 0.87, "zone": "eyebrow" }
```

---

## Tuning

Edit `config.json` — no code changes needed:

| Key | Default | Description |
|---|---|---|
| `distance_threshold` | `0.18` | Normalized hand-to-eyebrow distance that counts as "near". Lower = stricter. |
| `alert_duration_seconds` | `2.5` | Seconds of continuous proximity before an alert fires. |
| `confidence_base` | `0.87` | Base confidence value reported in the alert payload. |
| `face_mesh_eyebrow_points` | `[55,65,66,285,295,296]` | MediaPipe Face Mesh landmark indices for the eyebrow region. |

---

## Detection Log

Every alert event is appended to `detections.log` as newline-delimited JSON:

```json
{"timestamp": "2026-05-11T14:32:01.123Z", "confidence": 0.87, "zone": "eyebrow", "normalized_distance": 0.1423}
```

This file is the labeled dataset documentation referenced in the resume.  
**No image data is ever written** — only metadata.

---

## How It Works

1. The React frontend captures webcam frames at 15 fps and sends them over WebSocket.
2. MediaPipe Face Mesh locates the eyebrow region (landmarks 55, 65, 66, 285, 295, 296).
3. MediaPipe Hands locates the wrist landmark.
4. The Euclidean distance between wrist and eyebrow centroid is normalized by face width so it works at any camera distance.
5. If the normalized distance stays below `distance_threshold` for `alert_duration_seconds`, an alert payload is sent.
6. The React overlay responds with a soft vignette and, after 2 seconds, opens the Grounding flow.

---

## Stopping

`Ctrl+C` in the terminal running uvicorn.
