/**
 * src/components/OnboardingModal/OnboardingModal.jsx
 *
 * A 3-screen onboarding modal shown once to first-time users after login.
 *
 * Props:
 *   isOpen     — whether the modal is visible
 *   onComplete — called when the user finishes onboarding (writes Firestore first)
 *   onDismiss  — called when the user dismisses without completing (writes Firestore first)
 *
 * Screens:
 *   0 — Welcome: warm plain-English description of StrandSmart
 *   1 — Privacy: explicit local-processing statement + CV pipeline + /privacy link
 *   2 — Get Started: two paths (with / without CV detection)
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";
import { db, auth } from "firebaseConfig";

// ── Inline styles ─────────────────────────────────────────────────────────────

const overlayStyle = {
  position:        "fixed",
  inset:           0,
  background:      "rgba(0, 0, 0, 0.72)",
  display:         "flex",
  alignItems:      "center",
  justifyContent:  "center",
  zIndex:          9999,
  padding:         "1rem",
};

const modalStyle = {
  background:      "#0d2b1a",
  border:          "1px solid rgba(0, 200, 100, 0.2)",
  borderRadius:    "14px",
  boxShadow:       "0 8px 40px rgba(0, 0, 0, 0.6)",
  maxWidth:        "520px",
  width:           "100%",
  padding:         "2rem 2.25rem 1.75rem",
  color:           "#fff",
  fontFamily:      "inherit",
};

const headingStyle = {
  fontWeight:   800,
  fontSize:     "1.35rem",
  marginBottom: "0.5rem",
  color:        "#fff",
};

const bodyStyle = {
  fontSize:     "0.92rem",
  lineHeight:   1.65,
  color:        "rgba(255,255,255,0.82)",
  marginBottom: "1.25rem",
};

const dotRowStyle = {
  display:        "flex",
  justifyContent: "center",
  gap:            "0.45rem",
  marginBottom:   "1.5rem",
};

const dotStyle = (active) => ({
  width:        8,
  height:       8,
  borderRadius: "50%",
  background:   active ? "#00c864" : "rgba(255,255,255,0.2)",
  transition:   "background 0.2s",
});

const btnPrimary = {
  background:   "#00c864",
  color:        "#0d2b1a",
  border:       "none",
  borderRadius: "7px",
  padding:      "0.55rem 1.4rem",
  fontWeight:   700,
  fontSize:     "0.88rem",
  cursor:       "pointer",
};

const btnOutline = {
  background:   "transparent",
  color:        "rgba(255,255,255,0.7)",
  border:       "1px solid rgba(255,255,255,0.2)",
  borderRadius: "7px",
  padding:      "0.55rem 1.4rem",
  fontWeight:   600,
  fontSize:     "0.88rem",
  cursor:       "pointer",
};

const btnSecondary = {
  background:   "rgba(0,200,100,0.1)",
  color:        "#00c864",
  border:       "1px solid rgba(0,200,100,0.3)",
  borderRadius: "7px",
  padding:      "0.55rem 1.4rem",
  fontWeight:   700,
  fontSize:     "0.88rem",
  cursor:       "pointer",
  width:        "100%",
  marginBottom: "0.6rem",
};

const pipelineBoxStyle = {
  background:   "rgba(0,200,100,0.06)",
  border:       "1px solid rgba(0,200,100,0.15)",
  borderRadius: "8px",
  padding:      "0.85rem 1rem",
  fontSize:     "0.82rem",
  color:        "rgba(255,255,255,0.7)",
  marginBottom: "1rem",
  lineHeight:   1.6,
};

const setupBoxStyle = {
  background:   "rgba(255,255,255,0.04)",
  border:       "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  padding:      "0.85rem 1rem",
  fontSize:     "0.8rem",
  color:        "rgba(255,255,255,0.65)",
  marginTop:    "0.75rem",
  lineHeight:   1.7,
};

// ── Helper — write onboarding completion to Firestore ─────────────────────────

async function markOnboardingComplete() {
  const user = auth.currentUser;
  if (!user) return;
  try {
    await setDoc(
      doc(db, "users", user.uid),
      { onboardingComplete: true },
      { merge: true }
    );
  } catch (err) {
    // Non-blocking — modal will re-appear on next login, which is acceptable
    console.error("OnboardingModal: failed to write onboardingComplete", err);
  }
}

// ── Screen 0 — Welcome ────────────────────────────────────────────────────────

const WelcomeScreen = () => (
  <>
    <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>👋</div>
    <h2 style={headingStyle}>Welcome to StrandSmart</h2>
    <p style={bodyStyle}>
      StrandSmart is a personal companion that helps you notice patterns, stay
      grounded, and feel more in control — one moment at a time. Whether you
      want to track what you're feeling, practice a quick focusing exercise, or
      just have a place to reflect, StrandSmart is here for you.
    </p>
    <p style={{ ...bodyStyle, marginBottom: 0 }}>
      Let's take two minutes to show you around.
    </p>
  </>
);

// ── Screen 1 — Privacy ────────────────────────────────────────────────────────

const PrivacyScreen = () => (
  <>
    <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🔒</div>
    <h2 style={headingStyle}>Your privacy, by design</h2>
    <p style={bodyStyle}>
      <strong style={{ color: "#00c864" }}>
        Your camera feed never leaves your device. All processing happens
        locally. Nothing is recorded or stored.
      </strong>
    </p>
    <p style={{ ...bodyStyle, marginBottom: "0.75rem" }}>
      If you choose to enable CV detection, here's exactly what happens:
    </p>
    <div style={pipelineBoxStyle}>
      <div>📷 <strong>Webcam</strong> — your browser captures frames locally</div>
      <div style={{ margin: "0.3rem 0", paddingLeft: "1.1rem", opacity: 0.6 }}>↓ sent over localhost only</div>
      <div>🖥️ <strong>Local server</strong> — a small program on your computer analyzes each frame</div>
      <div style={{ margin: "0.3rem 0", paddingLeft: "1.1rem", opacity: 0.6 }}>↓ if hand-to-face proximity detected</div>
      <div>🔔 <strong>Alert</strong> — a gentle nudge appears in the app</div>
      <div style={{ margin: "0.3rem 0", paddingLeft: "1.1rem", opacity: 0.6 }}>↓ delivered to</div>
      <div>🙋 <strong>You</strong> — and only you</div>
    </div>
    <p style={{ ...bodyStyle, marginBottom: 0, fontSize: "0.82rem" }}>
      Want the full details?{" "}
      <Link to="/privacy" style={{ color: "#00c864" }}>
        Read our privacy page →
      </Link>
    </p>
  </>
);

// ── Screen 2 — Get Started ────────────────────────────────────────────────────

const GetStartedScreen = ({ onComplete, onDismiss }) => {
  const [showSetup, setShowSetup] = useState(false);

  const handleWithoutCV = async () => {
    await markOnboardingComplete();
    onComplete();
  };

  const handleEnableCV = () => {
    setShowSetup(true);
  };

  const handleDone = async () => {
    await markOnboardingComplete();
    onComplete();
  };

  return (
    <>
      <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🚀</div>
      <h2 style={headingStyle}>Choose your path</h2>
      <p style={{ ...bodyStyle, marginBottom: "1.25rem" }}>
        <strong style={{ color: "#00c864" }}>
          StrandSmart is fully functional without CV detection enabled.
        </strong>{" "}
        You can always turn it on later from Settings.
      </p>

      <button style={btnSecondary} onClick={handleWithoutCV}>
        Use without CV detection
      </button>

      {!showSetup && (
        <button
          style={{ ...btnSecondary, background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.75)", borderColor: "rgba(255,255,255,0.15)" }}
          onClick={handleEnableCV}
        >
          Enable CV detection
        </button>
      )}

      {showSetup && (
        <>
          <div style={setupBoxStyle}>
            <strong style={{ color: "rgba(255,255,255,0.9)" }}>Backend setup (one-time)</strong>
            <ol style={{ margin: "0.5rem 0 0", paddingLeft: "1.2rem" }}>
              <li>Make sure Python 3.11 is installed on your computer.</li>
              <li>
                Open a terminal and navigate to the <code>backend/</code> folder.
              </li>
              <li>
                Activate the virtual environment:
                <br />
                <code>source .venv311/bin/activate</code> (Mac/Linux)
                <br />
                <code>.venv311\Scripts\activate</code> (Windows)
              </li>
              <li>
                Start the server:
                <br />
                <code>uvicorn main:app --reload</code>
              </li>
              <li>Refresh this page — the CV status card will show "Connected".</li>
            </ol>
          </div>
          <button style={{ ...btnPrimary, marginTop: "1rem", width: "100%" }} onClick={handleDone}>
            Got it, take me to the dashboard
          </button>
        </>
      )}
    </>
  );
};

// ── OnboardingModal ───────────────────────────────────────────────────────────

const OnboardingModal = ({ isOpen, onComplete, onDismiss }) => {
  const [currentScreen, setCurrentScreen] = useState(0);

  if (!isOpen) return null;

  const handleDismiss = async () => {
    await markOnboardingComplete();
    onDismiss();
  };

  const handleNext = () => {
    if (currentScreen < 2) setCurrentScreen((s) => s + 1);
  };

  const handleBack = () => {
    if (currentScreen > 0) setCurrentScreen((s) => s - 1);
  };

  const screens = [
    <WelcomeScreen key="welcome" />,
    <PrivacyScreen key="privacy" />,
    <GetStartedScreen key="getstarted" onComplete={onComplete} onDismiss={onDismiss} />,
  ];

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true" aria-label="Onboarding">
      <div style={modalStyle}>
        {/* Dot indicators */}
        <div style={dotRowStyle}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={dotStyle(i === currentScreen)} />
          ))}
        </div>

        {/* Screen content */}
        {screens[currentScreen]}

        {/* Navigation row — only shown on screens 0 and 1 */}
        {currentScreen < 2 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem" }}>
            <div>
              {currentScreen > 0 && (
                <button style={btnOutline} onClick={handleBack}>
                  ← Back
                </button>
              )}
            </div>
            <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
              <button
                style={{ ...btnOutline, fontSize: "0.8rem", padding: "0.45rem 0.9rem" }}
                onClick={handleDismiss}
              >
                Skip
              </button>
              <button style={btnPrimary} onClick={handleNext}>
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Back button on screen 2 */}
        {currentScreen === 2 && (
          <div style={{ marginTop: "1rem" }}>
            <button style={{ ...btnOutline, fontSize: "0.8rem" }} onClick={handleBack}>
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingModal;
