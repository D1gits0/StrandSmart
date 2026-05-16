/**
 * src/utils/difficultyConfig.js
 *
 * Pure utility for mapping a difficulty level to FidgetCanvas configuration.
 *
 * Exported:
 *   PROXIMITY_R              — base proximity radius in pixels (40)
 *   getDifficultyConfig(d)   — returns { proximityR, pulseSpeed } for the given difficulty
 */

export const PROXIMITY_R = 40;

/**
 * Returns the FidgetCanvas configuration for the given difficulty level.
 *
 * @param {"beginner"|"intermediate"|"advanced"} difficulty
 * @returns {{ proximityR: number, pulseSpeed: number }}
 */
export const getDifficultyConfig = (difficulty) => {
  switch (difficulty) {
    case "beginner":
      return {
        proximityR: PROXIMITY_R * 1.5,  // 60px — wider tolerance
        pulseSpeed: 0.7,                 // slower pulse
      };
    case "advanced":
      return {
        proximityR: PROXIMITY_R * 0.65, // 26px — tighter tolerance
        pulseSpeed: 1.4,                 // faster pulse
      };
    case "intermediate":
    default:
      return {
        proximityR: PROXIMITY_R,         // 40px — standard
        pulseSpeed: 1.0,                 // standard pulse
      };
  }
};
