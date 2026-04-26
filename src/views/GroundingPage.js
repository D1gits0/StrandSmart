import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Container, Row, Col, Card, CardBody, CardTitle, Button } from "reactstrap";
import ExamplesNavbar    from "components/Navbars/ExamplesNavbar.js";
import Footer            from "components/Footer/Footer.js";
import StrandFlow        from "components/StrandFlow/StrandFlow";
import SuccessToast      from "components/Toast/SuccessToast";
import useReflections    from "hooks/useReflections";

// ── Exercise data ──────────────────────────────────────────────────────────────
const EXERCISES = [
  {
    id: "5-4-3-2-1",
    icon: "tim-icons icon-world",
    title: "5-4-3-2-1 Grounding",
    duration: "~2 min",
    description: "Anchor yourself to the present moment by naming things you can sense right now.",
    steps: [
      "Name 5 things you can SEE around you.",
      "Name 4 things you can physically FEEL (chair, floor, air).",
      "Name 3 things you can HEAR right now.",
      "Name 2 things you can SMELL (or like the smell of).",
      "Name 1 thing you can TASTE.",
    ],
  },
  {
    id: "box-breathing",
    icon: "tim-icons icon-refresh-02",
    title: "Box Breathing",
    duration: "~3 min",
    description: "Slow your nervous system with a simple 4-count breathing pattern.",
    steps: [
      "Breathe IN slowly for 4 counts.",
      "HOLD your breath for 4 counts.",
      "Breathe OUT slowly for 4 counts.",
      "HOLD empty for 4 counts.",
      "Repeat 4–6 times.",
    ],
  },
  {
    id: "cold-water",
    icon: "tim-icons icon-tap-02",
    title: "Cold Water Reset",
    duration: "~1 min",
    description: "A quick physical interrupt that shifts your body's focus away from the urge.",
    steps: [
      "Go to a sink or grab a cold drink.",
      "Run cold water over your wrists and hands for 30 seconds.",
      "Notice the temperature — focus only on that sensation.",
      "Dry your hands slowly and deliberately.",
    ],
  },
  {
    id: "body-scan",
    icon: "tim-icons icon-heart-2",
    title: "Quick Body Scan",
    duration: "~2 min",
    description: "Release tension you may not know you're holding.",
    steps: [
      "Close your eyes and take one slow breath.",
      "Notice your feet — are they tense? Relax them.",
      "Move up: legs, stomach, shoulders, jaw.",
      "Unclench anything that feels tight.",
      "Take one more slow breath and open your eyes.",
    ],
  },
];

