# Requirements Document

## Introduction

This document covers the full redesign of StrandSmart — a React/Firebase web app that helps people managing trichotillomania track urges, practice grounding exercises, and optionally use a local computer vision (CV) backend to detect hand-to-face proximity in real time. The redesign touches every major surface: auth flow, a new onboarding modal, dashboard restructuring, privacy infrastructure, discreet mode overhaul, grounding exercise improvements, a new settings page, CV detection auth-gating, and a README rewrite. All CV processing runs locally via a FastAPI/MediaPipe backend; no video or biometric data ever leaves the device.

---

## Glossary

- **App**: The StrandSmart React single-page application.
- **Auth_System**: Firebase Authentication, used for sign-in, sign-up, and session management.
- **CV_Backend**: The local FastAPI + MediaPipe server (`backend/main.py`) that processes webcam frames over WebSocket and emits proximity alerts.
- **Dashboard**: The `/dashboard` protected route — the primary logged-in view.
- **Detection_Overlay**: The `DetectionOverlay` component that mounts globally and manages the CV alert vignette and navigation to `/grounding`.
- **Discreet_Mode**: A toggle that transforms the App's visual identity to resemble a plain notes app, hiding all mental-health-specific UI.
- **Firebase**: The cloud backend (Firebase Auth + Firestore) used for user accounts and urge log storage.
- **Firestore**: Firebase's NoSQL database where urge logs, reflections, and user metadata are stored.
- **Footer**: The site-wide footer component rendered on all pages.
- **Grounding_Page**: The `/grounding` protected route containing the Strand Flow canvas, 5-4-3-2-1 challenge, and technique cards.
- **Navbar**: The fixed top navigation bar (`ExamplesNavbar`) rendered on all authenticated and public pages.
- **Onboarding_Modal**: A 3-screen modal shown once to first-time users after their first login.
- **Privacy_Banner**: A one-time dismissible banner shown when the camera first activates.
- **Privacy_Page**: A static page at `/privacy` explaining data practices in plain English.
- **Settings_Page**: A new `/settings` protected route with sections for profile, dashboard, data, preferences, CV detection, and onboarding.
- **Terms_Page**: A placeholder static page at `/terms` linked from the sign-up form.
- **Urge_Log**: A Firestore document recording a single urge event (timestamp, intensity, optional note).
- **useDetection**: The React hook (`src/hooks/useDetection.js`) that manages the WebSocket connection to the CV_Backend and streams webcam frames.
- **VibeInput**: The freeform text component currently embedded in the Dashboard that will be moved to the Reflections section.
- **Widget**: A toggleable dashboard card (Urge Tracker, Insights Chart, Recent Logs, Safe Streak, Daily Inspiration, Recent Reflections).

---

## Requirements

### Requirement 1: Auth Flow — Color Scheme

**User Story:** As a user, I want the sign-in and sign-up pages to use the same dark green color scheme as the rest of the app, so that the experience feels visually consistent from the moment I arrive.

#### Acceptance Criteria

1. THE App SHALL render the sign-in page (`/login-page`) background using the same dark green (`#0d2b1a`) used throughout the authenticated app, replacing any gold or tan background colors.
2. THE App SHALL render the sign-up page (`/register-page`) background using the same dark green (`#0d2b1a`), replacing any gold or tan background colors.
3. THE AuthCard component SHALL use the dark green color scheme for its card background, matching the glassmorphism style used on the Dashboard.

---

### Requirement 2: Auth Flow — Email Validation

**User Story:** As a user, I want the sign-up and sign-in forms to validate my email format before submission, so that I get immediate feedback if I've typed something wrong.

#### Acceptance Criteria

1. WHEN a user submits the sign-up form with an email that does not match the pattern `^[^\s@]+@[^\s@]+\.[^\s@]+$`, THE App SHALL prevent form submission and display an inline error message below the email field.
2. WHEN a user submits the sign-in form with an email that does not match the pattern `^[^\s@]+@[^\s@]+\.[^\s@]+$`, THE App SHALL prevent form submission and display an inline error message below the email field.
3. WHEN a user corrects the email to a valid format, THE App SHALL clear the inline email validation error.
4. THE App SHALL perform email format validation client-side before any Firebase Auth call is made.

