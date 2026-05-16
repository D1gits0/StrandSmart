/**
 * src/views/TermsPage.js
 *
 * Public placeholder page at /terms — no auth required.
 * Linked from the Terms checkbox on RegisterPage.
 * Requirements: 3.4
 */

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Container } from "reactstrap";
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";
import Footer         from "components/Footer/Footer.js";

const SS_GREEN = "#00c864";

const TermsPage = () => (
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
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ textAlign: "center", padding: "2.5rem 0 2rem" }}
        >
          {/* Icon */}
          <div style={{
            width:           64,
            height:          64,
            borderRadius:    "50%",
            margin:          "0 auto 1.25rem",
            background:      "rgba(0,200,100,0.1)",
            border:          "2px solid rgba(0,200,100,0.35)",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
          }}>
            <i className="tim-icons icon-single-copy-04" style={{ color: SS_GREEN, fontSize: "1.6rem" }} />
          </div>

          <h2 style={{ fontWeight: 800, marginBottom: "0.75rem" }}>Terms of Service</h2>
          <p style={{ fontSize: "0.95rem", opacity: 0.6, maxWidth: 480, margin: "0 auto 2rem" }}>
            Our full Terms of Service are being drafted and will be available here soon.
          </p>
        </motion.div>

        {/* Placeholder card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            background:      "rgba(13, 43, 26, 0.7)",
            backdropFilter:  "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border:          "1px solid rgba(0, 200, 100, 0.15)",
            borderRadius:    "10px",
            boxShadow:       "0 4px 24px rgba(0,0,0,0.4)",
            padding:         "2rem 2.25rem",
            marginBottom:    "2rem",
          }}
        >
          <p style={{ fontSize: "0.95rem", lineHeight: 1.8, opacity: 0.75, marginBottom: "1rem" }}>
            StrandSmart is a peer-support tool designed to help people managing
            body-focused repetitive behaviors track urges and practice grounding
            exercises. It is not a substitute for professional medical advice,
            diagnosis, or treatment.
          </p>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.8, opacity: 0.75, marginBottom: "1rem" }}>
            By using StrandSmart you agree to use it responsibly and acknowledge
            that the app is provided as-is for personal, non-commercial use.
          </p>
          <p style={{ fontSize: "0.88rem", lineHeight: 1.7, opacity: 0.45, fontStyle: "italic", marginBottom: 0 }}>
            A complete Terms of Service document — covering account usage, data
            handling, liability limitations, and dispute resolution — will be
            published here before the public launch.
          </p>
        </motion.div>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{ textAlign: "center" }}
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
      </Container>
    </div>
    <Footer />
  </>
);

export default TermsPage;
