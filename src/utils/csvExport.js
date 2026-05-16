/**
 * src/utils/csvExport.js
 *
 * Pure utility for generating CSV exports of urge log data.
 * Kept separate from SettingsPage.js so it can be unit-tested
 * without importing Firebase.
 *
 * Requirements: 15.3
 */

/**
 * generateCSV — converts an array of log objects to a CSV string.
 *
 * Each log should have:
 *   loggedAt  — Date object or Firestore Timestamp (with .toDate())
 *   intensity — number or null/undefined
 *   note      — string or null/undefined
 *
 * @param {Array} logs
 * @returns {string} CSV string with header row
 */
export function generateCSV(logs) {
  const header = 'timestamp,intensity,note';
  const rows = logs.map((log) => {
    const ts = log.loggedAt
      ? (log.loggedAt.toDate
          ? log.loggedAt.toDate().toISOString()
          : new Date(log.loggedAt).toISOString())
      : '';
    const intensity = log.intensity != null ? log.intensity : '';
    const note = log.note
      ? '"' + String(log.note).replace(/"/g, '""') + '"'
      : '""';
    return `${ts},${intensity},${note}`;
  });
  return [header, ...rows].join('\n');
}

/**
 * triggerCSVDownload — triggers a browser file download for a CSV string.
 *
 * @param {string} csvString
 */
export function triggerCSVDownload(csvString) {
  const today    = new Date().toISOString().slice(0, 10);
  const filename = `strandsmart-logs-${today}.csv`;
  const blob     = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url      = URL.createObjectURL(blob);
  const a        = document.createElement('a');
  a.href         = url;
  a.download     = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}