---

### Requirement 3: Auth Flow — Terms and Conditions Checkbox

**User Story:** As a user signing up, I want to explicitly agree to the Terms of Service before creating an account, so that I understand what I'm consenting to.

#### Acceptance Criteria

1. THE App SHALL display a checkbox on the sign-up form with the label "I agree to the Terms of Service" containing a hyperlink to `/terms`.
2. WHEN a user attempts to submit the sign-up form without checking the Terms checkbox, THE App SHALL prevent submission and display an inline error: "Please agree to the Terms of Service to continue."
3. WHEN the Terms checkbox is checked, THE App SHALL enable form submission (subject to other validation passing).
4. THE App SHALL render a placeholder Terms page at the `/terms` route accessible without authentication.

---

### Requirement 4: Auth Flow — Remove Typing Animation

**User Story:** As a user visiting the landing page, I want a clean, calm experience without distracting animations, so that the page feels professional and focused.

#### Acceptance Criteria

1. THE App SHALL remove the `ReactTyped` typing animation from the landing page (`/`) Boom section.
2. THE App SHALL replace the animated typed text with static text that conveys the same meaning without animation.

---

### Requirement 5: Onboarding Modal — First-Time Flow

**User Story:** As a first-time user, I want to see a brief onboarding experience after my first login, so that I understand what StrandSmart is, how the CV detection works, and how to get started.

#### Acceptance Criteria

1. WHEN a user logs in for the first time and their Firestore user document does not contain `onboardingComplete: true`, THE App SHALL display the Onboarding_Modal before rendering the Dashboard.
2. THE Onboarding_Modal SHALL contain exactly 3 screens navigable with "Next" and "Back" controls.
3. THE Onboarding_Modal Screen 1 SHALL display a single warm, plain-English sentence describing what StrandSmart is, using no clinical terminology.
4. THE Onboarding_Modal Screen 2 SHALL display an explicit privacy statement: "Your camera feed never leaves your device. All processing happens locally. Nothing is recorded or stored." and a simple diagram illustrating the local CV pipeline.
5. THE Onboarding_Modal Screen 3 SHALL present two clear paths: "Use without CV detection" (proceeds immediately to Dashboard) and "Enable CV detection" (displays backend setup instructions).
6. THE Onboarding_Modal Screen 3 SHALL include a visible statement that the App is fully functional without CV detection enabled.
7. WHEN a user completes or dismisses the Onboarding_Modal, THE App SHALL write `onboardingComplete: true` to the user's Firestore document so the modal does not appear again.
8. WHEN a user logs in and their Firestore document contains `onboardingComplete: true`, THE App SHALL not display the Onboarding_Modal.

---

### Requirement 6: Onboarding — Revisit from Settings

**User Story:** As a returning user, I want to be able to revisit the onboarding flow from settings, so that I can review privacy information or setup instructions at any time.

#### Acceptance Criteria

1. THE Settings_Page SHALL contain a button labeled "Revisit onboarding" in the Onboarding section.
2. WHEN a user clicks "Revisit onboarding", THE App SHALL display the Onboarding_Modal starting from Screen 1.

---

### Requirement 7: Dashboard — CV Status as Hero Card

**User Story:** As a user, I want the CV detection status to be the first thing I see on the dashboard, so that I always know whether real-time detection is active.

#### Acceptance Criteria

1. THE Dashboard SHALL render the CV status card as the first visible element below the welcome header, above all other widgets.
2. WHEN the CV_Backend WebSocket is connected (`isConnected === true`), THE Dashboard SHALL display a card showing: camera active indicator, CV connected status, and a live pulse animation that activates when the model is analyzing frames.
3. WHEN the CV_Backend WebSocket is not connected (`isConnected === false`), THE Dashboard SHALL display a friendly explainer card with the text "CV detection adds real-time awareness. It runs locally on your device." and a "Set up CV detection" button linking to the CV Detection section of Settings_Page.
4. THE CV status card SHALL be visually prominent — using a distinct border or accent color to differentiate it from other dashboard widgets.

---

### Requirement 8: Dashboard — Widget Toggles

**User Story:** As a user, I want to choose which dashboard widgets are visible, so that I can customize my experience to show only what's useful to me.

