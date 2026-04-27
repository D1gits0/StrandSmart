/**
 * src/views/ResourcesPage.js
 *
 * Public page — no auth required.
 * A grid of Help Tiles covering crisis support, HRT technique,
 * and community links. Uses the same #0d2b1a + ss-green palette
 * as the Dashboard.
 */

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Container, Row, Col } from "reactstrap";
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";
import Footer         from "components/Footer/Footer.js";

const SS_GREEN  = "#00c864";
const SS_FOREST = "rgba(13, 43, 26, 0.7)";

const DISCLAIMER = "StrandSmart is a peer-support tool. Not a substitute for professional medical advice.";

// ── Tile data ──────────────────────────────────────────────────────────────────
const TILES = [
  {
    id: "crisis",
    icon: "tim-icons icon-mobile",
    label: "Crisis Support",
    accent: true,
    content: (
      <>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.65, marginBottom: "0.75rem" }}>
          If you're in distress right now, the <strong>Crisis Text Line</strong> is free,
          confidential, and available 24/7.
        </p>
        <div style={{
          background: "rgba(0,200,100,0.08)",
          border: "1px solid rgba(0,200,100,0.3)",
          borderRadius: "6px",
          padding: "0.75rem 1rem",
          fontWeight: 700,
          fontSize: "1rem",
          letterSpacing: "0.04em",
          color: SS_GREEN,
        }}>
          Text HOME to 741741
        </div>
        <p style={{ fontSize: "0.78rem", opacity: 0.45, marginTop: "0.6rem", marginBottom: 0 }}>
          US only. Visit crisistextline.org for international options.
        </p>
      </>
    ),
  },
  {
    id: "hrt",
    icon: "tim-icons icon-refresh-02",
    label: "Habit Reversal Training (HRT)",
    content: (
      <>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.65, marginBottom: "0.75rem" }}>
          HRT is the most evidence-backed treatment for trichotillomania. The core
          technique is the <strong>Competing Response</strong>:
        </p>
        <ol style={{ paddingLeft: "1.25rem", marginBottom: "0.75rem" }}>
          {[
            "Notice the urge or the automatic movement beginning.",
            "Clench your fist, grip a pen, or press your fingertips together.",
            "Hold the competing response for 1–3 minutes.",
            "The urge typically passes without pulling.",
          ].map((step, i) => (
            <li key={i} style={{ fontSize: "0.88rem", marginBottom: "0.4rem", lineHeight: 1.5, opacity: 0.85 }}>
              {step}
            </li>
          ))}
        </ol>
        <p style={{ fontSize: "0.78rem", opacity: 0.45, marginBottom: 0 }}>
          A licensed therapist can guide a full HRT programme. Ask your GP for a referral.
        </p>
      </>
    ),
  },
  {
    id: "community",
    icon: "tim-icons icon-single-02",
    label: "Community",
    content: (
      <>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.65, marginBottom: "1rem" }}>
          You are not alone. Thousands of people share their journey in these spaces:
        </p>
        {[
          {
            href: "https://www.reddit.com/r/trichotillomania",
            icon: "fab fa-reddit",
            label: "r/trichotillomania",
            sub: "Reddit — peer stories, tips, and support",
            color: "#FF4500",
          },
          {
            href: "https://www.bfrb.org",
            icon: "tim-icons icon-world",
            label: "TLC Foundation (BFRB.org)",
            sub: "Research, therapist directory, and resources",
            color: SS_GREEN,
          },
        ].map(({ href, icon, label, sub, color }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", display: "block", marginBottom: "0.75rem" }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "6px",
              padding: "0.75rem 1rem",
              transition: "border-color 0.18s ease",
            }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(0,200,100,0.3)"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
            >
              <i className={icon} style={{ color, fontSize: "1.3rem", flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.1rem" }}>{label}</p>
                <p style={{ fontSize: "0.75rem", opacity: 0.45, marginBottom: 0 }}>{sub}</p>
              </div>
              <i className="tim-icons icon-minimal-right" style={{ marginLeft: "auto", opacity: 0.3, fontSize: "0.75rem" }} />
            </div>
          </a>
        ))}
      </>
    ),
  },
  {
    id: "selfhelp",
    icon: "tim-icons icon-book-bookmark",
    label: "Self-Help Strategies",
    content: (
      <>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.65, marginBottom: "0.75rem" }}>
          Practical tools you can use today:
        </p>
        {[
          { icon: "🧤", text: "Wear gloves or finger covers to create a physical barrier." },
          { icon: "💅", text: "Keep nails short or apply bitter-tasting nail polish." },
          { icon: "📓", text: "Keep a trigger journal — note time, place, and mood when urges hit." },
          { icon: "🎯", text: "Use StrandSmart's Urge Tracker to build awareness over time." },
        ].map(({ icon, text }, i) => (
          <div key={i} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.6rem", alignItems: "flex-start" }}>
            <span style={{ fontSize: "1.1rem", flexShrink: 0, lineHeight: 1.4 }}>{icon}</span>
            <p style={{ fontSize: "0.88rem", opacity: 0.82, marginBottom: 0, lineHeight: 1.5 }}>{text}</p>
          </div>
        ))}
      </>
    ),
  },
  {
    id: "professional",
    icon: "tim-icons icon-badge",
    label: "Finding Professional Help",
    content: (
      <>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.65, marginBottom: "0.75rem" }}>
          Therapy is the most effective long-term treatment. Look for a therapist
          trained in:
        </p>
        {["Habit Reversal Training (HRT)", "Comprehensive Behavioral Treatment (ComB)", "Acceptance & Commitment Therapy (ACT)"].map((t) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: SS_GREEN, flexShrink: 0 }} />
            <p style={{ fontSize: "0.88rem", opacity: 0.82, marginBottom: 0 }}>{t}</p>
          </div>
        ))}
        <a
          href="https://www.bfrb.org/find-a-therapist"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "0.82rem", color: SS_GREEN, display: "inline-block", marginTop: "0.75rem" }}
        >
          Find a BFRB-trained therapist →
        </a>
      </>
    ),
  },
  {
    id: "app",
    icon: "tim-icons icon-spaceship",
    label: "Use StrandSmart",
    accent: true,
    content: (
      <>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.65, marginBottom: "1rem" }}>
          StrandSmart's tools are designed to complement your recovery:
        </p>
        {[
          "Log urges to build self-awareness",
          "Use the Fidget Canvas as a sensory substitute",
          "Track your mindful streak over time",
          "Write reflections to understand your triggers",
        ].map((item) => (
          <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", marginBottom: "0.5rem" }}>
            <i className="tim-icons icon-check-2" style={{ color: SS_GREEN, fontSize: "0.75rem", marginTop: "0.3rem", flexShrink: 0 }} />
            <p style={{ fontSize: "0.88rem", opacity: 0.82, marginBottom: 0 }}>{item}</p>
          </div>
        ))}
        <Link
          to="/register-page"
          style={{
            display: "inline-block",
            marginTop: "1rem",
            background: SS_GREEN,
            color: "#000",
            fontWeight: 700,
            fontSize: "0.85rem",
            padding: "0.5rem 1.25rem",
            borderRadius: "6px",
            textDecoration: "none",
            boxShadow: "0 4px 14px rgba(0,200,100,0.3)",
          }}
        >
          Get Started Free
        </Link>
      </>
    ),
  },
];

