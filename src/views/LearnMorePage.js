/**
 * src/views/LearnMorePage.js
 *
 * Public page — no auth required.
 * "The Science of Trich" — a vertical timeline explaining BFRBs,
 * the urge cycle, and how StrandSmart helps break it.
 * Uses #0d2b1a background + ss-green accents throughout.
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Container, Row, Col } from "reactstrap";
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";
import Footer         from "components/Footer/Footer.js";

const SS_GREEN  = "#00c864";
const SS_FOREST = "rgba(13, 43, 26, 0.7)";
const DISCLAIMER = "StrandSmart is a peer-support tool. Not a substitute for professional medical advice.";

// ── Timeline data ──────────────────────────────────────────────────────────────
const TIMELINE = [
  {
    id: "bfrb",
    number: "01",
    title: "What is a BFRB?",
    icon: "tim-icons icon-heart-2",
    body: `Body-Focused Repetitive Behaviors (BFRBs) are a group of conditions where
    a person repeatedly touches, pulls, picks, or bites their own body in ways that
    can cause physical damage.`,
    details: [
      { label: "Trichotillomania", desc: "Compulsive hair pulling from the scalp, eyebrows, eyelashes, or elsewhere." },
      { label: "Dermatillomania", desc: "Compulsive skin picking, also called Excoriation Disorder." },
      { label: "Onychophagia", desc: "Compulsive nail biting beyond normal habit." },
    ],
    note: "BFRBs are classified as Obsessive-Compulsive Related Disorders in the DSM-5. They are not a choice or a bad habit — they are a recognised mental health condition.",
  },
  {
    id: "prevalence",
    number: "02",
    title: "You Are Not Alone",
    icon: "tim-icons icon-single-02",
    body: `Trichotillomania affects an estimated 1–2% of the population — millions of people worldwide. It typically begins in early adolescence and affects people of all genders, though it is more commonly reported in women.`,
    stats: [
      { value: "1–2%", label: "of the global population" },
      { value: "~12", label: "average age of onset" },
      { value: "70%", label: "report significant distress" },
    ],
    note: "Many people live with trich for years before seeking help, often due to shame or not knowing effective treatments exist.",
  },
  {
    id: "cycle",
    number: "03",
    title: "The Urge Cycle",
    icon: "tim-icons icon-refresh-02",
    body: `Understanding the cycle is the first step to breaking it. Most pulling episodes follow a predictable loop:`,
    cycle: [
      { emoji: "😰", phase: "Trigger", desc: "Stress, boredom, anxiety, or a tactile sensation (a coarse hair, a bump)." },
      { emoji: "⚡", phase: "Urge", desc: "A mounting tension or itch that feels urgent and hard to ignore." },
      { emoji: "✋", phase: "Pull", desc: "The automatic or semi-conscious pulling behaviour." },
      { emoji: "😮‍💨", phase: "Relief", desc: "A brief moment of calm or satisfaction — which reinforces the loop." },
      { emoji: "😔", phase: "Shame", desc: "Guilt or distress follows, which can itself become a trigger." },
    ],
    note: "The relief phase is why trich is so persistent — the brain learns that pulling 'works' as a coping mechanism.",
  },
  {
    id: "break",
    number: "04",
    title: "How StrandSmart Helps Break the Cycle",
    icon: "tim-icons icon-spaceship",
    accent: true,
    body: `StrandSmart targets each phase of the urge cycle with specific tools:`,
    interventions: [
      { phase: "Trigger", tool: "Vibe Input", desc: "Write what's on your mind before logging an urge. Over time, patterns emerge." },
      { phase: "Urge", tool: "Urge Tracker", desc: "Logging the urge interrupts the automatic pull. Awareness is the first intervention." },
      { phase: "Pull", tool: "Fidget Canvas", desc: "The Strand Flow canvas gives your hands a sensory substitute — something to do instead." },
      { phase: "Relief", tool: "Grounding Exercises", desc: "Box breathing and body scans provide genuine nervous-system relief without pulling." },
      { phase: "Shame", tool: "Reflection History", desc: "Your logs are private, non-judgmental, and show progress over time." },
    ],
  },
  {
    id: "treatment",
    number: "05",
    title: "Evidence-Based Treatment",
    icon: "tim-icons icon-badge",
    body: `StrandSmart is a self-help companion, not a replacement for therapy. The most effective treatments for trichotillomania are:`,
    treatments: [
      {
        name: "Habit Reversal Training (HRT)",
        evidence: "Strong",
        desc: "Teaches awareness of pulling triggers and replaces the behaviour with a competing response.",
      },
      {
        name: "Comprehensive Behavioral Treatment (ComB)",
        evidence: "Strong",
        desc: "Tailors HRT to the individual's specific pulling patterns, sensory triggers, and environments.",
      },
      {
        name: "Acceptance & Commitment Therapy (ACT)",
        evidence: "Moderate",
        desc: "Reduces the shame and avoidance that maintain the cycle, building psychological flexibility.",
      },
      {
        name: "N-Acetylcysteine (NAC)",
        evidence: "Emerging",
        desc: "A supplement showing promise in clinical trials. Discuss with a psychiatrist.",
      },
    ],
    note: "Visit bfrb.org to find a therapist trained in these approaches.",
  },
];

// ── Stat pill ──────────────────────────────────────────────────────────────────
const StatPill = ({ value, label }) => (
  <div style={{
    background: "rgba(0,200,100,0.08)",
    border: "1px solid rgba(0,200,100,0.2)",
    borderRadius: "8px",
    padding: "0.75rem 1rem",
    textAlign: "center",
  }}>
    <p style={{ fontWeight: 800, fontSize: "1.4rem", color: SS_GREEN, marginBottom: "0.15rem" }}>{value}</p>
    <p style={{ fontSize: "0.75rem", opacity: 0.5, marginBottom: 0 }}>{label}</p>
  </div>
);

// ── Evidence badge ─────────────────────────────────────────────────────────────
const EvidenceBadge = ({ level }) => {
  const colors = { Strong: "#00c864", Moderate: "#88c864", Emerging: "rgba(255,255,255,0.4)" };
  return (
    <span style={{
      fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.07em",
      textTransform: "uppercase", color: colors[level] || SS_GREEN,
      background: "rgba(0,200,100,0.08)", border: `1px solid ${colors[level]}40`,
      borderRadius: "4px", padding: "0.1rem 0.45rem", marginLeft: "0.5rem",
      verticalAlign: "middle",
    }}>
      {level}
    </span>
  );
};

// ── Timeline node ──────────────────────────────────────────────────────────────
const TimelineNode = ({ item, index, isLast }) => {
  const [expanded, setExpanded] = useState(index === 0); // first node open by default

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      style={{ display: "flex", gap: "1.25rem", marginBottom: isLast ? 0 : "0" }}
    >
      {/* ── Left: number + connector line ── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
          background: item.accent ? "rgba(0,200,100,0.15)" : "rgba(13,43,26,0.8)",
          border: `2px solid ${item.accent ? SS_GREEN : "rgba(0,200,100,0.3)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: item.accent ? "0 0 16px rgba(0,200,100,0.25)" : "none",
          zIndex: 1,
        }}>
          <span style={{ fontWeight: 800, fontSize: "0.78rem", color: SS_GREEN }}>{item.number}</span>
        </div>
        {!isLast && (
          <div style={{
            width: 2, flexGrow: 1, minHeight: 32,
            background: "linear-gradient(to bottom, rgba(0,200,100,0.3), rgba(0,200,100,0.05))",
            margin: "4px 0",
          }} />
        )}
      </div>

      {/* ── Right: content card ── */}
      <div style={{
        flex: 1,
        background: SS_FOREST,
        backdropFilter: "blur(12px)",
        border: item.accent ? "1px solid rgba(0,200,100,0.3)" : "1px solid rgba(0,200,100,0.12)",
        borderRadius: "10px",
        marginBottom: "1.25rem",
        overflow: "hidden",
        boxShadow: item.accent ? "0 4px 24px rgba(0,200,100,0.1)" : "0 4px 16px rgba(0,0,0,0.35)",
        cursor: "pointer",
        transition: "border-color 0.2s ease",
      }}
        onClick={() => setExpanded((p) => !p)}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(0,200,100,0.35)"}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = item.accent ? "rgba(0,200,100,0.3)" : "rgba(0,200,100,0.12)"}
      >
        {/* Card header */}
        <div style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <i className={item.icon} style={{ color: SS_GREEN, fontSize: "1.1rem" }} />
            <h5 style={{ fontWeight: 700, marginBottom: 0, fontSize: "1rem" }}>{item.title}</h5>
          </div>
          <i className={`tim-icons ${expanded ? "icon-minimal-up" : "icon-minimal-down"}`}
            style={{ opacity: 0.35, fontSize: "0.75rem", flexShrink: 0 }} />
        </div>

        {/* Expandable body */}
        <motion.div
          initial={false}
          animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ overflow: "hidden" }}
        >
          <div style={{ padding: "0 1.5rem 1.5rem" }}>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.7, opacity: 0.82, marginBottom: "1rem" }}>
              {item.body}
            </p>

            {/* Detail list */}
            {item.details && item.details.map((d) => (
              <div key={d.label} style={{ marginBottom: "0.6rem" }}>
                <span style={{ fontWeight: 700, color: SS_GREEN, fontSize: "0.85rem" }}>{d.label}: </span>
                <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>{d.desc}</span>
              </div>
            ))}

            {/* Stats */}
            {item.stats && (
              <Row style={{ margin: "0.75rem 0" }}>
                {item.stats.map((s) => (
                  <Col xs="4" key={s.label} style={{ padding: "0 0.4rem" }}>
                    <StatPill value={s.value} label={s.label} />
                  </Col>
                ))}
              </Row>
            )}

            {/* Urge cycle */}
            {item.cycle && (
              <div style={{ marginTop: "0.5rem" }}>
                {item.cycle.map((c, i) => (
                  <div key={c.phase} style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "1.3rem", flexShrink: 0, lineHeight: 1.3 }}>{c.emoji}</span>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: "0.85rem", color: SS_GREEN, marginBottom: "0.1rem" }}>{c.phase}</p>
                      <p style={{ fontSize: "0.85rem", opacity: 0.72, marginBottom: 0 }}>{c.desc}</p>
                    </div>
                    {i < item.cycle.length - 1 && (
                      <i className="tim-icons icon-minimal-down"
                        style={{ color: "rgba(0,200,100,0.3)", fontSize: "0.7rem", marginLeft: "auto", marginTop: "0.3rem", flexShrink: 0 }} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Interventions */}
            {item.interventions && item.interventions.map((iv) => (
              <div key={iv.phase} style={{
                display: "flex", gap: "0.85rem", marginBottom: "0.75rem",
                background: "rgba(0,200,100,0.05)", borderRadius: "6px", padding: "0.65rem 0.85rem",
              }}>
                <div style={{ flexShrink: 0 }}>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, color: SS_GREEN, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.1rem" }}>{iv.phase}</p>
                  <p style={{ fontSize: "0.78rem", fontWeight: 700, marginBottom: 0 }}>{iv.tool}</p>
                </div>
                <p style={{ fontSize: "0.82rem", opacity: 0.7, marginBottom: 0, lineHeight: 1.5 }}>{iv.desc}</p>
              </div>
            ))}

            {/* Treatments */}
            {item.treatments && item.treatments.map((t) => (
              <div key={t.name} style={{ marginBottom: "0.85rem" }}>
                <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.2rem" }}>
                  {t.name}
                  <EvidenceBadge level={t.evidence} />
                </p>
                <p style={{ fontSize: "0.85rem", opacity: 0.7, marginBottom: 0 }}>{t.desc}</p>
              </div>
            ))}

            {/* Note */}
            {item.note && (
              <p style={{
                fontSize: "0.78rem", opacity: 0.45, fontStyle: "italic",
                borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0.75rem",
                marginTop: "0.75rem", marginBottom: 0,
              }}>
                {item.note}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ── Page ───────────────────────────────────────────────────────────────────────
const LearnMorePage = () => (
  <>
    <ExamplesNavbar />
    <div style={{ minHeight: "100vh", background: "#0d2b1a", paddingTop: "80px", paddingBottom: "3rem" }}>
      {/* Radial glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,200,100,0.07) 0%, transparent 70%)",
      }} />

      <Container style={{ position: "relative", zIndex: 1, maxWidth: 760 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ textAlign: "center", padding: "2rem 0 2.5rem" }}
        >
          <div style={{
            width: 64, height: 64, borderRadius: "50%", margin: "0 auto 1.25rem",
            background: "rgba(0,200,100,0.1)", border: "2px solid rgba(0,200,100,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <i className="tim-icons icon-book-bookmark" style={{ color: SS_GREEN, fontSize: "1.8rem" }} />
          </div>
          <h2 style={{ fontWeight: 800, marginBottom: "0.5rem" }}>The Science of Trich</h2>
          <p style={{ fontSize: "0.95rem", opacity: 0.6, maxWidth: 480, margin: "0 auto" }}>
            Understanding what's happening in your brain is the first step toward change.
          </p>
        </motion.div>

        {/* Timeline */}
        {TIMELINE.map((item, i) => (
          <TimelineNode
            key={item.id}
            item={item}
            index={i}
            isLast={i === TIMELINE.length - 1}
          />
        ))}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          style={{ textAlign: "center", marginTop: "2rem" }}
        >
          <Link
            to="/resources"
            style={{
              display: "inline-block",
              background: SS_GREEN,
              color: "#000",
              fontWeight: 700,
              fontSize: "0.9rem",
              padding: "0.65rem 1.75rem",
              borderRadius: "6px",
              textDecoration: "none",
              boxShadow: "0 4px 16px rgba(0,200,100,0.3)",
              marginRight: "0.75rem",
            }}
          >
            View Resources →
          </Link>
          <Link
            to="/register-page"
            style={{
              display: "inline-block",
              border: "1px solid rgba(0,200,100,0.35)",
              color: SS_GREEN,
              fontWeight: 600,
              fontSize: "0.9rem",
              padding: "0.65rem 1.75rem",
              borderRadius: "6px",
              textDecoration: "none",
            }}
          >
            Start Tracking
          </Link>
        </motion.div>

        {/* Disclaimer */}
        <p style={{
          textAlign: "center", fontSize: "0.72rem",
          color: "rgba(255,255,255,0.28)", marginTop: "2rem",
        }}>
          {DISCLAIMER}
        </p>
      </Container>
    </div>
    <Footer />
  </>
);

export default LearnMorePage;