#### Acceptance Criteria

1. THE Dashboard SHALL support the following toggleable widgets: Urge Tracker, Insights Chart, Recent Logs, Safe Streak, Daily Inspiration, Recent Reflections.
2. THE App SHALL render all six widgets by default for new users.
3. WHEN a user disables a widget via the Settings_Page Dashboard section, THE Dashboard SHALL not render that widget.
4. WHEN a user re-enables a widget via the Settings_Page Dashboard section, THE Dashboard SHALL render that widget.
5. THE App SHALL persist widget visibility preferences to Firestore under the user's document so preferences survive page refresh and re-login.

---

### Requirement 9: Dashboard — Warm Empty States

**User Story:** As a new user with no data yet, I want empty states to feel encouraging rather than cold, so that I feel motivated to keep using the app.

#### Acceptance Criteria

1. WHEN the Recent Logs widget has no urge logs, THE Dashboard SHALL display the message: "Your urge patterns will appear here after a few logs. You're already doing the hard part by showing up."
2. WHEN the Insights Chart widget has insufficient data to render, THE Dashboard SHALL display a warm, encouraging message rather than a generic "no data" placeholder.
3. WHEN the Safe Streak widget has no qualifying data, THE Dashboard SHALL display a warm, encouraging message rather than a generic "no data" placeholder.
4. THE App SHALL not display any empty state message containing the phrase "no data" or "no data yet".

---

### Requirement 10: Dashboard — Reflections Section

**User Story:** As a user, I want the freeform reflection text box moved off the main dashboard into a dedicated section, so that the dashboard feels focused and uncluttered.

#### Acceptance Criteria

1. THE Dashboard SHALL not render the VibeInput freeform text box as a top-level dashboard element.
2. THE App SHALL provide a dedicated Reflections section or page where users can write and view reflections.
3. THE Dashboard SHALL include a navigation link or button to the Reflections section.

---

### Requirement 11: Dashboard — Navbar Scroll Behavior

**User Story:** As a user scrolling the dashboard, I want the navbar to always have a solid background, so that it remains readable and doesn't overlap content with a transparent background.

#### Acceptance Criteria

1. WHILE the user is scrolling the Dashboard page, THE Navbar SHALL maintain a solid background color rather than becoming transparent.
2. THE Navbar SHALL apply a solid background immediately on the Dashboard page without requiring the user to scroll past a threshold.

---

### Requirement 12: Privacy — Camera Activation Banner

**User Story:** As a user whose camera activates for CV detection, I want a clear one-time notice that my video is processed locally, so that I feel confident my privacy is protected.

#### Acceptance Criteria

1. WHEN the camera activates for the first time in a browser session and `localStorage` does not contain the key `ss_camera_banner_dismissed`, THE App SHALL display the Privacy_Banner with the text: "Camera is active. Your video is processed locally and never transmitted or stored." and a "Got it" dismiss button.
2. WHEN a user clicks the dismiss button on the Privacy_Banner, THE App SHALL set `ss_camera_banner_dismissed` in `localStorage` and not show the Privacy_Banner again in any subsequent session.
3. THE Privacy_Banner SHALL be rendered as a non-blocking overlay that does not prevent interaction with the rest of the App.

---

### Requirement 13: Privacy — Privacy Page

**User Story:** As a user, I want a plain-English privacy page explaining exactly what data is and isn't collected, so that I can make an informed decision about using the app.

#### Acceptance Criteria

1. THE App SHALL render a Privacy_Page at the `/privacy` route accessible without authentication.
2. THE Privacy_Page SHALL explicitly state what data is collected: urge logs, timestamps, and intensity values.
3. THE Privacy_Page SHALL explicitly state what is never collected: video, images, and biometric data.
4. THE Privacy_Page SHALL state where data lives: Firebase Firestore under the user's account, deletable at any time.
5. THE Privacy_Page SHALL state that CV processing is entirely local and no frames are transmitted.
6. THE Footer SHALL include a link to `/privacy`.
7. THE Onboarding_Modal SHALL include a link to `/privacy`.
8. THE Settings_Page SHALL include a link to `/privacy` in the CV Detection section.

---

