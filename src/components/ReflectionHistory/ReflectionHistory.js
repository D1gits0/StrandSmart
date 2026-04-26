/**
 * src/components/ReflectionHistory/ReflectionHistory.js
 *
 * Displays the last 5 reflections as ss-forest index cards.
 * Each card uses a typewriter entrance animation so the text
 * feels personal and meditative rather than snapping in.
 *
 * If a reflection was saved alongside an urge log, a small
 * "Urge Logged" badge appears in ss-green.
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "reactstrap";
import useReflections from "hooks/useReflections";

const SS_GREEN  = "#00c864";
const SS_FOREST = "#0d2b1a";

// ── Typewriter hook ────────────────────────────────────────────────────────────
// Reveals `text` one character at a time at `speed` ms/char.
// Starts only when `active` is true (triggered by IntersectionObserver).
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
    month: "short",
    day:   "numeric",
    hour:  "numeric",
    minute: "2-digit",
  });
};

// ── Single reflection card ─────────────────────────────────────────────────────
const ReflectionCard = ({ reflection, index }) => {
  const [visible, setVisible] = useState(false);
  const displayed = useTypewriter(reflection.text, 16, visible);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.1 }}
      // Start typewriter once the card has animated in
      onAnimationComplete={() => setVisible(true)}
    >
      <Card
        style={{
          background: SS_FOREST,
          border: `1px solid rgba(0,200,100,0.18)`,
          borderRadius: "8px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          marginBottom: "1rem",
        }}
      >
        <CardBody style={{ padding: "1.25rem 1.5rem" }}>
          {/* Header row: timestamp + optional badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.75rem",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                opacity: 0.45,
                letterSpacing: "0.04em",
              }}
            >
              {formatDate(reflection.savedAt)}
            </span>

            {reflection.urgeLogged && (
              <span
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: SS_GREEN,
                  background: "rgba(0,200,100,0.1)",
                  border: `1px solid rgba(0,200,100,0.3)`,
                  borderRadius: "4px",
                  padding: "0.15rem 0.5rem",
                }}
              >
                <i className="tim-icons icon-heart-2" style={{ marginRight: 3, fontSize: "0.65rem" }} />
                Urge Logged
              </span>
            )}
          </div>

          {/* Typewriter text */}
          <p
            style={{
              fontSize: "0.92rem",
              lineHeight: 1.65,
              fontStyle: "italic",
              opacity: 0.85,
              marginBottom: 0,
              minHeight: "1.4em",   // prevents layout jump before text starts
            }}
          >
            {displayed}
            {/* Blinking cursor while typing */}
            {visible && displayed.length < reflection.text.length && (
              <span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: "1em",
                  background: SS_GREEN,
                  marginLeft: 2,
                  verticalAlign: "text-bottom",
                  animation: "blink 0.7s step-end infinite",
                }}
              />
            )}
          </p>
          <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
        </CardBody>
      </Card>
    </motion.div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────
const ReflectionHistory = () => {
  const { reflections, reflectionsLoading, reflectionsError } = useReflections();

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.28 }}
      style={{ marginBottom: "1.5rem" }}
    >
      {/* Section label */}
      <h6
        style={{
          fontWeight: 700,
          letterSpacing: "0.08em",
          fontSize: "0.75rem",
          textTransform: "uppercase",
          opacity: 0.55,
          marginBottom: "1rem",
        }}
      >
        Recent Reflections
      </h6>

      {reflectionsLoading && (
        <p className="text-muted" style={{ fontSize: "0.88rem" }}>
          Loading…
        </p>
      )}

      {reflectionsError && (
        <p className="text-danger" style={{ fontSize: "0.88rem" }}>
          {reflectionsError}
        </p>
      )}

      {!reflectionsLoading && !reflectionsError && reflections.length === 0 && (
        <Card
          style={{
            background: SS_FOREST,
            border: "1px solid rgba(0,200,100,0.12)",
            borderRadius: "8px",
          }}
        >
          <CardBody style={{ padding: "1.25rem 1.5rem" }}>
            <p className="text-muted" style={{ fontSize: "0.88rem", marginBottom: 0 }}>
              No reflections yet. Write something in the "What's on your mind?" box above and hit Save Note.
            </p>
          </CardBody>
        </Card>
      )}

      {!reflectionsLoading &&
        reflections.map((r, i) => (
          <ReflectionCard key={r.id} reflection={r} index={i} />
        ))}
    </motion.div>
  );
};

export default ReflectionHistory;
