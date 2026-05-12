# Implementation Plan: StrandSmart Full Redesign

## Overview

This plan breaks the redesign into incremental coding tasks that build on each other, starting with foundational infrastructure (context, hooks, routing) and progressing through each feature surface. All code is JavaScript/React with Firebase and fast-check for property-based tests.

## Tasks

- [ ] 1. Install fast-check and set up testing infrastructure
  - Run `npm install --save-dev fast-check` to add the property-based testing library
  - Verify `react-scripts test` can discover test files in `src/`
  - _Requirements: (testing infrastructure for all property tests)_

- [ ] 2. Update PrivacyContext with expanded label map and CV enabled state
  - [ ] 2.1 Expand `LABEL_MAP` in `PrivacyContext` to cover all four required substitutions: `"Log Urge"` → `"New Note"`, `"Grounding"` → `"Focus"`, `"Dashboard"` → `"Notes"`, `"StrandSmart"` → `"Notes"`
    - Export a `label(key)` helper from the context that returns the mapped value when `discreetMode` is true and the original key when false
    - _Requirements: 17.4, 17.5, 17.6, 17.7_
  - [ ] 2.2 Add `cvEnabled` boolean state (default `true`) to `PrivacyContext`, persisted to `localStorage` key `ss_cv_enabled`
    - Expose `cvEnabled` and `setCvEnabled` from the context
    - _Requirements: 27.1, 27.2_
  - [ ] 2.3 Apply full white/black CSS variable set when `discreetMode` is active (plain white background, black text, system-ui font)
    - _Requirements: 17.1, 17.2_
  - [ ]* 2.4 Write property test for discreet mode label substitution
    - **Property 7: Discreet mode label substitution is exhaustive**
    - **Validates: Requirements 17.4, 17.5, 17.6, 17.7**

- [ ] 3. Update `useDetection` hook with auth gate and CV enabled guard
  - [ ] 3.1 Accept `enabled: bool` prop; when `false`, do not open WebSocket and do not start camera
    - _Requirements: 27.2, 28.2_
  - [ ] 3.2 Accept `currentUser` from `AuthContext`; when `null`, do not open WebSocket
    - _Requirements: 28.1, 28.2_
  - [ ] 3.3 On sign-out (`currentUser` transitions to `null`), close the WebSocket and stop the frame interval
    - _Requirements: 28.4_

- [ ] 4. Update `DetectionOverlay` with auth gate, CV enabled guard, and suppression duration
  - [ ] 4.1 Read `currentUser` from `AuthContext`; if `null`, render nothing
    - _Requirements: 28.1_
  - [ ] 4.2 Read `cvEnabled` from `PrivacyContext`; if `false`, render nothing
    - _Requirements: 27.2_
  - [ ] 4.3 Accept `suppressDuration` (in minutes, from user preferences, default 5) and use it for the dismiss timer
    - _Requirements: 26.4_
  - [ ] 4.4 Gate `DebugBadge` behind `process.env.NODE_ENV === "development"` check
    - _Requirements: (code quality)_
  - [ ]* 4.5 Write property test for alert suppression duration
    - **Property 10: Alert suppression duration is respected**
    - **Validates: Requirements 26.4**

- [ ] 5. Checkpoint — Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Update auth pages — color scheme, email validation, and Terms checkbox
  - [ ] 6.1 Replace `page-header-image` background on `LoginPage` and `RegisterPage` with `background: #0d2b1a`
    - _Requirements: 1.1, 1.2_
  - [ ] 6.2 Add client-side email validation using regex `^[^\s@]+@[^\s@]+\.[^\s@]+$` to `LoginPage`
    - Display inline error below the email field on invalid submission; clear error when field becomes valid
    - _Requirements: 2.2, 2.3, 2.4_
  - [ ] 6.3 Add client-side email validation to `RegisterPage` with the same regex and inline error behavior
    - _Requirements: 2.1, 2.3, 2.4_
  - [ ] 6.4 Add Terms checkbox to `RegisterPage` with label "I agree to the Terms of Service" linking to `/terms`
    - Block submission if unchecked; show inline error "Please agree to the Terms of Service to continue."
    - _Requirements: 3.1, 3.2, 3.3_
  - [ ]* 6.5 Write property test for email validation rejects non-email strings
    - **Property 1: Email validation rejects all non-email strings**
    - **Validates: Requirements 2.1, 2.2**
  - [ ]* 6.6 Write property test for email validation error clears on valid input
    - **Property 2: Email validation error clears on valid input**
    - **Validates: Requirements 2.3**

