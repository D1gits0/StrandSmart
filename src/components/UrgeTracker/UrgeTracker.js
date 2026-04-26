/**
 * src/components/UrgeTracker/UrgeTracker.js
 *
 * The core interaction widget on the Dashboard.
 *
 * States:
 *   idle      — shows the "Log Urge" button
 *   logging   — button is disabled, spinner shown
 *   success   — green confirmation + link to Grounding page
 *   error     — red error message with retry option
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Card, CardBody } from "reactstrap";
import useUrgeLog from "hooks/useUrgeLog";

// How long (ms) to show the success state before returning to idle
const SUCCESS_RESET_MS = 8000;

const UrgeTracker = () => {
  const { logUrge, recentLogs, logsLoading } = useUrgeLog();
  const [status,    setStatus]    = useState("idle");   // idle | logging | success | error
  const [errorMsg,  setErrorMsg]  = useState("");

  const handleLogUrge = async () => {
    setStatus("logging");
    setErrorMsg("");
    try {
      await logUrge();
      setStatus("success");
      // Auto-reset after SUCCESS_RESET_MS so the button is available again
      setTimeout(() => setStatus("idle"), SUCCESS_RESET_MS);
    } catch (err) {
      console.error("logUrge error:", err);
      setErrorMsg("Could not save. Please try again.");
      setStatus("error");
    }
  };

  return (
    <Card
      style={{
        borderRadius: "8px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
        marginBottom: "2rem",
        overflow: "hidden",
      }}
    >
      <CardBody style={{ padding: "2rem", textAlign: "center" }}>
        <h4 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
          Urge Tracker
        </h4>
        <p className="text-muted" style={{ fontSize: "0.9rem", marginBottom: "1.75rem" }}>
          Feeling an urge? Log it — awareness is the first step.
        </p>

        {/* ── Main button / feedback area ── */}
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.18 }}
            >
              <motion.button
                onClick={handleLogUrge}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  background: "linear-gradient(135deg, #00c864 0%, #00a050 100%)",
                  border: "none",
                  borderRadius: "50%",
                  width: 140,
                  height: 140,
                  cursor: "pointer",
                  boxShadow: "0 8px 28px rgba(0,200,100,0.45)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  color: "#fff",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  lineHeight: 1.3,
                }}
              >
                <i
                  className="tim-icons icon-heart-2"
                  style={{ fontSize: "2rem", marginBottom: "0.4rem" }}
                />
                Log Urge
              </motion.button>
            </motion.div>
          )}

          {status === "logging" && (
            <motion.div
              key="logging"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", justifyContent: "center", padding: "2rem 0" }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  border: "4px solid rgba(0,200,100,0.2)",
                  borderTop: "4px solid #00c864",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              style={{ padding: "1rem 0" }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgba(0,200,100,0.15)",
                  border: "2px solid #00c864",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                }}
              >
                <i
                  className="tim-icons icon-check-2"
                  style={{ color: "#00c864", fontSize: "1.6rem" }}
                />
              </div>
              <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
                Urge logged. You're doing great.
              </p>
              <p className="text-muted" style={{ fontSize: "0.88rem", marginBottom: "1rem" }}>
                Need help right now?
              </p>
              <Link to="/grounding">
                <Button
                  color="primary"
                  style={{
                    borderRadius: "6px",
                    fontWeight: 600,
                    boxShadow: "0 4px 14px rgba(0,200,100,0.3)",
                  }}
                >
                  <i className="tim-icons icon-spaceship" style={{ marginRight: 6 }} />
                  Go to Grounding Exercises
                </Button>
              </Link>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ padding: "1rem 0" }}
            >
              <p className="text-danger" style={{ marginBottom: "1rem" }}>
                {errorMsg}
              </p>
              <Button
                color="primary"
                outline
                onClick={() => setStatus("idle")}
                style={{ borderRadius: "6px", fontWeight: 600 }}
              >
                Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Recent log count ── */}
        {!logsLoading && recentLogs.length > 0 && (
          <p
            className="text-muted"
            style={{ fontSize: "0.8rem", marginTop: "1.5rem", marginBottom: 0 }}
          >
            {recentLogs.length === 1
              ? "1 urge logged recently"
              : `${recentLogs.length} urges logged recently`}
          </p>
        )}
      </CardBody>
    </Card>
  );
};

export default UrgeTracker;