### Requirement 14: Privacy — Account and Data Deletion

**User Story:** As a user, I want to be able to permanently delete my account and all associated data, so that I have full control over my personal information.

#### Acceptance Criteria

1. THE Settings_Page SHALL contain a "Delete my account and all data" option in the Data section.
2. WHEN a user initiates account deletion, THE App SHALL display a first confirmation dialog explaining that this action is permanent and irreversible.
3. WHEN a user confirms the first dialog, THE App SHALL display a second confirmation dialog requiring the user to type a confirmation phrase before proceeding.
4. WHEN a user completes both confirmation steps, THE App SHALL delete all Firestore documents associated with the user's UID and then delete the Firebase Auth account.
5. WHEN account deletion is complete, THE App SHALL sign the user out and redirect to the home page (`/`).
6. IF the account deletion process fails at any step, THEN THE App SHALL display an error message and leave the account and data intact.

---

### Requirement 15: Privacy — Data Export

**User Story:** As a user, I want to export all my urge logs as a CSV file, so that I can keep a personal copy of my data.

#### Acceptance Criteria

1. THE Settings_Page SHALL contain a "Download my data" button in the Data section.
2. WHEN a user clicks "Download my data", THE App SHALL fetch all Urge_Log documents for the authenticated user from Firestore.
3. THE App SHALL generate a CSV file containing at minimum: timestamp, intensity, and note fields for each Urge_Log.
4. THE App SHALL trigger a browser file download of the generated CSV with a filename in the format `strandsmart-logs-YYYY-MM-DD.csv`.

---

### Requirement 16: Privacy — Backend Log Documentation

**User Story:** As a developer or user reviewing the codebase, I want it to be clearly documented that `detections.log` is local-only and never synced, so that there is no ambiguity about data handling.

#### Acceptance Criteria

1. THE README SHALL contain a section explicitly stating that `detections.log` is a local file, never synced to any server, and contains only detection metadata (timestamps, confidence scores, zone labels) with no image data or PII.
2. THE Dashboard CV status card SHALL display a note or tooltip stating that detection logs are local only and never transmitted.

---

### Requirement 17: Discreet Mode — Full Visual Transformation

**User Story:** As a user in a sensitive environment, I want discreet mode to make the app look like a completely different, generic notes app, so that no one can identify what I'm using.

#### Acceptance Criteria

1. WHEN Discreet_Mode is active, THE App SHALL apply a plain white background and black text throughout all visible pages.
2. WHEN Discreet_Mode is active, THE App SHALL apply an iOS Notes-style font (system-ui or similar sans-serif) to all text elements.
3. WHEN Discreet_Mode is active, THE App SHALL render urge logs as plain text note entries with timestamps in a notes-list layout.
4. WHEN Discreet_Mode is active, THE App SHALL replace the label "Log Urge" with "New Note" throughout the UI.
5. WHEN Discreet_Mode is active, THE App SHALL replace the label "Grounding" with "Focus" throughout the UI.
6. WHEN Discreet_Mode is active, THE App SHALL replace the label "Dashboard" with "Notes" throughout the UI.
7. WHEN Discreet_Mode is active, THE App SHALL replace the brand name "StrandSmart" with "Notes" throughout the UI.
8. WHEN Discreet_Mode is active, THE Dashboard SHALL not render the CV status card.
9. WHEN Discreet_Mode is active, THE useDetection hook SHALL pause sending frames over the WebSocket connection without closing the connection.
10. WHEN Discreet_Mode is deactivated, THE useDetection hook SHALL resume sending frames over the WebSocket connection.

---

### Requirement 18: Discreet Mode — Toggle Button Appearance

**User Story:** As a user, I want the discreet mode toggle to look like a standard iOS share icon rather than a labeled "Discreet" button, so that the toggle itself doesn't reveal what I'm hiding.

#### Acceptance Criteria

1. THE Navbar SHALL render the Discreet_Mode toggle as an icon-only button using an iOS share-style icon (upload/share arrow icon).
2. THE Discreet_Mode toggle button SHALL not display any text label such as "Discreet" or "Discreet Mode".
3. THE Discreet_Mode toggle button SHALL include an accessible `aria-label` attribute describing its function for screen readers.
4. WHEN Discreet_Mode is active, THE toggle button SHALL provide a visual indicator (e.g., filled vs. outline icon) that the mode is on, without using text.

