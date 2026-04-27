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
import { Row, Col } from "reactstrap";
import {
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  byHourOfDay,
  last7DaysTrend,
} from "utils/logAnalytics";
import { glassCard } from "views/Dashboard";

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
  <h6 style={{ fontWeight: 700, letterSpacing: "0.08em", fontSize: "0.72rem", textTransform: "uppercase", opacity: 0.5, marginBottom: "1rem" }}>
    {children}
  </h6>
);

// ── Main component ─────────────────────────────────────────────────────────────
const InsightsSection = ({ logs, logsLoading }) => {
  const hourData  = useMemo(() => byHourOfDay(logs),    [logs]);
  const trendData = useMemo(() => last7DaysTrend(logs), [logs]);
  const hasData   = logs.length > 0;

  if (logsLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {hasData && (
        <div style={{ ...glassCard, marginBottom: "1.25rem" }}>
          <div style={{ padding: "1.5rem 1.75rem" }}>
            <SectionLabel>Insights</SectionLabel>
            <Row>
              <Col md="6" style={{ marginBottom: "1.25rem" }}>
                <p style={{ fontSize: "0.8rem", opacity: 0.55, marginBottom: "0.6rem" }}>Urges by hour of day</p>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={hourData} margin={sharedMargin} barSize={5}>
                    <CartesianGrid vertical={false} stroke={GRID_COLOR} />
                    <XAxis dataKey="hour" tick={{ fill: AXIS_COLOR, fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={(v, i) => (i % 3 === 0 ? v : "")} />
                    <YAxis allowDecimals={false} tick={{ fill: AXIS_COLOR, fontSize: 9 }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(0,200,100,0.06)" }} formatter={(v) => [v, "urges"]} />
                    <Bar dataKey="count" fill={SS_GREEN} radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Col>
              <Col md="6" style={{ marginBottom: "1.25rem" }}>
                <p style={{ fontSize: "0.8rem", opacity: 0.55, marginBottom: "0.6rem" }}>Last 7 days</p>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={trendData} margin={sharedMargin}>
                    <CartesianGrid stroke={GRID_COLOR} />
                    <XAxis dataKey="date" tick={{ fill: AXIS_COLOR, fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={(v) => v.split(",")[0]} />
                    <YAxis allowDecimals={false} tick={{ fill: AXIS_COLOR, fontSize: 9 }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [v, "urges"]} />
                    <Line type="monotone" dataKey="count" stroke={SS_GREEN} strokeWidth={2.5}
                      dot={{ fill: SS_FOREST, r: 3, strokeWidth: 0 }}
                      activeDot={{ fill: SS_GREEN, r: 5, strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Col>
            </Row>
          </div>
        </div>
      )}

      {!hasData && (
        <div style={{ ...glassCard, marginBottom: "1.25rem" }}>
          <div style={{ padding: "1.5rem 1.75rem", textAlign: "center" }}>
            <SectionLabel>Insights</SectionLabel>
            <p className="text-muted" style={{ fontSize: "0.85rem", marginBottom: 0 }}>
              Charts will appear after your first urge log.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default InsightsSection;
