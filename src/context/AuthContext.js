/**
 * src/context/AuthContext.js
 *
 * Provides the current Firebase user to the entire component tree.
 *
 * Usage:
 *   const { currentUser, loading } = useAuth();
 *
 * `currentUser` is null when logged out, or a Firebase User object when logged in.
 * `loading` is true during the initial auth state check — use it to avoid
 * rendering protected routes before Firebase has resolved the session.
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "firebaseConfig";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscribe function — clean it up on unmount
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook — call this inside any component to access auth state.
 * Throws if used outside of <AuthProvider>.
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
};

export default AuthContext;
