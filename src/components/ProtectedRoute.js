/**
 * src/components/ProtectedRoute.js
 *
 * Wraps any route that requires authentication.
 * - While Firebase resolves the session, renders nothing (avoids flash).
 * - If the user is not logged in, redirects to /login-page.
 * - If the user is logged in, renders the child route normally.
 *
 * Usage in router:
 *   <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 */

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // Don't render anything until Firebase has resolved the auth state.
  // This prevents a logged-in user from being briefly redirected to login.
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1e1e2e",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            border: "4px solid rgba(0,200,100,0.2)",
            borderTop: "4px solid #00c864",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login-page" replace />;
  }

  return children;
};

export default ProtectedRoute;
