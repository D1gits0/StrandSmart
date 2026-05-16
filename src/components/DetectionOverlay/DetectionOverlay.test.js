/**
 * src/components/DetectionOverlay/DetectionOverlay.test.js
 *
 * Property 10: Alert suppression duration is respected
 * Validates: Requirements 26.4
 *
 * For any suppression duration value d in [1, 60] minutes, after a CV alert
 * is dismissed, no new alert vignette SHALL appear for at least d minutes,
 * regardless of how many proximity events the CV backend reports during that window.
 */

import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import * as fc from "fast-check";

// ── Mocks ─────────────────────────────────────────────────────────────────────

// Mock react-router-dom so we don't need a Router wrapper
jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));

// Mock framer-motion to render children directly (avoids animation complexity in tests)
jest.mock("framer-motion", () => {
  const React = require("react");
  return {
    motion: {
      div: ({ children, ...props }) => <div {...props}>{children}</div>,
      button: ({ children, ...props }) => <button {...props}>{children}</button>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
  };
});

// We'll control what useDetection returns via this mutable ref
let mockDetectionState = {
  alert: false,
  confidence: 0,
  zone: null,
  isConnected: true,
};

jest.mock("hooks/useDetection", () => ({
  __esModule: true,
  default: () => mockDetectionState,
}));

// Mock AuthContext — provide a non-null currentUser so the component renders
jest.mock("context/AuthContext", () => ({
  useAuth: () => ({ currentUser: { uid: "test-user" }, loading: false }),
}));

// Mock PrivacyContext — cvEnabled: true so the component renders
jest.mock("context/PrivacyContext", () => ({
  usePrivacy: () => ({
    cvEnabled: true,
    discreetMode: false,
    toggleDiscreetMode: jest.fn(),
    label: (k) => k,
    setCvEnabled: jest.fn(),
  }),
}));

// ── Import component after mocks are set up ───────────────────────────────────
const DetectionOverlay = require("./DetectionOverlay").default;

// ── Helper ────────────────────────────────────────────────────────────────────

/**
 * Render DetectionOverlay with a given suppressDuration, trigger an alert,
 * dismiss it, then return helpers for advancing time and querying vignette.
 */
function setupWithAlert(suppressDuration) {
  // Start with an active alert
  mockDetectionState = { alert: true, confidence: 0.9, zone: "eyebrow", isConnected: true };

  const { rerender, unmount } = render(
    <DetectionOverlay suppressDuration={suppressDuration} />
  );

  return { rerender, unmount };
}

// ── Property test ─────────────────────────────────────────────────────────────

describe("Property 10: Alert suppression duration is respected", () => {
  /**
   * Validates: Requirements 26.4
   *
   * For any d in [1, 60] minutes, after dismissing a CV alert, the vignette
   * must NOT reappear until at least d minutes have elapsed.
   */
  it("suppresses the vignette for exactly d minutes after dismiss", () => {
    // Feature: strandsmart-full-redesign, Property 10: alert suppression duration is respected
    jest.useFakeTimers();

    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 60 }),
        (d) => {
          // ── Setup: render with an active alert ──────────────────────────
          mockDetectionState = {
            alert: true,
            confidence: 0.9,
            zone: "eyebrow",
            isConnected: true,
          };

          const { rerender, unmount } = render(
            <DetectionOverlay suppressDuration={d} />
          );

          // Vignette should be visible (alert is active)
          expect(screen.getByRole("button", { name: new RegExp(`Dismiss alert for ${d}`) })).toBeInTheDocument();

          // ── Dismiss the alert ────────────────────────────────────────────
          act(() => {
            fireEvent.click(
              screen.getByRole("button", { name: new RegExp(`Dismiss alert for ${d}`) })
            );
          });

          // Vignette should be gone immediately after dismiss
          expect(
            screen.queryByRole("button", { name: new RegExp(`Dismiss alert for ${d}`) })
          ).not.toBeInTheDocument();

          // ── Simulate a new alert firing during suppression window ────────
          mockDetectionState = {
            alert: true,
            confidence: 0.95,
            zone: "nose",
            isConnected: true,
          };

          // Advance time to just before suppression expires (d * 60 * 1000 - 1 ms)
          act(() => {
            jest.advanceTimersByTime(d * 60 * 1000 - 1);
          });

          // Re-render to pick up the new alert state
          rerender(<DetectionOverlay suppressDuration={d} />);

          // Vignette must NOT be shown — still within suppression window
          expect(
            screen.queryByRole("button", { name: new RegExp(`Dismiss alert for ${d}`) })
          ).not.toBeInTheDocument();

          // ── Advance 1 more ms — suppression window expires ───────────────
          act(() => {
            jest.advanceTimersByTime(1);
          });

          // Re-render to pick up the expired suppression
          rerender(<DetectionOverlay suppressDuration={d} />);

          // Vignette CAN now show again (suppression expired, alert still active)
          expect(
            screen.getByRole("button", { name: new RegExp(`Dismiss alert for ${d}`) })
          ).toBeInTheDocument();

          // ── Cleanup ──────────────────────────────────────────────────────
          unmount();
          jest.clearAllTimers();
        }
      ),
      { numRuns: 20 } // 20 runs is sufficient for timer-based properties; full 100 would be very slow
    );

    jest.useRealTimers();
  });
});