- [ ] 7. Add new static routes — TermsPage and PrivacyPage
  - [ ] 7.1 Create `src/views/TermsPage.js` as a placeholder static page at `/terms`, accessible without authentication
    - _Requirements: 3.4_
  - [ ] 7.2 Create `src/views/PrivacyPage.js` at `/privacy`, accessible without authentication
    - Include: what is collected (urge logs, timestamps, intensity), what is never collected (video, images, biometric data), where data lives (Firestore, deletable), CV processing is entirely local
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_
  - [ ] 7.3 Register `/terms` and `/privacy` routes in the app router (`src/index.js` or equivalent routing file)
    - _Requirements: 3.4, 13.1_

- [ ] 8. Update Footer and Navbar
  - [ ] 8.1 Add a link to `/privacy` in the `Footer` component
    - _Requirements: 13.6_
  - [ ] 8.2 Replace the text-labeled "Discreet" button in `ExamplesNavbar` with an icon-only button using `fa-arrow-up-from-bracket` (or equivalent iOS share-style icon)
    - Add `aria-label="Toggle discreet mode"`, show filled vs. outline icon based on `discreetMode`
    - _Requirements: 18.1, 18.2, 18.3, 18.4_
  - [ ] 8.3 Add a link to `/settings` in `ExamplesNavbar` for authenticated users
    - _Requirements: 23.3_

- [ ] 9. Remove ReactTyped animation from landing page
  - [ ] 9.1 Remove the `ReactTyped` component from the landing page (`/`) Boom section
    - Replace with static text conveying the same meaning
    - _Requirements: 4.1, 4.2_

- [ ] 10. Create `PrivacyBanner` component
  - [ ] 10.1 Implement `PrivacyBanner` as a non-blocking overlay that checks `localStorage.getItem("ss_camera_banner_dismissed")`
    - Show banner with text "Camera is active. Your video is processed locally and never transmitted or stored." and a "Got it" button
    - On dismiss: set `localStorage.setItem("ss_camera_banner_dismissed", "true")` and hide banner
    - _Requirements: 12.1, 12.2, 12.3_
  - [ ]* 10.2 Write property test for privacy banner dismiss persistence
    - **Property 5: Privacy banner dismiss is persistent**
    - **Validates: Requirements 12.2**

- [ ] 11. Checkpoint — Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Create `OnboardingModal` component
  - [ ] 12.1 Implement `OnboardingModal` with 3 screens and Next/Back navigation
    - Screen 1: warm plain-English description of StrandSmart (no clinical terminology)
    - Screen 2: explicit privacy statement + simple local CV pipeline diagram + link to `/privacy`
    - Screen 3: two paths — "Use without CV detection" and "Enable CV detection" with setup instructions; include statement that app is fully functional without CV
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6, 13.7_
  - [ ] 12.2 On complete or dismiss, write `onboardingComplete: true` to `users/{uid}` in Firestore using `setDoc` with `merge: true`
    - _Requirements: 5.7_
  - [ ] 12.3 In the Dashboard entry point, check `onboardingComplete` from the user's Firestore document; show `OnboardingModal` if not set, skip if already `true`
    - _Requirements: 5.1, 5.8_

- [ ] 13. Create `CVStatusCard` component
  - [ ] 13.1 Implement `CVStatusCard` with two states: connected (`isConnected=true`) and disconnected (`isConnected=false`)
    - Connected: camera active indicator, "CV Connected" label, live pulse animation
    - Disconnected: friendly explainer text "CV detection adds real-time awareness. It runs locally on your device." + "Set up CV detection" button linking to `/settings#cv-detection`
    - Include a note that detection logs are local only and never transmitted
    - _Requirements: 7.2, 7.3, 7.4, 16.2_