// ── Help Tile ──────────────────────────────────────────────────────────────────
const HelpTile = ({ tile, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay: index * 0.07 }}
    style={{ height: "100%", marginBottom: "1.25rem" }}
  >
    <div style={{
      background:    SS_FOREST,
      backdropFilter: "blur(12px)",
      border:        tile.accent
        ? "1px solid rgba(0,200,100,0.35)"
        : "1px solid rgba(0,200,100,0.12)",
      borderRadius:  "10px",
      padding:       "1.5rem",
      height:        "100%",
      boxShadow:     tile.accent
        ? "0 4px 24px rgba(0,200,100,0.12)"
        : "0 4px 20px rgba(0,0,0,0.4)",
      transition:    "border-color 0.2s ease, box-shadow 0.2s ease",
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(0,200,100,0.4)";
        e.currentTarget.style.boxShadow   = "0 6px 32px rgba(0,200,100,0.14)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = tile.accent ? "rgba(0,200,100,0.35)" : "rgba(0,200,100,0.12)";
        e.currentTarget.style.boxShadow   = tile.accent ? "0 4px 24px rgba(0,200,100,0.12)" : "0 4px 20px rgba(0,0,0,0.4)";
      }}
    >
      {/* Tile header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
          background: "rgba(0,200,100,0.1)",
          border: "1px solid rgba(0,200,100,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <i className={tile.icon} style={{ color: SS_GREEN, fontSize: "1.1rem" }} />
        </div>
        <h6 style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 0, lineHeight: 1.3 }}>
          {tile.label}
        </h6>
      </div>

      {tile.content}
    </div>
  </motion.div>
);

// ── Page ───────────────────────────────────────────────────────────────────────
const ResourcesPage = () => (
  <>
    <ExamplesNavbar />
    <div style={{ minHeight: "100vh", background: "#0d2b1a", paddingTop: "80px", paddingBottom: "3rem" }}>
      {/* Radial glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,200,100,0.07) 0%, transparent 70%)",
      }} />

      <Container style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ textAlign: "center", padding: "2rem 0 2.5rem" }}
        >
          <div style={{
            width: 64, height: 64, borderRadius: "50%", margin: "0 auto 1.25rem",
            background: "rgba(0,200,100,0.1)", border: "2px solid rgba(0,200,100,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <i className="tim-icons icon-book-bookmark" style={{ color: SS_GREEN, fontSize: "1.8rem" }} />
          </div>
          <h2 style={{ fontWeight: 800, marginBottom: "0.5rem" }}>Resources</h2>
          <p style={{ fontSize: "0.95rem", opacity: 0.6, maxWidth: 480, margin: "0 auto" }}>
            Tools, techniques, and communities to support your journey with trichotillomania.
          </p>
        </motion.div>

        {/* Tile grid */}
        <Row>
          {TILES.map((tile, i) => (
            <Col lg="4" md="6" key={tile.id}>
              <HelpTile tile={tile} index={i} />
            </Col>
          ))}
        </Row>

        {/* Disclaimer */}
        <p style={{
          textAlign: "center", fontSize: "0.72rem",
          color: "rgba(255,255,255,0.28)", marginTop: "1.5rem",
        }}>
          {DISCLAIMER}
        </p>
      </Container>
    </div>
    <Footer />
  </>
);

export default ResourcesPage;