// ── Collapsible exercise card ──────────────────────────────────────────────────
const ExerciseCard = ({ exercise, index }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
    >
      <Card
        style={{ borderRadius: "8px", boxShadow: "0 4px 16px rgba(0,0,0,0.35)", marginBottom: "1rem", cursor: "pointer" }}
        onClick={() => setExpanded((p) => !p)}
      >
        <CardBody style={{ padding: "1.25rem 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(0,200,100,0.12)", border: "1px solid rgba(0,200,100,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className={exercise.icon} style={{ color: "#00c864", fontSize: "1.2rem" }} />
              </div>
              <div>
                <CardTitle tag="h6" style={{ fontWeight: 700, marginBottom: "0.1rem" }}>{exercise.title}</CardTitle>
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>{exercise.duration}</span>
              </div>
            </div>
            <i className={`tim-icons ${expanded ? "icon-minimal-up" : "icon-minimal-down"}`} style={{ opacity: 0.4, fontSize: "0.8rem" }} />
          </div>

          <motion.div
            initial={false}
            animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: "hidden" }}
          >
            <p className="text-muted" style={{ fontSize: "0.88rem", marginTop: "1rem", marginBottom: "0.75rem" }}>
              {exercise.description}
            </p>
            <ol style={{ paddingLeft: "1.25rem", marginBottom: 0 }}>
              {exercise.steps.map((step, i) => (
                <li key={i} style={{ fontSize: "0.88rem", marginBottom: "0.4rem", lineHeight: 1.5, opacity: 0.85 }}>
                  {step}
                </li>
              ))}
            </ol>
          </motion.div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

// ── Page ───────────────────────────────────────────────────────────────────────
const GroundingPage = () => {
  const navigate          = useNavigate();
  const { saveReflection } = useReflections();

  const [sessionLogged, setSessionLogged] = useState(false);
  const [toastVisible,  setToastVisible]  = useState(false);
  const [toastMessage,  setToastMessage]  = useState("");

  // Called by StrandFlow when the 60s timer completes
  const handleSessionComplete = useCallback(async () => {
    if (sessionLogged) return;   // guard against double-fire
    setSessionLogged(true);
    try {
      await saveReflection("Completed a 60-second grounding session.", false);
    } catch (err) {
      console.error("auto-log error:", err);
    }
  }, [saveReflection, sessionLogged]);

  // "I'm Grounded" button
  const handleGrounded = () => {
    setToastMessage("You're grounded. Great work. 🌿");
    setToastVisible(true);
    // Navigate after a short delay so the toast is visible briefly
    setTimeout(() => navigate("/dashboard"), 2200);
  };

  return (
    <>
      <ExamplesNavbar />
      <div className="wrapper">
        <div className="page-header" style={{ minHeight: "100vh", paddingTop: "80px" }}>
          <div className="squares square1" />
          <div className="squares square2" />
          <div className="squares square3" />

          <Container>
            <Row className="justify-content-center">
              <Col lg="7" md="9">

                {/* ── Page header ── */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ textAlign: "center", marginBottom: "2rem" }}
                >
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(0,200,100,0.12)", border: "2px solid rgba(0,200,100,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                    <i className="tim-icons icon-heart-2" style={{ color: "#00c864", fontSize: "2rem" }} />
                  </div>
                  <h2 style={{ fontWeight: 800, marginBottom: "0.5rem" }}>Grounding Exercises</h2>
                  <p className="text-muted" style={{ fontSize: "0.95rem", maxWidth: 420, margin: "0 auto" }}>
                    You logged an urge — that took courage. Use the canvas below or pick an exercise.
                  </p>
                </motion.div>

                {/* ── Strand Flow canvas ── */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <Card style={{ borderRadius: "8px", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", marginBottom: "1.5rem", border: "1px solid rgba(0,200,100,0.15)" }}>
                    <CardBody style={{ padding: "1.5rem 1.75rem" }}>
                      {/* Section label */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00c864" }} />
                        <h6 style={{ fontWeight: 700, letterSpacing: "0.08em", fontSize: "0.75rem", textTransform: "uppercase", opacity: 0.55, margin: 0 }}>
                          Strand Flow — Digital Fidget
                        </h6>
                      </div>
                      <p className="text-muted" style={{ fontSize: "0.85rem", marginBottom: "1rem" }}>
                        Draw freely. The timer runs while you're touching the canvas. Reach 60 seconds to complete the session.
                      </p>

                      <StrandFlow onSessionComplete={handleSessionComplete} />

                      {/* Session logged confirmation */}
                      {sessionLogged && (
                        <motion.p
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{ fontSize: "0.82rem", color: "#00c864", marginTop: "0.75rem", marginBottom: 0 }}
                        >
                          <i className="tim-icons icon-check-2" style={{ marginRight: 5 }} />
                          Session logged to your reflections.
                        </motion.p>
                      )}
                    </CardBody>
                  </Card>
                </motion.div>

                {/* ── "I'm Grounded" CTA ── */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.18 }}
                  style={{ textAlign: "center", marginBottom: "2rem" }}
                >
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    style={{ display: "inline-block" }}
                  >
                    <Button
                      color="primary"
                      size="lg"
                      onClick={handleGrounded}
                      style={{
                        borderRadius: "8px",
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        padding: "0.8rem 2.5rem",
                        boxShadow: "0 6px 24px rgba(0,200,100,0.35)",
                        fontSize: "1rem",
                      }}
                    >
                      <i className="tim-icons icon-check-2" style={{ marginRight: 8 }} />
                      I'm Grounded
                    </Button>
                  </motion.div>
                  <p className="text-muted" style={{ fontSize: "0.8rem", marginTop: "0.6rem" }}>
                    Returns you to the Dashboard
                  </p>
                </motion.div>

                {/* ── Collapsible exercises ── */}
                <h6 style={{ fontWeight: 700, letterSpacing: "0.08em", fontSize: "0.75rem", textTransform: "uppercase", opacity: 0.45, marginBottom: "1rem" }}>
                  More Techniques
                </h6>
                {EXERCISES.map((ex, i) => (
                  <ExerciseCard key={ex.id} exercise={ex} index={i} />
                ))}

                {/* Back link */}
                <div style={{ textAlign: "center", marginTop: "1.5rem", paddingBottom: "2rem" }}>
                  <Button
                    color="primary"
                    outline
                    onClick={() => navigate("/dashboard")}
                    style={{ borderRadius: "6px", fontWeight: 600 }}
                  >
                    <i className="tim-icons icon-minimal-left" style={{ marginRight: 6 }} />
                    Back to Dashboard
                  </Button>
                </div>

              </Col>
            </Row>
          </Container>
        </div>
        <Footer />
      </div>

      {/* Success toast — rendered outside the scroll container */}
      <SuccessToast
        message={toastMessage}
        visible={toastVisible}
        onDismiss={() => setToastVisible(false)}
      />
    </>
  );
};

export default GroundingPage;