---

### Requirement 19: Grounding — Infinity Loop Difficulty Setting

**User Story:** As a user doing the Strand Flow exercise, I want to choose a difficulty level before starting, so that the exercise is appropriately challenging for my skill level.

#### Acceptance Criteria

1. THE Grounding_Page Strand Flow tab SHALL display a difficulty selector with three options: Beginner, Intermediate, and Advanced, before the canvas session begins.
2. WHEN Beginner difficulty is selected, THE FidgetCanvas SHALL render the infinity guide path with a wider proximity tolerance (larger `PROXIMITY_R` value) and a slower guide pulse speed.
3. WHEN Intermediate difficulty is selected, THE FidgetCanvas SHALL render the infinity guide path with a standard proximity tolerance and standard guide pulse speed.
4. WHEN Advanced difficulty is selected, THE FidgetCanvas SHALL render the infinity guide path with a tighter proximity tolerance (smaller `PROXIMITY_R` value) and a faster guide pulse speed.
5. THE App SHALL persist the user's last selected difficulty to `localStorage` so it is pre-selected on the next visit.

---

### Requirement 20: Grounding — Exercise Dropdown Overflow Fix

**User Story:** As a user on the Techniques tab, I want the exercise cards to be scrollable rather than pushing content off screen when expanded, so that I can always access all content.

#### Acceptance Criteria

1. THE Grounding_Page Techniques tab container SHALL have a defined `max-height` and `overflow-y: auto` so that expanded exercise cards do not push content outside the viewport.
2. WHEN an exercise card is expanded, THE Grounding_Page SHALL not cause any content to be rendered outside the visible viewport without a scroll mechanism.

---

### Requirement 21: Grounding — Progress Indicator

**User Story:** As a user doing a grounding exercise, I want to see a visible progress indicator showing how long to engage, so that I know how much time remains.

#### Acceptance Criteria

1. THE Grounding_Page SHALL display a visible progress indicator (timer or progress bar) for each grounding exercise while it is active.
2. THE progress indicator SHALL show the remaining time or percentage of completion in real time.
3. THE FidgetCanvas progress bar already satisfies this requirement for the Strand Flow exercise; the same standard SHALL apply to the 5-4-3-2-1 challenge and technique cards.

---

### Requirement 22: Grounding — Warm Completion Screen

**User Story:** As a user who finishes a grounding exercise, I want a warm, affirming completion screen rather than an abrupt ending, so that the experience feels complete and encouraging.

#### Acceptance Criteria

1. WHEN a grounding exercise session completes, THE Grounding_Page SHALL display a warm completion screen with a message in the format: "Nice work. Your hands stayed busy for [duration]." or equivalent warm language.
2. THE completion screen SHALL offer two actions: "Log an urge" (navigates to the urge logging flow) and "Back to dashboard" (navigates to `/dashboard`).
3. THE completion screen SHALL not abruptly end the exercise without any transition or acknowledgment.

---

### Requirement 23: Settings Page — Structure and Routes

**User Story:** As a user, I want a dedicated settings page with clearly organized sections, so that I can find and change any preference without hunting through the app.

#### Acceptance Criteria

1. THE App SHALL render a Settings_Page at the `/settings` protected route requiring authentication.
2. THE Settings_Page SHALL contain the following sections: Profile, Dashboard, Data, Preferences, CV Detection, and Onboarding.
3. THE Navbar SHALL include a link or icon to navigate to `/settings` for authenticated users.

---

### Requirement 24: Settings — Profile Section

**User Story:** As a user, I want to edit my display name and email from settings, so that I can keep my profile information up to date.

#### Acceptance Criteria

1. THE Settings_Page Profile section SHALL display the user's current display name and email.
2. WHEN a user edits their display name and saves, THE App SHALL update the Firebase Auth profile `displayName` field.
3. WHEN a user edits their email and saves, THE App SHALL update the Firebase Auth account email.
4. IF the email update fails (e.g., requires re-authentication), THEN THE App SHALL display a descriptive error message.

---

### Requirement 25: Settings — Data Section

