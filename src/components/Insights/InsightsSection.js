/**
 * src/components/Insights/InsightsSection.js
 *
 * Renders the full Insights block on the Dashboard:
 *   1. Safe Streak card
 *   2. Hourly distribution bar chart
 *   3. 7-day trend line chart
 *
 * Brand colours:
 *   ss-green  #00c864   (primary accent)
 *   ss-forest #00a050   (darker green for gradients / second series)
 */

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Row, Col } from "reactstrap";
import {
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  byHourOfDay,
  last7DaysTrend,
  mindfulStreak,
} from "utils/logAnalytics";

// ── Brand palette ──────────────────────────────────────────────────────────────
const SS_GREEN  = "#00c864";
const SS_FOREST = "#00a050";
const AXIS_COLOR   = "rgba(255,255,255,0.3)";
const GRID_COLOR   = "rgba(255,255,255,0.06)";
const TOOLTIP_STYLE = {
  backgroundColor: "#1a1a2e",
  border: "1px solid rgba(0,200,100,0.25)",
  borderRadius: 6,
  color: "#fff",
  fontSize: "0.82rem",
};

// ── Shared chart props ─────────────────────────────────────────────────────────
const sharedMargin = { top: 8, right: 8, left: -20, bottom: 0 };

const SectionLabel = ({ children }) => (
  <h6
    style={{
      fontWeight: 700,
      letterSpacing: "0.08em",
      fontSize: "0.72rem",
      textTransform: "uppercase",
      opacity: 0.5,
      marginBottom: "1rem",
    }}
  >
    {children}
  </h6>
);

// ── Safe Streak card ───────────────────────────────────────────────────────────
const StreakCard = ({ streak }) => {
  const hasStreak = streak.value !== null;

  return (
    <Card
      style={{
        borderRadius: "8px",
        boxShadow: hasStreak
          ? "0 4px 20px rgba(0,200,100,0.18)"
          : "0 4px 16px rgba(0,0,0,0.35)",
        border: hasStreak ? "1px solid rgba(0,200,100,0.22)" : "none",
        marginBottom: "1.5rem",
      }}
    >
      <CardBody style={{ padding: "1.5rem 2rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "rgba(0,200,100,0.12)",
            border: "2px solid rgba(0,200,100,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {hasStreak ? (
            <span style={{ fontSize: "1.5rem" }}>🌿</span>
          ) : (
            <i className="tim-icons icon-heart-2" style={{ color: SS_GREEN, fontSize: "1.3rem" }} />
          )}
        </div>
        <div>
          <SectionLabel>Safe Streak</SectionLabel>
          <p style={{ fontWeight: 600, fontSize: "1rem", marginBottom: 0, lineHeight: 1.4 }}>
            {streak.label}
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────
const InsightsSection = ({ logs, logsLoading }) => {
  const hourData  = useMemo(() => byHourOfDay(logs),      [logs]);
  const trendData = useMemo(() => last7DaysTrend(logs),   [logs]);
  const streak    = useMemo(() => mindfulStreak(logs),    [logs]);

  // Only show hours that have at least one log, plus neighbours, to keep chart readable
  // For small datasets show all 24; recharts handles it fine
  const hasData = logs.length > 0;

  if (logsLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {/* ── Safe Streak ── */}
      <StreakCard streak={streak} />

      {/* ── Charts — only render once there's data ── */}
      {hasData && (
        <Card
          style={{
            borderRadius: "8px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
            marginBottom: "1.5rem",
          }}
        >
          <CardBody style={{ padding: "1.5rem 2rem" }}>
            <SectionLabel>Insights</SectionLabel>

            <Row>
              {/* Hourly distribution */}
              <Col md="6" style={{ marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.82rem", opacity: 0.6, marginBottom: "0.75rem" }}>
                  Urges by hour of day
                </p>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={hourData} margin={sharedMargin} barSize={6}>
                    <CartesianGrid vertical={false} stroke={GRID_COLOR} />
                    <XAxis
                      dataKey="hour"
                      tick={{ fill: AXIS_COLOR, fontSize: 9 }}
                      tickLine={false}
                      axisLine={false}
                      // Show every 3rd label to avoid crowding
                      tickFormatter={(v, i) => (i % 3 === 0 ? v : "")}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: AXIS_COLOR, fontSize: 9 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={TOOLTIP_STYLE}
                      cursor={{ fill: "rgba(0,200,100,0.06)" }}
                      formatter={(v) => [v, "urges"]}
                    />
                    <Bar
                      dataKey="count"
                      fill={SS_GREEN}
                      radius={[3, 3, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Col>

              {/* 7-day trend */}
              <Col md="6" style={{ marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.82rem", opacity: 0.6, marginBottom: "0.75rem" }}>
                  Urges over the last 7 days
                </p>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={trendData} margin={sharedMargin}>
                    <CartesianGrid stroke={GRID_COLOR} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: AXIS_COLOR, fontSize: 9 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => v.split(",")[0]}   // "Mon" only
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: AXIS_COLOR, fontSize: 9 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={TOOLTIP_STYLE}
                      formatter={(v) => [v, "urges"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke={SS_GREEN}
                      strokeWidth={2.5}
                      dot={{ fill: SS_FOREST, r: 3, strokeWidth: 0 }}
                      activeDot={{ fill: SS_GREEN, r: 5, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Col>
            </Row>
          </CardBody>
        </Card>
      )}

      {/* Empty state — encourage first log */}
      {!hasData && (
        <Card
          style={{
            borderRadius: "8px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
            marginBottom: "1.5rem",
          }}
        >
          <CardBody style={{ padding: "1.5rem 2rem", textAlign: "center" }}>
            <SectionLabel>Insights</SectionLabel>
            <p className="text-muted" style={{ fontSize: "0.88rem", marginBottom: 0 }}>
              Charts will appear here after your first urge log.
            </p>
          </CardBody>
        </Card>
      )}
    </motion.div>
  );
};

export default InsightsSection;
