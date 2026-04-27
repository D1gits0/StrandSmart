import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Row, Col, Card, CardBody, CardTitle, Button } from "reactstrap";
import ExamplesNavbar    from "components/Navbars/ExamplesNavbar.js";
import Footer            from "components/Footer/Footer.js";
import FidgetCanvas      from "components/FidgetCanvas/FidgetCanvas";
import SensoryChallenge  from "components/Grounding/SensoryChallenge";
import SuccessToast      from "components/Toast/SuccessToast";
import useReflections    from "hooks/useReflections";

const SS_GREEN = "#00c864";

// ── Exercise data ──────────────────────────────────────────────────────────────
const EXERCISES = [
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
                <i className={exercise.icon} style={{ color: SS_GREEN, fontSize: "1.2rem" }} />
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

// ── Tab bar ────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "canvas",    label: "Strand Flow",    icon: "tim-icons icon-tap-02" },
  { id: "5-4-3-2-1", label: "5-4-3-2-1",     icon: "tim-icons icon-world" },
  { id: "exercises", label: "Techniques",     icon: "tim-icons icon-book-bookmark" },
];

const TabBar = ({ active, onChange }) => (
  <div style={{
    display:        "flex",
    gap:            "0.5rem",
    marginBottom:   "1.5rem",
    background:     "rgba(0,0,0,0.2)",
    borderRadius:   "10px",
    padding:        "0.3rem",
  }}>
    {TABS.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        style={{
          flex:         1,
          background:   active === tab.id ? "rgba(0,200,100,0.15)" : "transparent",
          border:       active === tab.id ? "1px solid rgba(0,200,100,0.3)" : "1px solid transparent",
          borderRadius: "7px",
          color:        active === tab.id ? SS_GREEN : "rgba(255,255,255,0.45)",
          cursor:       "pointer",
          fontSize:     "0.75rem",
          fontWeight:   active === tab.id ? 700 : 500,
          padding:      "0.5rem 0.25rem",
          transition:   "all 0.18s ease",
          display:      "flex",
          flexDirection: "column",
          alignItems:   "center",
          gap:          "0.25rem",
        }}
      >
        <i className={tab.icon} style={{ fontSize: "0.9rem" }} />
        {tab.label}
      </button>
    ))}
  </div>
);

