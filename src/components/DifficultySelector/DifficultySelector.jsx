/**
 * src/components/DifficultySelector/DifficultySelector.jsx
 *
 * Difficulty selector for the Strand Flow (FidgetCanvas) exercise.
 * Shows three options: Beginner, Intermediate, Advanced.
 * Persists selection to localStorage key "ss_grounding_difficulty".
 *
 * Props:
 *   value    — "beginner" | "intermediate" | "advanced"
 *   onChange — (v: string) => void
 */

import React from "react";

const SS_GREEN = "#00c864";

const DIFFICULTIES = [
  {
    id: "beginner",
    label: "Beginner",
    icon: "tim-icons icon-heart-2",
    description: "Wider guide, slower pace",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    icon: "tim-icons icon-tap-02",
    description: "Standard guide & speed",
  },
  {
    id: "advanced",
    label: "Advanced",
    icon: "tim-icons icon-bolt",
    description: "Tighter guide, faster pace",
  },
];

const STORAGE_KEY = "ss_grounding_difficulty";

const DifficultySelector = ({ value, onChange }) => {
  const handleSelect = (difficulty) => {
    localStorage.setItem(STORAGE_KEY, difficulty);
    onChange(difficulty);
  };

  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <p
        style={{
          fontSize: "0.72rem",
          opacity: 0.45,
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          marginBottom: "0.6rem",
        }}
      >
        Difficulty
      </p>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
        }}
        role="group"
        aria-label="Select difficulty"
      >
        {DIFFICULTIES.map((d) => {
          const isActive = value === d.id;
          return (
            <button
              key={d.id}
              onClick={() => handleSelect(d.id)}
              aria-pressed={isActive}
              title={d.description}
              style={{
                flex: 1,
                background: isActive ? "rgba(0,200,100,0.12)" : "rgba(255,255,255,0.04)",
                border: isActive
                  ? `1px solid rgba(0,200,100,0.45)`
                  : "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: isActive ? SS_GREEN : "rgba(255,255,255,0.45)",
                cursor: "pointer",
                fontSize: "0.75rem",
                fontWeight: isActive ? 700 : 500,
                padding: "0.55rem 0.25rem",
                transition: "all 0.18s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.3rem",
                lineHeight: 1.2,
              }}
            >
              <i
                className={d.icon}
                style={{ fontSize: "0.95rem" }}
                aria-hidden="true"
              />
              {d.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DifficultySelector;
