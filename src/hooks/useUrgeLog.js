/**
 * src/hooks/useUrgeLog.js
 *
 * Handles reading and writing urge logs for the current user.
 *
 * Firestore structure:
 *   users/{uid}/logs/{autoId}  →  { loggedAt: Timestamp, note: string }
 *
 * Returns:
 *   logUrge(note?)  — writes a new log entry, returns the new doc ref
 *   recentLogs      — last 10 entries, newest first (live-updating)
 *   logsLoading     — true while the initial snapshot loads
 *   logsError       — any Firestore error string, or null
 */

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "firebaseConfig";
import { useAuth } from "context/AuthContext";

const useUrgeLog = () => {
  const { currentUser } = useAuth();
  const [recentLogs,  setRecentLogs]  = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logsError,   setLogsError]   = useState(null);

  // Live listener — updates whenever a new log is written
  useEffect(() => {
    if (!currentUser) return;

    const logsRef = collection(db, "users", currentUser.uid, "logs");
    const q = query(logsRef, orderBy("loggedAt", "desc"), limit(10));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const entries = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          // Convert Firestore Timestamp → JS Date for easy formatting
          loggedAt: d.data().loggedAt?.toDate?.() ?? null,
        }));
        setRecentLogs(entries);
        setLogsLoading(false);
      },
      (err) => {
        console.error("Firestore snapshot error:", err);
        setLogsError("Could not load logs. Please refresh.");
        setLogsLoading(false);
      }
    );

    return unsubscribe;
  }, [currentUser]);

  /**
   * Write a new urge log entry.
   * @param {string} [note=""] — optional free-text note
   * @returns {Promise<DocumentReference>}
   */
  const logUrge = async (note = "") => {
    if (!currentUser) throw new Error("Not authenticated");
    const logsRef = collection(db, "users", currentUser.uid, "logs");
    return addDoc(logsRef, {
      loggedAt: serverTimestamp(),
      note,
    });
  };

  return { logUrge, recentLogs, logsLoading, logsError };
};

export default useUrgeLog;
