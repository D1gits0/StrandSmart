/**
 * src/components/ReflectionHistory/ReflectionHistory.js
 *
 * Scrollable feed of the user's last 5 reflections.
 *
 * Layout:
 *   - Outer wrapper: max-width 500px, centered, position: relative
 *   - Scroll container: max-height 450px, overflow-y auto, custom scrollbar
 *   - Fade mask: linear-gradient overlay on the outer wrapper so the
 *     fade stays fixed at the bottom regardless of scroll position
 *
 * Reflections are ordered newest-first (Firestore query handles this).
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "reactstrap";
import useReflections from "hooks/useReflections";

const SS_GREEN  = "#00c864";
const SS_FOREST = "#0d2b1a";

// ── Typewriter hook ────────────────────────────────────────────────────────────
const useTypewriter = (text, speed = 18, active = false) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!active || !text) return;
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, active]);

  return displayed;
};

// ── Format date ────────────────────────────────────────────────────────────────
const formatDate = (date) => {
  if (!date) return "";
  return date.toLocaleString("en-US", {
    month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit",
  });
};

// ── Single reflection card ─────────────────────────────────────────────────────
const ReflectionCard = ({ reflection, index }) => {
  const [visible, setVisible] = useState(false);
  const displayed = useTypewriter(reflection.text, 16, visible);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      onAnimationComplete={() => setVisible(true)}
      style={{ marginBottom: "0.75rem" }}
    >
      <Card
        style={{
          background: SS_FOREST,
          border: "1px solid rgba(0,200,100,0.18)",
          borderRadius: "8px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
          marginBottom: 0,   // spacing handled by motion.div above
        }}
      >
        <CardBody style={{ padding: "1rem 1.25rem" }}>
          {/* Header: timestamp + badge */}
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
            flexWrap: "wrap", gap: "0.4rem",
          }}>
            <span style={{ fontSize: "0.72rem", opacity: 0.4, letterSpacing: "0.04em" }}>
              {formatDate(reflection.savedAt)}
            </span>

            {reflection.urgeLogged && (
              <span style={{
                fontSize: "0.65rem", fontWeight: 700,
                letterSpacing: "0.07em", textTransform: "uppercase",
                color: SS_GREEN,
                background: "rgba(0,200,100,0.1)",
                border: "1px solid rgba(0,200,100,0.3)",
                borderRadius: "4px", padding: "0.1rem 0.45rem",
              }}>
                <i className="tim-icons icon-heart-2" style={{ marginRight: 3, fontSize: "0.6rem" }} />
                Urge Logged
              </span>
            )}
          </div>

          {/* Typewriter text */}
          <p style={{
            fontSize: "0.88rem", lineHeight: 1.6,
            fontStyle: "italic", opacity: 0.82,
            marginBottom: 0, minHeight: "1.3em",
          }}>
            {displayed}
            {visible && displayed.length < reflection.text.length && (
              <span style={{
                display: "inline-block", width: 2, height: "1em",
                background: SS_GREEN, marginLeft: 2,
                verticalAlign: "text-bottom",
                animation: "blink 0.7s step-end infinite",
              }} />
            )}
          </p>
          <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
        </CardBody>
      </Card>
    </motion.div>
  );
};

// ── Section label ──────────────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <h6 style={{
    fontWeight: 700, letterSpacing: "0.08em",
    fontSize: "0.72rem", textTransform: "uppercase",
    opacity: 0.5, marginBottom: "0.85rem",
  }}>
    {children}
  </h6>
);

// ── Main component ─────────────────────────────────────────────────────────────
const ReflectionHistory = () => {
  const { reflections, reflectionsLoading, reflectionsError } = useReflections();

  const hasReflections = !reflectionsLoading && !reflectionsError && reflections.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.28 }}
      style={{
        maxWidth: 500,
        margin: "0 auto",
        flexGrow: 0,
      }}
    >
      <SectionLabel>Recent Reflections</SectionLabel>

      {reflectionsLoading && (
        <p className="text-muted" style={{ fontSize: "0.85rem" }}>Loading…</p>
      )}

      {reflectionsError && (
        <p className="text-danger" style={{ fontSize: "0.85rem" }}>{reflectionsError}</p>
      )}

      {!reflectionsLoading && !reflectionsError && reflections.length === 0 && (
        <Card style={{ background: SS_FOREST, border: "1px solid rgba(0,200,100,0.12)", borderRadius: "8px" }}>
          <CardBody style={{ padding: "1rem 1.25rem" }}>
            <p className="text-muted" style={{ fontSize: "0.85rem", marginBottom: 0 }}>
              No reflections yet. Write something above and hit Save Note.
            </p>
          </CardBody>
        </Card>
      )}

      {hasReflections && (
        /*
          Outer wrapper: position relative so the fade overlay is anchored
          to the bottom of this box, not the scrollable content inside.
        */
        <div style={{ position: "relative" }}>

          {/* Scrollable feed */}
          <div
            className="reflection-scroll"
            style={{
              maxHeight:   450,
              overflowY:   "auto",
              overflowX:   "hidden",
              paddingRight: 4,   // breathing room for the scrollbar
              // Mask: content fades out over the bottom 60px
              // The mask is on the scroll container itself so it clips
              // the content as it scrolls under the fade zone.
              WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 75%, transparent 100%)",
              maskImage:       "linear-gradient(to bottom, black 0%, black 75%, transparent 100%)",
            }}
          >
            {/* Reflections are already newest-first from Firestore (orderBy desc) */}
            {reflections.map((r, i) => (
              <ReflectionCard key={r.id} reflection={r} index={i} />
            ))}

            {/* Bottom spacer so the last card isn't hidden under the fade */}
            <div style={{ height: 40 }} />
          </div>

          {/* "More below" hint — only shown when content overflows */}
          {reflections.length >= 3 && (
            <div style={{
              position:       "absolute",
              bottom:         0,
              left:           0,
              right:          0,
              textAlign:      "center",
              pointerEvents:  "none",
              paddingBottom:  "0.25rem",
            }}>
              <span style={{
                fontSize:      "0.65rem",
                opacity:       0.3,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}>
                scroll for more
              </span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ReflectionHistory;
