import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { motion } from "framer-motion";
import {
  Container, Row, Col,
  Card, CardBody, CardTitle,
  Button,
} from "reactstrap";
import { auth } from "firebaseConfig";
import { useAuth }          from "context/AuthContext";
import useUrgeLog           from "hooks/useUrgeLog";
import useReflections       from "hooks/useReflections";
import VibeInput            from "components/VibeInput/VibeInput";
import UrgeTracker          from "components/UrgeTracker/UrgeTracker";
import InsightsSection      from "components/Insights/InsightsSection";
import ReflectionHistory    from "components/ReflectionHistory/ReflectionHistory";
import ExamplesNavbar       from "components/Navbars/ExamplesNavbar.js";
import Footer               from "components/Footer/Footer.js";

const formatLogDate = (date) => {
  if (!date) return "—";
  return date.toLocaleString("en-US", {
    month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit",
  });
};

const Dashboard = () => {
  const { currentUser }             = useAuth();
  const { recentLogs, logsLoading } = useUrgeLog();
  const { saveReflection }          = useReflections();
  const navigate                    = useNavigate();

  // ── Vibe / reflection state ──────────────────────────────────────────────────
  const [vibe,        setVibe]        = useState("");
  const [noteSaving,  setNoteSaving]  = useState(false);
  const [noteSaved,   setNoteSaved]   = useState(false);

  const firstName = currentUser?.displayName?.split(" ")[0] ?? "there";

  const handleSignOut = async () => {
    try { await signOut(auth); navigate("/"); }
    catch (err) { console.error("Sign out error:", err); }
  };

  // Called by VibeInput's "Save Note" button — standalone reflection
  const handleSaveNote = async () => {
    if (!vibe.trim()) return;
    setNoteSaving(true);
    try {
      await saveReflection(vibe, false);
      setVibe("");
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 3000);
    } catch (err) {
      console.error("saveReflection error:", err);
    } finally {
      setNoteSaving(false);
    }
  };

  // Called by UrgeTracker after a successful urge log
  // If there's text in the vibe input, save it as a reflection tagged urgeLogged=true
  const handleAfterUrgeLog = async () => {
    if (!vibe.trim()) return;
    try {
      await saveReflection(vibe, true);
    } catch (err) {
      console.error("saveReflection (urge) error:", err);
    } finally {
      setVibe("");
    }
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
              <Col lg="8">

                {/* ── Welcome header ── */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card style={{ borderRadius: "8px", boxShadow: "0 8px 32px rgba(0,0,0,0.45)", marginBottom: "1.5rem" }}>
                    <CardBody style={{ padding: "1.75rem 2rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem" }}>
                        <div>
                          <CardTitle tag="h3" style={{ fontWeight: 800, marginBottom: "0.25rem" }}>
                            Hey, {firstName} 👋
                          </CardTitle>
                          <p className="text-muted" style={{ fontSize: "0.88rem", marginBottom: 0 }}>
                            {currentUser?.email}
                          </p>
                        </div>
                        <Button
                          color="primary" outline size="sm"
                          onClick={handleSignOut}
                          style={{ borderRadius: "6px", fontWeight: 600, whiteSpace: "nowrap" }}
                        >
                          <i className="tim-icons icon-button-power" style={{ marginRight: 5 }} />
                          Sign Out
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>

                {/* ── Vibe input + UrgeTracker ── */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.08 }}
                >
                  <Card style={{ borderRadius: "8px", boxShadow: "0 8px 32px rgba(0,0,0,0.45)", marginBottom: "1.5rem" }}>
                    <CardBody style={{ padding: "1.75rem 2rem" }}>
                      {/* "What's on your mind?" lives above the tracker button */}
                      <VibeInput
                        value={vibe}
                        onChange={setVibe}
                        onSaveNote={handleSaveNote}
                        saving={noteSaving}
                        saved={noteSaved}
                      />
                      <UrgeTracker
                        note={vibe}
                        onAfterLog={handleAfterUrgeLog}
                      />
                    </CardBody>
                  </Card>
                </motion.div>

                {/* ── Insights: streak + charts ── */}
                <InsightsSection logs={recentLogs} logsLoading={logsLoading} />

                {/* ── Reflection history ── */}
                <ReflectionHistory />

                {/* ── Recent urge log list ── */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <Card style={{ borderRadius: "8px", boxShadow: "0 4px 16px rgba(0,0,0,0.35)", marginBottom: "1.5rem" }}>
                    <CardBody style={{ padding: "1.5rem 2rem" }}>
                      <h6 style={{ fontWeight: 700, letterSpacing: "0.08em", fontSize: "0.75rem", textTransform: "uppercase", opacity: 0.55, marginBottom: "1rem" }}>
                        Recent Urge Logs
                      </h6>

                      {logsLoading && <p className="text-muted" style={{ fontSize: "0.88rem" }}>Loading…</p>}

                      {!logsLoading && recentLogs.length === 0 && (
                        <p className="text-muted" style={{ fontSize: "0.88rem", marginBottom: 0 }}>
                          No urges logged yet. Hit the button above when you feel one coming on.
                        </p>
                      )}

                      {!logsLoading && recentLogs.length > 0 && (
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                          {recentLogs.slice(0, 10).map((log, i) => (
                            <li
                              key={log.id}
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "0.75rem",
                                padding: "0.65rem 0",
                                borderBottom: i < Math.min(recentLogs.length, 10) - 1
                                  ? "1px solid rgba(255,255,255,0.06)"
                                  : "none",
                              }}
                            >
                              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00c864", flexShrink: 0, marginTop: "0.35rem" }} />
                              <div style={{ flex: 1 }}>
                                <span style={{ fontSize: "0.88rem", opacity: 0.8 }}>
                                  {formatLogDate(log.loggedAt)}
                                </span>
                                {log.note && (
                                  <p style={{ fontSize: "0.82rem", opacity: 0.5, fontStyle: "italic", marginBottom: 0, marginTop: "0.2rem" }}>
                                    {log.note}
                                  </p>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardBody>
                  </Card>
                </motion.div>

                {/* ── Quick-action cards ── */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.28 }}
                >
                  <Row>
                    {[
                      { icon: "tim-icons icon-spaceship", title: "Grounding Exercises", body: "Techniques to help you ride out an urge in the moment.", href: "/grounding", accent: true },
                      { icon: "tim-icons icon-book-bookmark", title: "Resources", body: "Articles and guides on managing trichotillomania.", href: "/landing-page" },
                    ].map(({ icon, title, body, href, accent }) => (
                      <Col md="6" key={title}>
                        <Card
                          style={{
                            borderRadius: "8px",
                            boxShadow: accent ? "0 4px 20px rgba(0,200,100,0.2)" : "0 4px 16px rgba(0,0,0,0.35)",
                            cursor: "pointer",
                            marginBottom: "1.5rem",
                            border: accent ? "1px solid rgba(0,200,100,0.25)" : "none",
                          }}
                          onClick={() => navigate(href)}
                        >
                          <CardBody style={{ padding: "1.5rem" }}>
                            <div style={{ width: 40, height: 40, borderRadius: "50%", background: accent ? "rgba(0,200,100,0.15)" : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.85rem" }}>
                              <i className={icon} style={{ color: accent ? "#00c864" : "inherit", fontSize: "1.1rem" }} />
                            </div>
                            <CardTitle tag="h6" style={{ fontWeight: 700, marginBottom: "0.35rem" }}>{title}</CardTitle>
                            <p className="text-muted" style={{ fontSize: "0.85rem", marginBottom: 0 }}>{body}</p>
                          </CardBody>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </motion.div>

              </Col>
            </Row>
          </Container>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Dashboard;