**User Story:** As a user, I want to view, manage, and export my urge logs from a single place in settings, so that I have full control over my data.

#### Acceptance Criteria

1. THE Settings_Page Data section SHALL display a list of all the user's Urge_Log entries.
2. WHEN a user clicks delete on an individual Urge_Log entry, THE App SHALL display a confirmation prompt before deleting the document from Firestore.
3. THE Settings_Page Data section SHALL include a "Delete all logs" button that requires a confirmation dialog before deleting all Urge_Log documents for the user.
4. THE Settings_Page Data section SHALL include the data export functionality described in Requirement 15.
5. THE Settings_Page Data section SHALL include the account deletion functionality described in Requirement 14.

---

### Requirement 26: Settings — Preferences Section

**User Story:** As a user, I want to set a default grounding difficulty and configure alert suppression duration, so that the app behaves the way I prefer without manual adjustment each time.

#### Acceptance Criteria

1. THE Settings_Page Preferences section SHALL include a selector for default grounding difficulty (Beginner, Intermediate, Advanced).
2. WHEN a user sets a default grounding difficulty, THE App SHALL pre-select that difficulty on the Grounding_Page Strand Flow tab.
3. THE Settings_Page Preferences section SHALL include a control for alert suppression duration (the time after dismissing a CV alert before it can fire again), with a range of 1 to 60 minutes.
4. WHEN a user changes the alert suppression duration, THE Detection_Overlay SHALL use the updated value for subsequent alert dismissals.

---

### Requirement 27: Settings — CV Detection Section

**User Story:** As a user, I want to manage CV detection settings from one place, so that I can toggle it on or off, adjust sensitivity, and understand the privacy implications.

#### Acceptance Criteria

1. THE Settings_Page CV Detection section SHALL include a toggle to enable or disable CV detection.
2. WHEN CV detection is disabled via the toggle, THE useDetection hook SHALL not open a WebSocket connection and THE Detection_Overlay SHALL not mount.
3. THE Settings_Page CV Detection section SHALL include a sensitivity slider that maps to the `distance_threshold` value in `backend/config.json`, with a visible label explaining what the slider controls.
4. THE Settings_Page CV Detection section SHALL include a link to `/privacy`.
5. THE Settings_Page CV Detection section SHALL include a note stating that `detections.log` is local only and never transmitted.

---

### Requirement 28: CV Detection — Authentication Gate

**User Story:** As a developer, I want the CV detection system to only activate for authenticated users, so that the WebSocket connection and camera access are never initiated for unauthenticated sessions.

#### Acceptance Criteria

1. THE Detection_Overlay SHALL not mount or render when the user is not authenticated (`currentUser === null`).
2. THE useDetection hook SHALL check Firebase Auth state before opening a WebSocket connection, and SHALL not open the connection if the user is not authenticated.
3. WHEN a CV alert fires and navigates the user to `/grounding`, THE user SHALL already be authenticated (the `/grounding` route is protected by `ProtectedRoute`).
4. WHEN a user signs out, THE useDetection hook SHALL close the WebSocket connection and stop sending frames.

---

### Requirement 29: README — Rewrite

**User Story:** As a developer or potential user reading the README, I want clear, warm, and accurate documentation covering what the app is, how to run it, and its privacy model, so that I can get started quickly and understand the project.

#### Acceptance Criteria

1. THE README SHALL contain an introductory paragraph describing what StrandSmart is and who it is for, written in warm, plain language with no clinical terminology.
2. THE README SHALL contain a Privacy section that explains: local inference, what data is collected, and what is never collected.
3. THE README SHALL contain a "How to run locally" section with instructions for: setting up the backend Python virtual environment (`venv311`), starting the backend with `uvicorn`, and starting the frontend with `npm start`.
4. THE README SHALL describe two usage paths: using the app without CV detection and using it with CV detection.
5. THE README SHALL contain a configuration guide for `distance_threshold` and `alert_duration_seconds` in `backend/config.json`.
6. THE README SHALL list the tech stack (React, Firebase, FastAPI, MediaPipe).
7. THE README SHALL list known limitations: desktop-only for CV, requires local backend, lighting affects accuracy.
8. THE README SHALL contain a Contributing section.
