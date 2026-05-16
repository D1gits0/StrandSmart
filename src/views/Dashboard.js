import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { Container, Row, Col, Button } from "reactstrap";
import { auth, db }       from "firebaseConfig";
import { useAuth }        from "context/AuthContext";
import { usePrivacy }     from "context/PrivacyContext";
import useUrgeLog         from "hooks/useUrgeLog";
import useDetection       from "hooks/useDetection";
import { mindfulStreak }  from "utils/logAnalytics";
import CVStatusCard       from "components/CVStatusCard/CVStatusCard";
import UrgeTracker        from "components/UrgeTracker/UrgeTracker";
import InsightsSection    from "components/Insights/InsightsSection";
import ReflectionHistory  from "components/ReflectionHistory/ReflectionHistory";
import LiveSupportFeed    from "components/LiveSupportFeed/LiveSupportFeed";
import FloatingActionButton from "components/FAB/FloatingActionButton";
import ExamplesNavbar     from "components/Navbars/ExamplesNavbar.js";
import Footer             from "components/Footer/Footer.js";
import OnboardingModal    from "components/OnboardingModal/OnboardingModal";

// ── Shared glassmorphism card style ───────────────────────────────────────────
export const glassCard = {
  background:    "rgba(13, 43, 26, 0.7)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border:        "1px solid rgba(0, 200, 100, 0.15)",
  borderRadius:  "10px",
  boxShadow:     "0 4px 24px rgba(0,0,0,0.4)",
  marginBottom:  "1.25rem",
  transition:    "box-shadow 0.2s ease, border-color 0.2s ease",
};

// Hover variant — applied via onMouseEnter/Leave
const glassCardHover = {
  boxShadow:   "0 6px 32px rgba(0,200,100,0.12), 0 4px 24px rgba(0,0,0,0.4)",
  borderColor: "rgba(0,200,100,0.28)",
};

// ── Section label ─────────────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <h6 style={{
    fontWeight: 700, letterSpacing: "0.08em", fontSize: "0.72rem",
    textTransform: "uppercase", opacity: 0.45, marginBottom: "1rem",
  }}>
    {children}
  </h6>
);

// ── Glass card wrapper ────────────────────────────────────────────────────────
const GlassCard = ({ children, style = {}, hover = true, padding = "1.5rem 1.75rem" }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        ...glassCard,
        ...(hover && hovered ? glassCardHover : {}),
        ...style,
      }}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
    >
      <div style={{ padding }}>{children}</div>
    </div>
  );
};

// ── Format log date ───────────────────────────────────────────────────────────
const formatLogDate = (date) => {
  if (!date) return "—";
  return date.toLocaleString("en-US", {
    month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit",
  });
};

