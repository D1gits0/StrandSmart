/**
 * src/utils/difficultyConfig.test.js
 *
 * Property 8: Difficulty selector maps to correct FidgetCanvas configuration
 * Validates: Requirements 19.2, 19.3, 19.4
 *
 * For any difficulty value in {"beginner", "intermediate", "advanced"}, the
 * configs must be strictly ordered:
 *   - Beginner > Intermediate > Advanced for proximityR
 *   - Beginner < Intermediate < Advanced for pulseSpeed
 */

import fc from "fast-check";
import { getDifficultyConfig, PROXIMITY_R } from "./difficultyConfig";

describe("getDifficultyConfig", () => {
  // ── Unit tests ──────────────────────────────────────────────────────────────

  test("beginner returns PROXIMITY_R * 1.5 and pulseSpeed 0.7", () => {
    const config = getDifficultyConfig("beginner");
    expect(config.proximityR).toBe(PROXIMITY_R * 1.5);
    expect(config.pulseSpeed).toBe(0.7);
  });

  test("intermediate returns base PROXIMITY_R and pulseSpeed 1.0", () => {
    const config = getDifficultyConfig("intermediate");
    expect(config.proximityR).toBe(PROXIMITY_R);
    expect(config.pulseSpeed).toBe(1.0);
  });

  test("advanced returns PROXIMITY_R * 0.65 and pulseSpeed 1.4", () => {
    const config = getDifficultyConfig("advanced");
    expect(config.proximityR).toBe(PROXIMITY_R * 0.65);
    expect(config.pulseSpeed).toBe(1.4);
  });

  test("unknown difficulty falls back to intermediate defaults", () => {
    const config = getDifficultyConfig("unknown");
    expect(config.proximityR).toBe(PROXIMITY_R);
    expect(config.pulseSpeed).toBe(1.0);
  });

  test("PROXIMITY_R is exported as 40", () => {
    expect(PROXIMITY_R).toBe(40);
  });

  // ── Property 8: Difficulty selector maps to correct FidgetCanvas config ─────
  // Feature: strandsmart-full-redesign, Property 8: difficulty selector maps to correct FidgetCanvas config
  // Validates: Requirements 19.2, 19.3, 19.4

  test(
    "Property 8: for any difficulty, configs are strictly ordered by proximityR (beginner > intermediate > advanced) and pulseSpeed (beginner < intermediate < advanced)",
    () => {
      fc.assert(
        fc.property(
          fc.constantFrom("beginner", "intermediate", "advanced"),
          (_difficulty) => {
            const configs = ["beginner", "intermediate", "advanced"].map(getDifficultyConfig);
            const [beginner, intermediate, advanced] = configs;

            // proximityR: beginner > intermediate > advanced
            const proximityOrdered =
              beginner.proximityR > intermediate.proximityR &&
              intermediate.proximityR > advanced.proximityR;

            // pulseSpeed: beginner < intermediate < advanced
            const speedOrdered =
              beginner.pulseSpeed < intermediate.pulseSpeed &&
              intermediate.pulseSpeed < advanced.pulseSpeed;

            return proximityOrdered && speedOrdered;
          }
        ),
        { numRuns: 100 }
      );
    }
  );
});
