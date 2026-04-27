/**
 * src/components/LiveSupportFeed/LiveSupportFeed.js
 *
 * Displays 3 live inspirational quote cards with:
 *   - Shimmer skeleton while loading
 *   - ss-forest background + ss-green border on each card
 *   - Staggered entrance animation
 *   - Refresh button to pull a new set
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "reactstrap";
import useSupportFeed from "hooks/useSupportFeed";

// ── Brand colours ──────────────────────────────────────────────────────────────
const SS_GREEN  = "#00c864";
const SS_FOREST = "#0d2b1a";   // dark green card background

// ── Shimmer skeleton ───────────────────────────────────────────────────────────
const shimmerKeyframes = `
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }
`;

const ShimmerBlock = ({ width = "100%", height = 16, style = {} }) => (
  <div
    style={{
      width,
      height,
      borderRadius: 4,
      background: `linear-gradient(
        90deg,
        rgba(0,200,100,0.06) 25%,
        rgba(0,200,100,0.14) 50%,
        rgba(0,200,100,0.06) 75%
      )`,
      backgroundSize: "800px 100%",
      animation: "shimmer 1.4s infinite linear",
      ...style,
    }}
  />
);

const SkeletonCard = () => (
  <div
    style={{
      background: SS_FOREST,
      border: `1px solid rgba(0,200,100,0.18)`,
      borderRadius: 8,
      padding: "1.5rem",
      height: "100%",
    }}
  >
    <style>{shimmerKeyframes}</style>
    {/* Quote icon placeholder */}
    <ShimmerBlock width={28} height={28} style={{ borderRadius: "50%", marginBottom: "1rem" }} />
    {/* Quote text lines */}
    <ShimmerBlock height={14} style={{ marginBottom: 8 }} />
    <ShimmerBlock height={14} width="85%" style={{ marginBottom: 8 }} />
    <ShimmerBlock height={14} width="70%" style={{ marginBottom: "1.25rem" }} />
    {/* Author line */}
    <ShimmerBlock height={11} width="40%" />
  </div>
);

// ── Quote card ─────────────────────────────────────────────────────────────────
const QuoteCard = ({ quote, author, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.35, delay: index * 0.08 }}
    style={{ height: "100%" }}
  >
    <div
      style={{
        background: SS_FOREST,
        border: `1px solid rgba(0,200,100,0.22)`,
        borderRadius: 8,
        padding: "1.5rem",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(0,200,100,0.5)";
        e.currentTarget.style.boxShadow   = "0 6px 28px rgba(0,200,100,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(0,200,100,0.22)";
        e.currentTarget.style.boxShadow   = "0 4px 20px rgba(0,0,0,0.35)";
      }}
    >
      {/* Opening quote mark */}
      <div
        style={{
          fontSize: "2rem",
          lineHeight: 1,
          color: SS_GREEN,
          opacity: 0.6,
          marginBottom: "0.5rem",
          fontFamily: "Georgia, serif",
        }}
      >
        "
      </div>

      {/* Quote text */}
      <p
        style={{
          fontSize: "0.92rem",
          lineHeight: 1.65,
          opacity: 0.88,
          flexGrow: 1,
          marginBottom: "1rem",
          fontStyle: "italic",
        }}
      >
        {quote}
      </p>

      {/* Author */}
      <p
        style={{
          fontSize: "0.78rem",
          fontWeight: 700,
          letterSpacing: "0.06em",
          color: SS_GREEN,
          marginBottom: 0,
          textTransform: "uppercase",
        }}
      >
        — {author || "Unknown"}
      </p>
    </div>
  </motion.div>
);

// ── Main component ─────────────────────────────────────────────────────────────
const LiveSupportFeed = () => {
  const { quotes, loading, error, refresh } = useSupportFeed();

  return (
    // max-width prevents pancake stretching on wide monitors
    <div style={{ marginTop: "1rem", maxWidth: 500, margin: "1rem auto 0" }}>
      {/* Section header + refresh button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
          flexWrap: "wrap",
          gap: "0.6rem",
        }}
      >
        <div>
          <h5 style={{ fontWeight: 700, marginBottom: "0.15rem", fontSize: "0.95rem" }}>
            Daily Inspiration
          </h5>
          <p className="text-muted" style={{ fontSize: "0.8rem", marginBottom: 0 }}>
            Words to carry with you today.
          </p>
        </div>

        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <Button
            color="primary"
            outline
            size="sm"
            onClick={refresh}
            disabled={loading}
            style={{
              borderRadius: "6px",
              fontWeight: 600,
              letterSpacing: "0.04em",
              borderColor: SS_GREEN,
              color: SS_GREEN,
              opacity: loading ? 0.5 : 1,
              transition: "opacity 0.2s ease",
            }}
          >
            <i
              className="tim-icons icon-refresh-02"
              style={{
                marginRight: 5,
                display: "inline-block",
                animation: loading ? "spin 0.8s linear infinite" : "none",
              }}
            />
            {loading ? "Loading…" : "Refresh"}
          </Button>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </motion.div>
      </div>

      {/* Error state */}
      {error && !loading && (
        <p className="text-danger" style={{ fontSize: "0.85rem" }}>
          {error}{" "}
          <button
            onClick={refresh}
            style={{ background: "none", border: "none", color: SS_GREEN, cursor: "pointer", textDecoration: "underline", padding: 0, fontSize: "inherit" }}
          >
            Try again
          </button>
        </p>
      )}

      {/* Cards — stacked vertically in right column (no Col grid needed) */}
      <div>
        {loading
          ? [0, 1, 2].map((i) => (
              <div key={i} style={{ marginBottom: "0.85rem" }}>
                <SkeletonCard />
              </div>
            ))
          : quotes.map((q, i) => (
              <div key={q.id} style={{ marginBottom: "0.85rem" }}>
                <AnimatePresence mode="wait">
                  <QuoteCard key={q.id} quote={q.quote} author={q.author} index={i} />
                </AnimatePresence>
              </div>
            ))}
      </div>
    </div>
  );
};

export default LiveSupportFeed;