// ── Streak badge ──────────────────────────────────────────────────────────────
const StreakBadge = ({ logs }) => {
  const streak = mindfulStreak(logs);
  const has    = streak.value !== null;
  // Warm empty state message — never contains "no data" (Requirement 9.3, 9.4)
  const emptyLabel = "Keep going — your streak starts with your next mindful moment.";
  return (
    <GlassCard style={{ border: has ? "1px solid rgba(0,200,100,0.3)" : glassCard.border }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
          background: "rgba(0,200,100,0.1)", border: "2px solid rgba(0,200,100,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: "1.4rem" }}>{has ? "🌿" : "💚"}</span>
        </div>
        <div>
          <SectionLabel>Safe Streak</SectionLabel>
          <p style={{ fontWeight: 600, fontSize: "0.92rem", marginBottom: 0, lineHeight: 1.4 }}>
            {has ? streak.label : emptyLabel}
          </p>
        </div>
      </div>
    </GlassCard>
  );
};

// ── Recent urge log list ──────────────────────────────────────────────────────
const RecentLogs = ({ logs, loading }) => (
  <GlassCard>
    <SectionLabel>Recent Urge Logs</SectionLabel>
    {loading && <p className="text-muted" style={{ fontSize: "0.85rem" }}>Loading…</p>}
    {!loading && logs.length === 0 && (
      <p className="text-muted" style={{ fontSize: "0.85rem", marginBottom: 0 }}>
        Your urge patterns will appear here after a few logs. You're already doing the hard part by showing up.
      </p>
    )}
    {!loading && logs.length > 0 && (
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {logs.slice(0, 10).map((log, i) => (
          <li key={log.id} style={{
            display: "flex", alignItems: "flex-start", gap: "0.75rem",
            padding: "0.6rem 0",
            borderBottom: i < Math.min(logs.length, 10) - 1
              ? "1px solid rgba(255,255,255,0.05)" : "none",
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00c864", flexShrink: 0, marginTop: "0.4rem" }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>{formatLogDate(log.loggedAt)}</span>
              {log.note && (
                <p style={{ fontSize: "0.8rem", opacity: 0.45, fontStyle: "italic", marginBottom: 0, marginTop: "0.15rem" }}>
                  {log.note}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    )}
  </GlassCard>
);

// ── Quick-action cards ────────────────────────────────────────────────────────
const QuickActions = ({ navigate }) => (
  <Row style={{ margin: 0 }}>
    {[
      { icon: "tim-icons icon-spaceship", title: "Grounding", body: "Ride out an urge right now.", href: "/grounding", accent: true },
      { icon: "tim-icons icon-book-bookmark", title: "Reflections", body: "Write and review reflections.", href: "/reflections", accent: false },
    ].map(({ icon, title, body, href, accent }) => (
      <Col xs="6" key={title} style={{ paddingLeft: "0.4rem", paddingRight: "0.4rem" }}>
        <div
          onClick={() => navigate(href)}
          style={{
            ...glassCard,
            cursor: "pointer",
            border: accent ? "1px solid rgba(0,200,100,0.28)" : glassCard.border,
            boxShadow: accent ? "0 4px 20px rgba(0,200,100,0.12)" : glassCard.boxShadow,
          }}
        >
          <div style={{ padding: "1.1rem" }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", marginBottom: "0.7rem",
              background: accent ? "rgba(0,200,100,0.12)" : "rgba(255,255,255,0.05)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <i className={icon} style={{ color: accent ? "#00c864" : "rgba(255,255,255,0.5)", fontSize: "1rem" }} />
            </div>
            <p style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: "0.2rem" }}>{title}</p>
            <p className="text-muted" style={{ fontSize: "0.78rem", marginBottom: 0 }}>{body}</p>
          </div>
        </div>
      </Col>
    ))}
  </Row>
);

// ── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { currentUser }             = useAuth();
  const { discreetMode, cvEnabled } = usePrivacy();
  const { recentLogs, logsLoading } = useUrgeLog();
  const navigate                    = useNavigate();

  // CV detection connection state (task 14.1)
  const { isConnected } = useDetection({ enabled: cvEnabled, currentUser });

  const [showOnboarding, setShowOnboarding] = useState(false);

  // Widget visibility preferences — default all true (task 14.3)
  const [widgetPreferences, setWidgetPreferences] = useState({
    urgeTracker:       true,
    insightsChart:     true,
    recentLogs:        true,
    safeStreak:        true,
    dailyInspiration:  true,
    recentReflections: true,
  });

  // Check whether the user has completed onboarding; show modal if not
  // Also fetch widgetPreferences from Firestore (task 14.3)
  useEffect(() => {
    if (!currentUser) return;
    const checkOnboarding = async () => {
      try {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        if (!snap.exists() || snap.data()?.onboardingComplete !== true) {
          setShowOnboarding(true);
        }
        // Load widget preferences from Firestore if present
        const prefs = snap.data()?.widgetPreferences;
        if (prefs) {
          setWidgetPreferences((prev) => ({ ...prev, ...prefs }));
        }
      } catch (err) {
        // Non-blocking — if the check fails, skip the modal rather than blocking the dashboard
        console.error("Dashboard: failed to check onboardingComplete", err);
      }
    };
    checkOnboarding();
  }, [currentUser]);

  const firstName = currentUser?.displayName?.split(" ")[0] ?? "there";

  const handleSignOut = async () => {
    try { await signOut(auth); navigate("/"); }
    catch (err) { console.error("Sign out error:", err); }
  };

  return (
    <>
      <ExamplesNavbar />

      {/*
        ── Outer shell ──────────────────────────────────────────────────────────
        min-height: 100vh keeps the forest background full-screen.
        overflow-y: auto lets the content scroll naturally.
        padding-top: 80px clears the fixed navbar.
      */}
      <div style={{
        minHeight:    "100vh",
        overflowY:    "auto",
        background:   "#0d2b1a",
        paddingTop:   "80px",
        paddingBottom: "3rem",
      }}>
        {/* Subtle radial glow behind content */}
        <div style={{
          position:   "fixed",
          inset:      0,
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,200,100,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex:     0,
        }} />

        <Container style={{ position: "relative", zIndex: 1 }}>

          {/* ── Welcome header ── */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <GlassCard padding="1.4rem 1.75rem" hover={false}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
                <div>
                  <h3 style={{ fontWeight: 800, marginBottom: "0.2rem" }}>Hey, {firstName} 👋</h3>
                  <p className="text-muted" style={{ fontSize: "0.85rem", marginBottom: 0 }}>{currentUser?.email}</p>
                </div>
                <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                  <Link to="/grounding" style={{ textDecoration: "none" }}>
                    <Button color="primary" size="sm" style={{ borderRadius: "6px", fontWeight: 600 }}>
                      <i className="tim-icons icon-spaceship" style={{ marginRight: 5 }} />
                      Grounding
                    </Button>
                  </Link>
                  <Button color="primary" outline size="sm" onClick={handleSignOut}
                    style={{ borderRadius: "6px", fontWeight: 600, whiteSpace: "nowrap" }}>
                    <i className="tim-icons icon-button-power" style={{ marginRight: 5 }} />
                    Sign Out
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* ── CV Status Card — full width, below welcome header (task 14.1) ── */}
          {/* Hidden when discreetMode is active (Requirement 17.8) */}
          {!discreetMode && (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.04 }}>
              <CVStatusCard isConnected={isConnected} />
            </motion.div>
          )}

          {/* ── 2-column grid ── */}
          <Row>

            {/* ════════════════════════════════════════════════════════════════
                LEFT COLUMN — 65%
                Tracker (sticky) + Insights charts
            ════════════════════════════════════════════════════════════════ */}
            <Col lg="8" style={{ paddingRight: "0.75rem" }}>

              {/*
                Sticky tracker wrapper.
                position: sticky + top: 90px keeps the Log Urge button
                visible as the user scrolls through charts and history.
              */}
              {widgetPreferences.urgeTracker && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.06 }}
                  style={{ position: "sticky", top: "90px", zIndex: 10 }}
                >
                  <GlassCard padding="1.5rem 1.75rem">
                    <UrgeTracker />
                  </GlassCard>
                </motion.div>
              )}

              {/* Charts — scrolls normally below the sticky tracker */}
              {widgetPreferences.insightsChart && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.14 }}
                >
                  <InsightsSection logs={recentLogs} logsLoading={logsLoading} />
                </motion.div>
              )}

              {/* Recent urge log list */}
              {widgetPreferences.recentLogs && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <RecentLogs logs={recentLogs} loading={logsLoading} />
                </motion.div>
              )}

            </Col>

            {/* ════════════════════════════════════════════════════════════════
                RIGHT COLUMN — 35%
                Streak + Reflections + Live Feed + Quick Actions
            ════════════════════════════════════════════════════════════════ */}
            <Col lg="4" style={{ paddingLeft: "0.75rem" }}>

              {/* Streak badge */}
              {widgetPreferences.safeStreak && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <StreakBadge logs={recentLogs} />
                </motion.div>
              )}

              {/* Reflection history */}
              {widgetPreferences.recentReflections && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.18 }}
                >
                  <GlassCard>
                    <ReflectionHistory />
                  </GlassCard>
                </motion.div>
              )}

              {/* Live support feed — stacked vertically in right column */}
              {widgetPreferences.dailyInspiration && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.24 }}
                >
                  <GlassCard>
                    <LiveSupportFeed />
                  </GlassCard>
                </motion.div>
              )}

              {/* Quick actions — Reflections navigation card (task 14.2) */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <QuickActions navigate={navigate} />
              </motion.div>

            </Col>
          </Row>
          {/* ── Disclaimer ── */}
          <p style={{
            textAlign:    "center",
            fontSize:     "0.72rem",
            color:        "rgba(255,255,255,0.28)",
            marginTop:    "2rem",
            marginBottom: 0,
            lineHeight:   1.6,
            padding:      "0 1rem",
          }}>
            StrandSmart is a peer-support tool. Not a substitute for professional medical advice.
          </p>

        </Container>
      </div>

      <Footer />

      {/* FAB — persists over all dashboard content */}
      <FloatingActionButton />

      {/* Onboarding modal — shown once to first-time users */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
        onDismiss={() => setShowOnboarding(false)}
      />
    </>
  );
};

export default Dashboard;
