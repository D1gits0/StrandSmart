/**
 * src/views/PrivacyPage.js
 *
 * Public privacy policy page at /privacy — no auth required.
 * Covers: what is collected, what is never collected, where data lives,
 * and the local-only nature of CV processing.
 * Requirements: 13.1, 13.2, 13.3, 13.4, 13.5
 */

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Container } from "reactstrap";
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";
import Footer         from "components/Footer/Footer.js";

const SS_GREEN = "#00c864";

const GLASS = {
  background:          "rgba(13, 43, 26, 0.7)",
  backdropFilter:      "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border:              "1px solid rgba(0, 200, 100, 0.15)",
  borderRadius:        "10px",
  boxShadow:           "0 4px 24px rgba(0,0,0,0.4)",
  padding:             "1.75rem 2rem",
  marginBottom:        "1.25rem",
};

// ── Individual section card ────────────────────────────────────────────────────
const Section = ({ icon, title, children, accent = false, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    style={{
      ...GLASS,
      border: accent
        ? "1px solid rgba(0,200,100,0.3)"
        : GLASS.border,
      boxShadow: accent
        ? "0 4px 24px rgba(0,200,100,0.1), 0 4px 24px rgba(0,0,0,0.4)"
        : GLASS.boxShadow,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1rem" }}>
      <div style={{
        width:          40,
        height:         40,
        borderRadius:   "50%",
        flexShrink:     0,
        background:     accent ? "rgba(0,200,100,0.15)" : "rgba(0,200,100,0.08)",
        border:         `1px solid ${accent ? "rgba(0,200,100,0.4)" : "rgba(0,200,100,0.2)"}`,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
      }}>
        <i className={icon} style={{ color: SS_GREEN, fontSize: "1rem" }} />
      </div>
      <h5 style={{ fontWeight: 700, marginBottom: 0, fontSize: "1rem" }}>{title}</h5>
    </div>
    {children}
  </motion.div>
);

// ── Bullet item ────────────────────────────────────────────────────────────────
const Bullet = ({ children, positive = true }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem", marginBottom: "0.55rem" }}>
    <span style={{
      color:      positive ? SS_GREEN : "rgba(255,100,100,0.8)",
      fontSize:   "0.75rem",
      marginTop:  "0.25rem",
      flexShrink: 0,
    }}>
      {positive ? "●" : "✕"}
    </span>
    <p style={{ fontSize: "0.9rem", lineHeight: 1.65, opacity: 0.8, marginBottom: 0 }}>
      {children}
    </p>
  </div>
);

// ── Page ───────────────────────────────────────────────────────────────────────
const PrivacyPage = () => (
  <>
    <ExamplesNavbar />
    <div style={{
      minHeight:     "100vh",
      background:    "#0d2b1a",
      paddingTop:    "80px",
      paddingBottom: "3rem",
    }}>
      {/* Radial glow */}
      <div style={{
        position:      "fixed",
        inset:         0,
        pointerEvents: "none",
        zIndex:        0,
        background:    "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,200,100,0.07) 0%, transparent 70%)",
      }} />

      <Container style={{ position: "relative", zIndex: 1, maxWidth: 720 }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ textAlign: "center", padding: "2.5rem 0 2rem" }}
        >
          <div style={{
            width:          64,
            height:         64,
            borderRadius:   "50%",
            margin:         "0 auto 1.25rem",
            background:     "rgba(0,200,100,0.1)",
            border:         "2px solid rgba(0,200,100,0.35)",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
          }}>
            <i className="tim-icons icon-lock-circle" style={{ color: SS_GREEN, fontSize: "1.6rem" }} />
          </div>
          <h2 style={{ fontWeight: 800, marginBottom: "0.5rem" }}>Privacy Policy</h2>
          <p style={{ fontSize: "0.95rem", opacity: 0.6, maxWidth: 520, margin: "0 auto" }}>
            StrandSmart is built with privacy at its core. Here's exactly what
            happens with your data — and what never happens.
          </p>
        </motion.div>

        {/* ── Section 1: What we collect ── */}
        <Section
          icon="tim-icons icon-notes"
          title="What We Collect"
          delay={0.08}
        >
          <p style={{ fontSize: "0.88rem", opacity: 0.55, marginBottom: "0.85rem" }}>
            StrandSmart stores only the minimum data needed to show you your
            progress over time.
          </p>
          <Bullet>Urge log entries — the fact that you logged an urge</Bullet>
          <Bullet>Timestamps — when each urge was logged</Bullet>
          <Bullet>Intensity values — the optional 1–10 rating you provide</Bullet>
          <Bullet>Reflection notes — any text you choose to write alongside a log</Bullet>
          <p style={{
            fontSize:    "0.78rem",
            opacity:     0.4,
            fontStyle:   "italic",
            marginTop:   "0.85rem",
            marginBottom: 0,
          }}>
            All of the above is stored in Firebase Firestore under your account
            and is visible only to you.
          </p>
        </Section>

        {/* ── Section 2: What we never collect ── */}
        <Section
          icon="tim-icons icon-camera-18"
          title="What We Never Collect"
          delay={0.14}
        >
          <p style={{ fontSize: "0.88rem", opacity: 0.55, marginBottom: "0.85rem" }}>
            The following data is never captured, stored, or transmitted — not
            even temporarily.
          </p>
          <Bullet positive={false}>Video footage of any kind</Bullet>
          <Bullet positive={false}>Images or screenshots from your camera</Bullet>
          <Bullet positive={false}>Biometric data (facial geometry, hand geometry, etc.)</Bullet>
          <Bullet positive={false}>Device identifiers or location data</Bullet>
          <Bullet positive={false}>Browsing history or third-party tracking</Bullet>
        </Section>

        {/* ── Section 3: Where your data lives ── */}
        <Section
          icon="tim-icons icon-cloud-upload-94"
          title="Where Your Data Lives"
          delay={0.2}
        >
          <p style={{ fontSize: "0.9rem", lineHeight: 1.75, opacity: 0.78, marginBottom: "0.85rem" }}>
            Your urge logs and reflections are stored in{" "}
            <strong style={{ color: SS_GREEN }}>Firebase Firestore</strong> under
            your account. Only you can read or delete them.
          </p>
          <Bullet>Your data is scoped to your account — no one else can access it</Bullet>
          <Bullet>You can delete individual logs or your entire account at any time from Settings</Bullet>
          <Bullet>Deleting your account permanently removes all associated data from Firestore</Bullet>
          <p style={{
            fontSize:    "0.78rem",
            opacity:     0.4,
            fontStyle:   "italic",
            marginTop:   "0.85rem",
            marginBottom: 0,
          }}>
            Firebase is operated by Google and subject to Google's data processing
            terms. StrandSmart does not sell or share your data with any third party.
          </p>
        </Section>

        {/* ── Section 4: Computer vision processing ── */}
        <Section
          icon="tim-icons icon-laptop"
          title="Computer Vision Processing"
          accent
          delay={0.26}
        >
          <p style={{ fontSize: "0.9rem", lineHeight: 1.75, opacity: 0.82, marginBottom: "0.85rem" }}>
            The optional CV detection feature uses your device's camera to detect
            hand-to-face proximity in real time. This processing is{" "}
            <strong style={{ color: SS_GREEN }}>entirely local</strong> — it runs
            on your own machine using a FastAPI + MediaPipe server.
          </p>
          <Bullet>No video frames are ever transmitted to any server</Bullet>
          <Bullet>No images leave your device at any point</Bullet>
          <Bullet>Detection results (proximity events) are logged locally in <code style={{ fontSize: "0.82rem", opacity: 0.7 }}>detections.log</code> on your machine only</Bullet>
          <Bullet>The CV backend runs on <code style={{ fontSize: "0.82rem", opacity: 0.7 }}>localhost:8000</code> — it is never reachable from the internet</Bullet>
          <Bullet>You can disable CV detection at any time from Settings without losing any other functionality</Bullet>
          <p style={{
            fontSize:    "0.82rem",
            opacity:     0.5,
            fontStyle:   "italic",
            marginTop:   "1rem",
            marginBottom: 0,
            borderTop:   "1px solid rgba(255,255,255,0.06)",
            paddingTop:  "0.85rem",
          }}>
            StrandSmart is fully functional without CV detection enabled. The
            camera is never activated unless you explicitly set up and start the
            local backend.
          </p>
        </Section>

        {/* ── Back link ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.34 }}
          style={{ textAlign: "center", marginTop: "0.75rem" }}
        >
          <Link
            to="/"
            style={{
              display:        "inline-block",
              border:         "1px solid rgba(0,200,100,0.35)",
              color:          SS_GREEN,
              fontWeight:     600,
              fontSize:       "0.9rem",
              padding:        "0.65rem 1.75rem",
              borderRadius:   "6px",
              textDecoration: "none",
            }}
          >
            ← Back to Home
          </Link>
        </motion.div>

        {/* Disclaimer */}
        <p style={{
          textAlign:    "center",
          fontSize:     "0.72rem",
          color:        "rgba(255,255,255,0.28)",
          marginTop:    "2rem",
          marginBottom: 0,
          lineHeight:   1.6,
        }}>
          StrandSmart is a peer-support tool. Not a substitute for professional medical advice.
        </p>
      </Container>
    </div>
    <Footer />
  </>
);

export default PrivacyPage;
