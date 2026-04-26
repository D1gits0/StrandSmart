/**
 * src/hooks/useReflections.js
 *
 * Reads and writes to the user's reflections sub-collection.
 *
 * Firestore structure:
 *   users/{uid}/reflections/{autoId} → {
 *     text:        string,
 *     savedAt:     Timestamp,
 *     urgeLogged:  boolean   // true when saved alongside a urge log
 *   }
 *
 * Returns:
 *   saveReflection(text, urgeLogged?) — writes a new entry
 *   reflections                       — last 5, newest first (live)
 *   reflectionsLoading                — true during initial load
 *   reflectionsError                  — error string or null
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

const useReflections = () => {
  const { currentUser } = useAuth();
  const [reflections,        setReflections]        = useState([]);
  const [reflectionsLoading, setReflectionsLoading] = useState(true);
  const [reflectionsError,   setReflectionsError]   = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const ref = collection(db, "users", currentUser.uid, "reflections");
    const q   = query(ref, orderBy("savedAt", "desc"), limit(5));

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setReflections(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
            savedAt: d.data().savedAt?.toDate?.() ?? null,
          }))
        );
        setReflectionsLoading(false);
      },
      (err) => {
        console.error("reflections snapshot error:", err);
        setReflectionsError("Could not load reflections.");
        setReflectionsLoading(false);
      }
    );

    return unsubscribe;
  }, [currentUser]);

  /**
   * @param {string}  text
   * @param {boolean} [urgeLogged=false]
   */
  const saveReflection = async (text, urgeLogged = false) => {
    if (!currentUser) throw new Error("Not authenticated");
    const ref = collection(db, "users", currentUser.uid, "reflections");
    return addDoc(ref, {
      text:       text.trim(),
      savedAt:    serverTimestamp(),
      urgeLogged,
    });
  };

  return { saveReflection, reflections, reflectionsLoading, reflectionsError };
};

export default useReflections;
