/**
 * src/components/PrivacyBanner/PrivacyBanner.test.js
 *
 * Property 5: Privacy banner dismiss is persistent
 *
 * For any boolean value (re-render trigger), when localStorage has
 * ss_camera_banner_dismissed = "true", rendering PrivacyBanner SHALL NOT
 * display the banner.
 *
 * Validates: Requirements 12.2
 *
 * Feature: strandsmart-full-redesign, Property 5: privacy banner dismiss is persistent
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import fc from "fast-check";
import PrivacyBanner from "./PrivacyBanner";

const STORAGE_KEY = "ss_camera_banner_dismissed";
const BANNER_TEXT = /camera is active/i;

// ── Helper: clear localStorage before each test ───────────────────────────────
beforeEach(() => {
  localStorage.clear();
});

// ── Property 5: Privacy banner dismiss is persistent ─────────────────────────
// Feature: strandsmart-full-redesign, Property 5: privacy banner dismiss is persistent
test("Property 5 — banner is not shown when ss_camera_banner_dismissed is 'true'", () => {
  fc.assert(
    fc.property(
      fc.boolean(), // re-render trigger (arbitrary boolean, value unused)
      (_rerenderTrigger) => {
        // Arrange: mark banner as dismissed in localStorage
        localStorage.setItem(STORAGE_KEY, "true");

        // Act: render the component
        const { unmount } = render(<PrivacyBanner />);

        // Assert: banner text must NOT be present
        const bannerEl = screen.queryByText(BANNER_TEXT);
        const result = bannerEl === null;

        // Cleanup between iterations
        unmount();
        localStorage.clear();

        return result;
      }
    ),
    { numRuns: 100 }
  );
});

// ── Unit test: banner IS shown when key is absent ─────────────────────────────
test("banner is visible when ss_camera_banner_dismissed is not set", () => {
  render(<PrivacyBanner />);
  expect(screen.getByText(BANNER_TEXT)).toBeInTheDocument();
});

// ── Unit test: banner IS shown when key is set to something other than "true" ─
test("banner is visible when ss_camera_banner_dismissed is 'false'", () => {
  localStorage.setItem(STORAGE_KEY, "false");
  render(<PrivacyBanner />);
  expect(screen.getByText(BANNER_TEXT)).toBeInTheDocument();
});

// ── Unit test: clicking "Got it" hides the banner and persists the key ────────
test("clicking 'Got it' hides the banner and sets localStorage key", async () => {
  const user = userEvent.setup();
  render(<PrivacyBanner />);

  // Banner is visible initially
  expect(screen.getByText(BANNER_TEXT)).toBeInTheDocument();

  // Click dismiss
  await user.click(screen.getByRole("button", { name: /got it/i }));

  // Banner should be gone
  expect(screen.queryByText(BANNER_TEXT)).not.toBeInTheDocument();

  // localStorage key should be set
  expect(localStorage.getItem(STORAGE_KEY)).toBe("true");
});
