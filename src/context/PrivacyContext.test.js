/**
 * src/context/PrivacyContext.test.js
 *
 * Property-based tests for PrivacyContext.
 *
 * Feature: strandsmart-full-redesign
 * Property 7: Discreet mode label substitution is exhaustive
 * Validates: Requirements 17.4, 17.5, 17.6, 17.7
 */

import React from "react";
import { renderHook, act } from "@testing-library/react";
import * as fc from "fast-check";
import { PrivacyProvider, usePrivacy, LABEL_MAP } from "./PrivacyContext";

// Wrapper that provides the PrivacyContext
const wrapper = ({ children }) => <PrivacyProvider>{children}</PrivacyProvider>;

describe("PrivacyContext — LABEL_MAP coverage", () => {
  test("LABEL_MAP contains all four required keys", () => {
    expect(LABEL_MAP).toHaveProperty("StrandSmart", "Notes");
    expect(LABEL_MAP).toHaveProperty("Log Urge", "New Note");
    expect(LABEL_MAP).toHaveProperty("Grounding", "Focus");
    expect(LABEL_MAP).toHaveProperty("Dashboard", "Notes");
  });
});

/**
 * Property 7: Discreet mode label substitution is exhaustive
 *
 * For any string key in the LABEL_MAP ("StrandSmart", "Log Urge", "Grounding", "Dashboard"),
 * calling label(key) with discreetMode === true SHALL return the mapped replacement value,
 * and calling it with discreetMode === false SHALL return the original key unchanged.
 *
 * Validates: Requirements 17.4, 17.5, 17.6, 17.7
 */
describe("Property 7: Discreet mode label substitution is exhaustive", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("label(key) returns mapped value when discreetMode is true", () => {
    // Feature: strandsmart-full-redesign, Property 7: discreet mode label substitution is exhaustive
    // Set discreet mode in localStorage so the hook initialises with it on
    localStorage.setItem("ss_discreet", "true");

    const { result } = renderHook(() => usePrivacy(), { wrapper });

    fc.assert(
      fc.property(
        fc.constantFrom("StrandSmart", "Log Urge", "Grounding", "Dashboard"),
        (key) => {
          // discreetMode is true (set via localStorage before hook init)
          expect(result.current.discreetMode).toBe(true);
          // label(key) must return the mapped replacement value
          expect(result.current.label(key)).toBe(LABEL_MAP[key]);
          // and must NOT return the original key
          expect(result.current.label(key)).not.toBe(key);
        }
      ),
      { numRuns: 100 }
    );
  });

  test("label(key) returns original key when discreetMode is false", () => {
    // Feature: strandsmart-full-redesign, Property 7: discreet mode label substitution is exhaustive
    // Ensure discreet mode is off (default)
    localStorage.removeItem("ss_discreet");

    const { result } = renderHook(() => usePrivacy(), { wrapper });

    fc.assert(
      fc.property(
        fc.constantFrom("StrandSmart", "Log Urge", "Grounding", "Dashboard"),
        (key) => {
          // discreetMode is false (default)
          expect(result.current.discreetMode).toBe(false);
          // label(key) must return the original key unchanged
          expect(result.current.label(key)).toBe(key);
        }
      ),
      { numRuns: 100 }
    );
  });

  test("toggling discreetMode switches label behaviour for all mapped keys", () => {
    // Feature: strandsmart-full-redesign, Property 7: discreet mode label substitution is exhaustive
    localStorage.removeItem("ss_discreet");

    const { result } = renderHook(() => usePrivacy(), { wrapper });

    fc.assert(
      fc.property(
        fc.constantFrom("StrandSmart", "Log Urge", "Grounding", "Dashboard"),
        (key) => {
          // Start with discreet mode off — label returns original key
          act(() => {
            if (result.current.discreetMode) {
              result.current.toggleDiscreetMode();
            }
          });
          expect(result.current.label(key)).toBe(key);

          // Turn discreet mode on — label returns mapped value
          act(() => {
            result.current.toggleDiscreetMode();
          });
          expect(result.current.label(key)).toBe(LABEL_MAP[key]);

          // Turn discreet mode off again — label returns original key
          act(() => {
            result.current.toggleDiscreetMode();
          });
          expect(result.current.label(key)).toBe(key);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe("PrivacyContext — cvEnabled state", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("cvEnabled defaults to true when localStorage has no value", () => {
    const { result } = renderHook(() => usePrivacy(), { wrapper });
    expect(result.current.cvEnabled).toBe(true);
  });

  test("setCvEnabled persists to localStorage", () => {
    const { result } = renderHook(() => usePrivacy(), { wrapper });

    act(() => {
      result.current.setCvEnabled(false);
    });

    expect(result.current.cvEnabled).toBe(false);
    expect(localStorage.getItem("ss_cv_enabled")).toBe("false");
  });

  test("setCvEnabled(true) restores enabled state", () => {
    const { result } = renderHook(() => usePrivacy(), { wrapper });

    act(() => {
      result.current.setCvEnabled(false);
    });
    act(() => {
      result.current.setCvEnabled(true);
    });

    expect(result.current.cvEnabled).toBe(true);
    expect(localStorage.getItem("ss_cv_enabled")).toBe("true");
  });
});
