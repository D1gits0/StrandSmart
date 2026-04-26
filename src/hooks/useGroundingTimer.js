/**
 * src/hooks/useGroundingTimer.js
 *
 * 60-second countdown that only ticks while the user is actively
 * interacting with the canvas (isActive = true).
 *
 * Returns:
 *   secondsLeft   — 60 → 0
 *   progress      — 0 → 1  (for the progress bar)
 *   isComplete    — true once secondsLeft hits 0
 *   reset()       — restart the timer
 */

import { useState, useEffect, useRef, useCallback } from "react";

const DURATION = 60;

const useGroundingTimer = (isActive) => {
  const [secondsLeft, setSecondsLeft] = useState(DURATION);
  const [isComplete,  setIsComplete]  = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isComplete) return;

    if (isActive) {
      // Start ticking
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Pause when not interacting
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, isComplete]);

  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    setSecondsLeft(DURATION);
    setIsComplete(false);
  }, []);

  return {
    secondsLeft,
    progress:   (DURATION - secondsLeft) / DURATION,
    isComplete,
    reset,
  };
};

export default useGroundingTimer;
