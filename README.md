# StrandSmart

StrandSmart is a personal awareness tool for people working on a hair-pulling habit. It gives you a quiet place to log urges, practice grounding exercises, and — if you want — use your webcam to get a gentle nudge when your hand drifts toward your face. Everything runs in your browser and on your own machine. Nothing about your body or your habits is ever sent anywhere.

---

## Privacy

**All computer vision processing happens locally on your device.** Your webcam feed is analyzed in real time by a Python server running on your own computer — frames are never uploaded, stored, or transmitted to any external server.

**What is collected:**
- Urge logs you create (timestamp, intensity level, optional note) — stored in Firebase Firestore under your account
- Account information (email, display name) — stored in Firebase Auth

**What is never collected:**
- Video frames or images of any kind
- Biometric data
- Any data from your webcam

**About `detections.log`:**  
The local CV backend writes a `detections.log` file to the `backend/` folder on your machine. This file is **local only** — it is never synced to any server, never uploaded, and never read by the StrandSmart app or Firebase. It contains only detection metadata: timestamps, confidence scores, and zone labels. No image data, no video, and no personally identifiable information (PII) is ever written to this file.

You can delete `detections.log` at any time without affecting the app.

---

## How to Run Locally

StrandSmart has two parts: a React frontend and an optional Python backend for CV detection. You need both running if you want real-time detection; the frontend works fine on its own without it.

### Backend (CV detection server)

The backend requires Python 3.10 or 3.11. MediaPipe does not yet support Python 3.12+.

```bash
# Navigate to the backend folder
cd backend

# Activate the virtual environment
# Windows:
.venv311\Scripts\activate
# macOS / Linux:
source .venv311/bin/activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload
```

The server starts at `http://localhost:8000`. Keep this terminal open while using CV detection.

### Frontend

From the project root:

```bash
npm install   # first time only
npm start
```

The app opens at `http://localhost:3000`.

---

## Two Ways to Use StrandSmart

### Without CV detection

You don't need the backend running at all. Just start the frontend with `npm start`, sign in, and use the urge tracker and grounding exercises. The dashboard will show a friendly card explaining how to set up CV detection if you want it later — you can ignore it entirely.

### With CV detection

Start the backend server first (see above), then start the frontend. When you log in, the dashboard will show a "CV Connected" status card with a live pulse animation. Your webcam will activate and the app will gently alert you when it detects your hand near your face. A one-time privacy notice will appear the first time your camera activates, confirming that all processing is local.

You can enable or disable CV detection at any time from **Settings → CV Detection**.

---

## Configuration Guide

The CV backend is configured via `backend/config.json`. You can edit this file without touching any code.

```json
{
  "distance_threshold": 3.0,
  "alert_duration_seconds": 2.5,
  "confidence_base": 0.87,
  "face_mesh_eyebrow_points": [55, 65, 66, 285, 295, 296],
  "frame_log_interval": 1,
  "log_file": "detections.log"
}
```

| Key | Default | What it does |
|---|---|---|
| `distance_threshold` | `3.0` | How close your hand needs to be to your face to count as "near". Lower values are stricter (fewer alerts); higher values are more sensitive (more alerts). |
| `alert_duration_seconds` | `2.5` | How many seconds of continuous proximity before an alert fires. Increase this if you're getting too many alerts; decrease it for faster feedback. |

The other keys (`confidence_base`, `face_mesh_eyebrow_points`, `frame_log_interval`, `log_file`) control internal behavior and generally don't need to be changed.

You can also adjust `distance_threshold` from within the app at **Settings → CV Detection → Sensitivity**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | [React 18](https://react.dev/) + [Reactstrap](https://reactstrap.github.io/) |
| Auth & Database | [Firebase](https://firebase.google.com/) (Auth + Firestore) |
| CV Backend | [FastAPI](https://fastapi.tiangolo.com/) + [MediaPipe](https://developers.google.com/mediapipe) |
| WebSocket | Native browser WebSocket API |
| Property-based tests | [fast-check](https://fast-check.dev/) |

---

## Known Limitations

- **Desktop only for CV detection.** The webcam-based detection requires the local Python backend, which only runs on a desktop or laptop. The rest of the app (urge logging, grounding exercises) works on mobile browsers.
- **Requires a running local backend.** CV detection won't work unless you have the FastAPI server running on your machine. There's no hosted version of the backend.
- **Lighting affects accuracy.** The MediaPipe hand and face detection works best in good, even lighting. Low light, strong backlighting, or unusual angles can reduce detection accuracy or cause missed alerts.
- **Python 3.10 or 3.11 required.** MediaPipe 0.10.x does not support Python 3.12+.

---

## Contributing

Contributions are welcome. Here's how to get started:

1. Fork the repository and create a branch from `main`.
2. Make your changes. If you're adding a feature, please include tests.
3. Run the test suite: `npm test -- --watchAll=false`
4. Open a pull request with a clear description of what you changed and why.

For bug reports or feature ideas, open an issue using the [issue template](ISSUE_TEMPLATE.md).

Please keep the privacy-first design principle in mind: no video, image, or biometric data should ever leave the user's device.

---

## License

MIT — see [LICENSE.md](LICENSE.md).
