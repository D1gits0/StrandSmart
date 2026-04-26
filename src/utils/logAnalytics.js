/**
 * src/utils/logAnalytics.js
 *
 * Pure helper functions that transform a recentLogs array into
 * chart-ready data structures. No React, no Firebase — easy to test.
 *
 * Input shape (each log):
 *   { id: string, loggedAt: Date | null, note: string }
 */

const DAY_NAMES   = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOUR_LABELS = Array.from({ length: 24 }, (_, h) => {
  if (h === 0)  return "12am";
  if (h === 12) return "12pm";
  return h < 12 ? `${h}am` : `${h - 12}pm`;
});

/**
 * Group logs by hour of day (0–23).
 * Returns 24 entries, one per hour, with a count.
 *
 * @param {Array} logs
 * @returns {{ hour: string, count: number }[]}
 */
export const byHourOfDay = (logs) => {
  const counts = Array(24).fill(0);
  logs.forEach(({ loggedAt }) => {
    if (loggedAt instanceof Date) counts[loggedAt.getHours()]++;
  });
  return counts.map((count, h) => ({ hour: HOUR_LABELS[h], count }));
};

/**
 * Group logs by day of week (Sun–Sat).
 * Returns 7 entries.
 *
 * @param {Array} logs
 * @returns {{ day: string, count: number }[]}
 */
export const byDayOfWeek = (logs) => {
  const counts = Array(7).fill(0);
  logs.forEach(({ loggedAt }) => {
    if (loggedAt instanceof Date) counts[loggedAt.getDay()]++;
  });
  return counts.map((count, d) => ({ day: DAY_NAMES[d], count }));
};

/**
 * Build a 7-day rolling trend (today and the 6 days before).
 * Returns 7 entries newest-last so the line chart reads left→right.
 *
 * @param {Array} logs
 * @returns {{ date: string, count: number }[]}
 */
export const last7DaysTrend = (logs) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (6 - i));          // oldest first
    const next = new Date(day);
    next.setDate(day.getDate() + 1);

    const count = logs.filter(({ loggedAt }) => {
      if (!(loggedAt instanceof Date)) return false;
      return loggedAt >= day && loggedAt < next;
    }).length;

    return {
      date: day.toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" }),
      count,
    };
  });
};

/**
 * Calculate the "mindful streak" — time since the most recent log.
 *
 * @param {Array} logs  — sorted newest-first
 * @returns {{ value: number, unit: "minutes" | "hours" | "days", label: string }}
 */
export const mindfulStreak = (logs) => {
  const latest = logs.find(({ loggedAt }) => loggedAt instanceof Date);
  if (!latest) {
    return { value: null, unit: null, label: "No urges logged yet — keep it up!" };
  }

  const diffMs      = Date.now() - latest.loggedAt.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);
  const diffHours   = Math.floor(diffMs / 3_600_000);
  const diffDays    = Math.floor(diffMs / 86_400_000);

  if (diffDays >= 1) {
    return {
      value: diffDays,
      unit:  "days",
      label: `You have been mindful for ${diffDays} ${diffDays === 1 ? "day" : "days"}.`,
    };
  }
  if (diffHours >= 1) {
    return {
      value: diffHours,
      unit:  "hours",
      label: `You have been mindful for ${diffHours} ${diffHours === 1 ? "hour" : "hours"}.`,
    };
  }
  return {
    value: diffMinutes,
    unit:  "minutes",
    label: diffMinutes <= 1
      ? "You just logged an urge — you're aware, and that matters."
      : `You have been mindful for ${diffMinutes} minutes.`,
  };
};
