/**
 * src/components/Grounding/SensoryChallenge.js
 *
 * The 5-4-3-2-1 Guided Sensory Challenge.
 *
 * Displays one step at a time in large, calming text.
 * The user taps "Next" to advance through all 5 steps.
 * On completion, shows a celebration screen and calls onComplete().
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SS_GREEN = "#00c864";

const STEPS = [
  {
    count: 5,
    sense: "SEE",
    icon:  "👁️",
    prompt: "Name 5 things you can SEE right now.",
    hint:   "Look around slowly. A lamp, a shadow, a colour on the wall…",
  },
  {
    count: 4,
    sense: "FEEL",
    icon:  "🤲",
    prompt: "Name 4 things you can physically FEEL.",
    hint:   "The chair beneath you, the air on your skin, your feet on the floor…",
  },
  {
    count: 3,
    sense: "HEAR",
    icon:  "👂",
    prompt: "Name 3 things you can HEAR.",
    hint:   "Traffic outside, your own breathing, a distant sound…",
  },
  {
    count: 2,
    sense: "SMELL",
    icon:  "🌿",
    prompt: "Name 2 things you can SMELL.",
    hint:   "Or two things you like the smell of. Take a slow breath.",
  },
  {
    count: 1,
    sense: "TASTE",
    icon:  "✨",
    prompt: "Name 1 thing you can TASTE.",
    hint:   "Or one thing you'd like to taste right now.",
  },
];

const SensoryChallenge = ({ onComplete }) => {
  const [step,      setStep]      = useState(0);
  const [done,      setDone]      = useState(false);
  const [direction, setDirection] = useState(1);   // 1 = forward, -1 = back

  const current = STEPS[step];
  const isLast  = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      setDone(true);
      if (onComplete) onComplete();
    } else {
      setDirection(1);
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step === 0) return;
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const handleRestart = () => {
    setStep(0);
    setDone(false);
    setDirection(1);
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: "center", padding: "2rem 1rem" }}
      >
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          style={{ fontSize: "3.5rem", marginBottom: "1rem" }}
        >
          🌿
        </motion.div>
        <h3 style={{ fontWeight: 800, marginBottom: "0.5rem" }}>
          You're present.
        </h3>
        <p style={{ opacity: 0.6, fontSize: "0.95rem", maxWidth: 320, margin: "0 auto 1.5rem" }}>
          You just completed the 5-4-3-2-1 grounding technique. Your nervous
          system is calmer than it was 2 minutes ago.
        </p>
        <button
          onClick={handleRestart}
          style={{
            background:   "transparent",
            border:       `1px solid rgba(0,200,100,0.35)`,
            borderRadius: "6px",
            color:        SS_GREEN,
            cursor:       "pointer",
            fontSize:     "0.85rem",
            fontWeight:   600,
            padding:      "0.5rem 1.25rem",
          }}
        >
          Do it again
        </button>
      </motion.div>
    );
  }

  return (
    <div style={{ padding: "1rem 0" }}>
      {/* Progress dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "2rem" }}>
        {STEPS.map((_, i) => (
          <div
            key={i}
            style={{
              width:        i === step ? 24 : 8,
              height:       8,
              borderRadius: 4,
              background:   i <= step ? SS_GREEN : "rgba(255,255,255,0.15)",
              transition:   "all 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Step card — AnimatePresence for slide transition */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{   opacity: 0, x: direction * -40 }}
          transition={{ duration: 0.28 }}
          style={{ textAlign: "center", minHeight: 220, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
        >
          {/* Big emoji */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1,   opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
            style={{ fontSize: "3rem", marginBottom: "1.25rem" }}
          >
            {current.icon}
          </motion.div>

          {/* Count badge */}
          <div style={{
            display:        "inline-flex",
            alignItems:     "center",
            gap:            "0.4rem",
            background:     "rgba(0,200,100,0.1)",
            border:         "1px solid rgba(0,200,100,0.25)",
            borderRadius:   "20px",
            padding:        "0.2rem 0.85rem",
            marginBottom:   "1rem",
          }}>
            <span style={{ fontWeight: 800, fontSize: "1.1rem", color: SS_GREEN }}>
              {current.count}
            </span>
            <span style={{ fontSize: "0.75rem", opacity: 0.6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              things to {current.sense}
            </span>
          </div>

          {/* Main prompt */}
          <h3 style={{
            fontWeight:   700,
            fontSize:     "1.3rem",
            lineHeight:   1.35,
            marginBottom: "0.75rem",
            maxWidth:     340,
          }}>
            {current.prompt}
          </h3>

          {/* Hint */}
          <p style={{
            fontSize:  "0.88rem",
            opacity:   0.45,
            maxWidth:  300,
            lineHeight: 1.6,
            marginBottom: 0,
            fontStyle: "italic",
          }}>
            {current.hint}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", marginTop: "2rem" }}>
        {step > 0 && (
          <button
            onClick={handleBack}
            style={{
              background:   "transparent",
              border:       "1px solid rgba(255,255,255,0.15)",
              borderRadius: "8px",
              color:        "rgba(255,255,255,0.5)",
              cursor:       "pointer",
              fontSize:     "0.85rem",
              padding:      "0.6rem 1.25rem",
            }}
          >
            ← Back
          </button>
        )}
        <motion.button
          onClick={handleNext}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          style={{
            background:   SS_GREEN,
            border:       "none",
            borderRadius: "8px",
            color:        "#000",
            cursor:       "pointer",
            fontWeight:   700,
            fontSize:     "0.95rem",
            padding:      "0.65rem 2rem",
            boxShadow:    "0 4px 16px rgba(0,200,100,0.3)",
          }}
        >
          {isLast ? "I'm done ✓" : "Next →"}
        </motion.button>
      </div>

      {/* Step counter */}
      <p style={{ textAlign: "center", fontSize: "0.7rem", opacity: 0.3, marginTop: "1rem", marginBottom: 0 }}>
        Step {step + 1} of {STEPS.length}
      </p>
    </div>
  );
};

export default SensoryChallenge;