- [ ] 14. Update Dashboard layout
  - [ ] 14.1 Add `CVStatusCard` as the first element below the welcome header, above all other widgets
    - Hide `CVStatusCard` when `discreetMode` is active
    - _Requirements: 7.1, 17.8_
  - [ ] 14.2 Remove `VibeInput` from the top-level dashboard layout; add a "Reflections" navigation card/button in its place
    - _Requirements: 10.1, 10.2, 10.3_
  - [ ] 14.3 Wrap each of the six widgets in a visibility check against `widgetPreferences` from Firestore (default all `true`)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  - [ ] 14.4 Update empty state messages for Recent Logs, Insights Chart, and Safe Streak widgets to warm, encouraging copy; ensure no message contains "no data" or "no data yet"
    - Recent Logs empty: "Your urge patterns will appear here after a few logs. You're already doing the hard part by showing up."
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  - [ ] 14.5 Apply solid navbar background immediately on the Dashboard page (remove scroll threshold)
    - _Requirements: 11.1, 11.2_
  - [ ]* 14.6 Write property test for widget visibility round-trip
    - **Property 3: Widget visibility is a round-trip**
    - **Validates: Requirements 8.3, 8.4**
  - [ ]* 14.7 Write property test for empty states never containing "no data"
    - **Property 4: Empty states never contain "no data"**
    - **Validates: Requirements 9.4**

- [ ] 15. Checkpoint — Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Update Grounding page — difficulty selector, overflow fix, progress indicators, completion screen
  - [ ] 16.1 Create `DifficultySelector` component with three options (Beginner, Intermediate, Advanced)
    - Persist selection to `localStorage` key `ss_grounding_difficulty`
    - Show selector on the Strand Flow tab before the canvas session begins
    - _Requirements: 19.1, 19.5_
  - [ ] 16.2 Extract a `getDifficultyConfig(difficulty)` pure function that maps difficulty to `PROXIMITY_R` and pulse speed
    - Beginner: `PROXIMITY_R * 1.5`, speed `* 0.7`; Intermediate: defaults; Advanced: `PROXIMITY_R * 0.65`, speed `* 1.4`
    - _Requirements: 19.2, 19.3, 19.4_
  - [ ] 16.3 Update `FidgetCanvas` to accept a `difficulty` prop and apply the config from `getDifficultyConfig`
    - _Requirements: 19.2, 19.3, 19.4_
  - [ ] 16.4 Fix the Techniques tab container: add `max-height` and `overflow-y: auto` so expanded cards don't push content off screen
    - _Requirements: 20.1, 20.2_
  - [ ] 16.5 Add progress indicators (timer or progress bar) to the 5-4-3-2-1 challenge and technique cards
    - _Requirements: 21.1, 21.2, 21.3_
  - [ ] 16.6 Create `GroundingCompletionScreen` component shown when a session ends
    - Message: "Nice work. Your hands stayed busy for [duration]."
    - Actions: "Log an urge" and "Back to dashboard"
    - _Requirements: 22.1, 22.2, 22.3_
  - [ ]* 16.7 Write property test for difficulty selector maps to correct FidgetCanvas config
    - **Property 8: Difficulty selector maps to correct FidgetCanvas configuration**
    - **Validates: Requirements 19.2, 19.3, 19.4**

