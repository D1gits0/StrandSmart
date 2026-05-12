import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

import "assets/css/nucleo-icons.css";
import "assets/scss/blk-design-system-react.scss";
import "assets/demo/demo.css";
import "assets/css/strandsmart-overrides.css";

import { AuthProvider }    from "context/AuthContext";
import { PrivacyProvider } from "context/PrivacyContext";
import ProtectedRoute      from "components/ProtectedRoute";
import DetectionOverlay    from "components/DetectionOverlay/DetectionOverlay";

import Index        from "views/Index.js";
import Dashboard    from "views/Dashboard.js";
import GroundingPage from "views/GroundingPage.js";
import ResourcesPage from "views/ResourcesPage.js";
import LearnMorePage from "views/LearnMorePage.js";
import AboutPage    from "views/examples/AboutPage.js";
import LandingPage  from "views/examples/LandingPage.js";
import RegisterPage from "views/examples/RegisterPage.js";
import LoginPage    from "views/examples/LoginPage.js";
import ProfilePage  from "views/examples/ProfilePage.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <AuthProvider>
      <PrivacyProvider>
      {/* CV detection overlay — renders nothing when backend is offline */}
      <DetectionOverlay />
      <Routes>
        {/* Public routes */}
        <Route path="/"              element={<Index />} />
        <Route path="/components"    element={<Index />} />
        <Route path="/landing-page"  element={<LandingPage />} />
        <Route path="/resources"     element={<ResourcesPage />} />
        <Route path="/learn-more"    element={<LearnMorePage />} />
        <Route path="/register-page" element={<RegisterPage />} />
        <Route path="/login-page"    element={<LoginPage />} />
        <Route path="/profile-page"  element={<ProfilePage />} />
        <Route path="/about-page"    element={<AboutPage />} />

        {/* Protected routes — require authentication */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/grounding"
          element={
            <ProtectedRoute>
              <GroundingPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </PrivacyProvider>
    </AuthProvider>
  </BrowserRouter>
);