// ── Page ───────────────────────────────────────────────────────────────────────
const GroundingPage = () => {
  const navigate           = useNavigate();
  const { saveReflection } = useReflections();

  const [activeTab,     setActiveTab]     = useState("canvas");
  const [sessionLogged, setSessionLogged] = useState(false);
  const [toastVisible,  setToastVisible]  = useState(false);
  const [toastMessage,  setToastMessage]  = useState("");

  const handleSessionComplete = useCallback(async () => {
    if (sessionLogged) return;
    setSessionLogged(true);
    try {
      await saveReflection("Completed 1 minute of sensory grounding.", false);
    } catch (err) {
      console.error("auto-log error:", err);
    }
  }, [saveReflection, sessionLogged]);

  const handleSensoryComplete = useCallback(async () => {
    try {
      await saveReflection("Completed the 5-4-3-2-1 grounding challenge.", false);
    } catch (err) {
      console.error("sensory complete log error:", err);
    }
  }, [saveReflection]);

  const handleGrounded = () => {
    setToastMessage("You're grounded. Great work. 🌿");
    setToastVisible(true);
    setTimeout(() => navigate("/dashboard"), 2200);
  };

  return (
    <>
      <ExamplesNavbar />
      <div className="wrapper">
        <div className="page-header" style={{ minHeight: "100vh", paddingTop: "80px", paddingBottom: "100px" }}>
          <div className="squares square1" />
          <div className="squares square2" />
          <div className="squares square3" />

          <Container style={{ paddingBottom: "40px" }}>
            <Row className="justify-content-center">
              <Col lg="7" md="9">

                {/* Page header */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ textAlign: "center", marginBottom: "2rem" }}
                >
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(0,200,100,0.12)", border: "2px solid rgba(0,200,100,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                    <i className="tim-icons icon-heart-2" style={{ color: SS_GREEN, fontSize: "2rem" }} />
                  </div>
                  <h2 style={{ fontWeight: 800, marginBottom: "0.5rem" }}>Grounding Exercises</h2>
                  <p className="text-muted" style={{ fontSize: "0.95rem", maxWidth: 420, margin: "0 auto" }}>
                    You logged an urge — that took courage. Choose a technique below.
                  </p>
                </motion.div>

                {/* Tab bar */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.08 }}
                >
                  <TabBar active={activeTab} onChange={setActiveTab} />
                </motion.div>

                {/* Tab content */}
                <AnimatePresence mode="wait">
                  {/* ── Tab: Strand Flow canvas ── */}
                  {activeTab === "canvas" && (
                    <motion.div
                      key="canvas"
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{   opacity: 0, x: 16 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Card style={{ borderRadius: "8px", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", marginBottom: "20px", border: "1px solid rgba(0,200,100,0.15)", overflow: "hidden" }}>
                        <CardBody style={{ padding: "1.5rem 1.75rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: SS_GREEN }} />
                            <h6 style={{ fontWeight: 700, letterSpacing: "0.08em", fontSize: "0.75rem", textTransform: "uppercase", opacity: 0.55, margin: 0 }}>
                              Fidget Canvas — Sensory Substitute
                            </h6>
                          </div>
                          <p className="text-muted" style={{ fontSize: "0.85rem", marginBottom: "1rem" }}>
                            Trace the glowing loop. Your hands stay busy, your mind stays present. 60 seconds earns a mindfulness badge.
                          </p>
                          <FidgetCanvas onSessionComplete={handleSessionComplete} />
                          {sessionLogged && (
                            <motion.p
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              style={{ fontSize: "0.82rem", color: SS_GREEN, marginTop: "0.75rem", marginBottom: 0 }}
                            >
                              <i className="tim-icons icon-check-2" style={{ marginRight: 5 }} />
                              Logged to your reflections.
                            </motion.p>
                          )}
                        </CardBody>
                      </Card>
                    </motion.div>
                  )}

                  {/* ── Tab: 5-4-3-2-1 Challenge ── */}
                  {activeTab === "5-4-3-2-1" && (
                    <motion.div
                      key="sensory"
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{   opacity: 0, x: 16 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Card style={{ borderRadius: "8px", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", marginBottom: "20px", border: "1px solid rgba(0,200,100,0.15)" }}>
                        <CardBody style={{ padding: "1.5rem 1.75rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: SS_GREEN }} />
                            <h6 style={{ fontWeight: 700, letterSpacing: "0.08em", fontSize: "0.75rem", textTransform: "uppercase", opacity: 0.55, margin: 0 }}>
                              5-4-3-2-1 Sensory Challenge
                            </h6>
                          </div>
                          <p className="text-muted" style={{ fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                            Anchor yourself to the present moment using your five senses.
                          </p>
                          <SensoryChallenge onComplete={handleSensoryComplete} />
                        </CardBody>
                      </Card>
                    </motion.div>
                  )}

                  {/* ── Tab: Other techniques ── */}
                  {activeTab === "exercises" && (
                    <motion.div
                      key="exercises"
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{   opacity: 0, x: 16 }}
                      transition={{ duration: 0.25 }}
                    >
                      {EXERCISES.map((ex, i) => (
                        <ExerciseCard key={ex.id} exercise={ex} index={i} />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* "I'm Grounded" CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  style={{ textAlign: "center", marginBottom: "2rem" }}
                >
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} style={{ display: "inline-block" }}>
                    <Button
                      color="primary"
                      size="lg"
                      onClick={handleGrounded}
                      style={{ borderRadius: "8px", fontWeight: 700, letterSpacing: "0.05em", padding: "0.8rem 2.5rem", boxShadow: "0 6px 24px rgba(0,200,100,0.35)", fontSize: "1rem" }}
                    >
                      <i className="tim-icons icon-check-2" style={{ marginRight: 8 }} />
                      I'm Grounded
                    </Button>
                  </motion.div>
                  <p className="text-muted" style={{ fontSize: "0.8rem", marginTop: "0.6rem" }}>
                    Returns you to the Dashboard
                  </p>
                </motion.div>

                {/* Back link */}
                <div style={{ textAlign: "center", marginTop: "0.5rem", paddingBottom: "3rem" }}>
                  <Button color="primary" outline onClick={() => navigate("/dashboard")} style={{ borderRadius: "6px", fontWeight: 600 }}>
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

      <SuccessToast message={toastMessage} visible={toastVisible} onDismiss={() => setToastVisible(false)} />
    </>
  );
};

export default GroundingPage;