- [ ] 17. Create SettingsPage with all six sections
  - [ ] 17.1 Create `src/views/SettingsPage.js` as a protected route at `/settings`
    - Scaffold six collapsible sections: Profile, Dashboard, Data, Preferences, CV Detection, Onboarding
    - _Requirements: 23.1, 23.2_
  - [ ] 17.2 Implement Profile section: display current display name and email; save display name to Firebase Auth `displayName`; save email to Firebase Auth account with error handling for re-auth failures
    - _Requirements: 24.1, 24.2, 24.3, 24.4_
  - [ ] 17.3 Implement Dashboard section: six widget visibility toggles that read/write `widgetPreferences` to Firestore
    - _Requirements: 8.3, 8.4, 8.5_
  - [ ] 17.4 Implement Data section: list all Urge_Log entries; individual delete with confirmation; "Delete all logs" with confirmation dialog; link to data export (Requirement 15); link to account deletion (Requirement 14)
    - _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5_
  - [ ] 17.5 Implement data export: fetch all Urge_Log documents, generate CSV with `timestamp,intensity,note` columns, trigger browser download as `strandsmart-logs-YYYY-MM-DD.csv`
    - _Requirements: 15.1, 15.2, 15.3, 15.4_
  - [ ] 17.6 Implement account deletion: two-step confirmation (first dialog explains permanence; second requires typing "DELETE"); on confirm, delete all `users/{uid}/logs/` documents, delete `users/{uid}` document, delete Firebase Auth account, sign out, navigate to `/`; on any failure, show error and leave account intact
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_
  - [ ] 17.7 Implement Preferences section: default grounding difficulty selector (writes to Firestore `preferences.defaultGroundingDifficulty`); alert suppression duration control (1–60 min, writes to Firestore `preferences.alertSuppressionMinutes`)
    - _Requirements: 26.1, 26.2, 26.3, 26.4_
  - [ ] 17.8 Implement CV Detection section: enable/disable toggle (reads/writes `cvEnabled` in `PrivacyContext` and `localStorage`); sensitivity slider mapping to `distance_threshold` in `backend/config.json`; link to `/privacy`; note that `detections.log` is local only
    - _Requirements: 27.1, 27.2, 27.3, 27.4, 27.5_
  - [ ] 17.9 Implement Onboarding section: "Revisit onboarding" button that opens `OnboardingModal` from Screen 1
    - _Requirements: 6.1, 6.2_
  - [ ]* 17.10 Write property test for CSV export contains all required fields
    - **Property 6: CSV export contains all required fields for every log**
    - **Validates: Requirements 15.3**
  - [ ]* 17.11 Write property test for default difficulty preference pre-selects on Grounding page
    - **Property 9: Default difficulty preference pre-selects on Grounding page**
    - **Validates: Requirements 26.2**

- [ ] 18. Checkpoint — Ensure all tests pass, ask the user if questions arise.

- [ ] 19. Wire PrivacyBanner into the CV detection flow
  - [ ] 19.1 Mount `PrivacyBanner` in the component that activates the camera (e.g., inside `DetectionOverlay` or alongside `useDetection`); show it on first camera activation when `ss_camera_banner_dismissed` is not set
    - _Requirements: 12.1, 12.2, 12.3_

- [ ] 20. Update Discreet Mode — hide CV card and pause frames
  - [ ] 20.1 Ensure `CVStatusCard` is not rendered when `discreetMode` is active (already referenced in task 14.1; verify the condition is in place)
    - _Requirements: 17.8_
  - [ ] 20.2 Verify `useDetection` pauses sending frames (via `discreetRef`) when `discreetMode` is true and resumes when deactivated
    - _Requirements: 17.9, 17.10_

- [ ] 21. Rewrite README
  - [ ] 21.1 Rewrite `README.md` with the following sections: introduction (warm, plain language, no clinical terminology), Privacy (local inference, what is collected, what is never collected), How to run locally (backend venv311 + uvicorn, frontend npm start), two usage paths (with and without CV), configuration guide for `distance_threshold` and `alert_duration_seconds`, tech stack, known limitations, Contributing
    - Include explicit statement that `detections.log` is local-only, never synced, contains only detection metadata with no image data or PII
    - _Requirements: 16.1, 29.1, 29.2, 29.3, 29.4, 29.5, 29.6, 29.7, 29.8_

- [ ] 22. Final checkpoint — Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at logical boundaries
- Property tests use **fast-check** (install in Task 1) and validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The CV backend (`backend/main.py`) is not modified by this redesign; all changes are frontend-only except the sensitivity slider in Settings which writes to `backend/config.json`
