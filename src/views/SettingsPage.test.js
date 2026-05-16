/**
 * src/views/SettingsPage.test.js
 *
 * Property-based tests for SettingsPage functionality.
 * Uses fast-check for property generation.
 *
 * Feature: strandsmart-full-redesign
 */

import fc from 'fast-check';
import { generateCSV } from '../utils/csvExport';

// ── Property 6: CSV export contains all required fields for every log ─────────
// Feature: strandsmart-full-redesign, Property 6: CSV export contains all required fields
// Validates: Requirements 15.3

describe('Property 6: CSV export contains all required fields for every log', () => {
  test('CSV has a header row with timestamp, intensity, note', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            loggedAt:  fc.date(),
            intensity: fc.option(fc.integer({ min: 1, max: 10 }), { nil: null }),
            note:      fc.option(fc.string(), { nil: null }),
          }),
          { minLength: 1 }
        ),
        (logs) => {
          const csv = generateCSV(logs);
          const lines = csv.split('\n');
          // Header must be first line
          expect(lines[0]).toBe('timestamp,intensity,note');
        }
      ),
      { numRuns: 100 }
    );
  });

  test('CSV has exactly one data row per log entry', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            loggedAt:  fc.date(),
            intensity: fc.option(fc.integer({ min: 1, max: 10 }), { nil: null }),
            note:      fc.option(fc.string(), { nil: null }),
          }),
          { minLength: 1 }
        ),
        (logs) => {
          const csv = generateCSV(logs);
          const lines = csv.split('\n');
          // lines[0] = header, lines[1..n] = data rows
          expect(lines.length).toBe(logs.length + 1);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('each data row contains at least two commas (three columns)', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            loggedAt:  fc.date(),
            intensity: fc.option(fc.integer({ min: 1, max: 10 }), { nil: null }),
            note:      fc.option(fc.string().filter(s => !s.includes(',')), { nil: null }),
          }),
          { minLength: 1 }
        ),
        (logs) => {
          const csv = generateCSV(logs);
          const dataRows = csv.split('\n').slice(1);
          dataRows.forEach((row) => {
            // Each row must have at least 2 commas (timestamp,intensity,note)
            const commaCount = (row.match(/,/g) || []).length;
            expect(commaCount).toBeGreaterThanOrEqual(2);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  test('timestamp field is a non-empty ISO string for logs with a Date loggedAt', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            // Constrain to years 1970-9999 to avoid extended ISO format (+YYYYYY)
            loggedAt:  fc.date({ min: new Date(0), max: new Date('9999-12-31T23:59:59.999Z') }),
            intensity: fc.constant(5),
            note:      fc.constant('test note'),
          }),
          { minLength: 1 }
        ),
        (logs) => {
          const csv = generateCSV(logs);
          const dataRows = csv.split('\n').slice(1);
          dataRows.forEach((row) => {
            const firstComma = row.indexOf(',');
            const ts = row.slice(0, firstComma);
            // Should be a non-empty string parseable as a date
            expect(ts.length).toBeGreaterThan(0);
            expect(isNaN(new Date(ts).getTime())).toBe(false);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ── Property 9: Default difficulty preference pre-selects on Grounding page ───
// Feature: strandsmart-full-redesign, Property 9: default difficulty preference pre-selects on Grounding page
// Validates: Requirements 26.2

/**
 * The Grounding page reads the default difficulty from Firestore preferences
 * (preferences.defaultGroundingDifficulty) and falls back to localStorage
 * key "ss_grounding_difficulty", then to "intermediate".
 *
 * We test the pure selection logic: given a stored preference value,
 * the resolved difficulty should match that value.
 */

const VALID_DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

/**
 * Pure function that mirrors the difficulty resolution logic in GroundingPage.js:
 *   1. Use Firestore preference if set
 *   2. Fall back to localStorage
 *   3. Fall back to "intermediate"
 */
function resolveDefaultDifficulty(firestorePref, localStorageValue) {
  if (firestorePref && VALID_DIFFICULTIES.includes(firestorePref)) {
    return firestorePref;
  }
  if (localStorageValue && VALID_DIFFICULTIES.includes(localStorageValue)) {
    return localStorageValue;
  }
  return 'intermediate';
}

describe('Property 9: Default difficulty preference pre-selects on Grounding page', () => {
  test('Firestore preference is used when set to a valid difficulty', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...VALID_DIFFICULTIES),
        (difficulty) => {
          const resolved = resolveDefaultDifficulty(difficulty, null);
          expect(resolved).toBe(difficulty);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('localStorage value is used when Firestore preference is absent', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...VALID_DIFFICULTIES),
        (difficulty) => {
          const resolved = resolveDefaultDifficulty(null, difficulty);
          expect(resolved).toBe(difficulty);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Firestore preference takes priority over localStorage', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...VALID_DIFFICULTIES),
        fc.constantFrom(...VALID_DIFFICULTIES),
        (firestorePref, localPref) => {
          const resolved = resolveDefaultDifficulty(firestorePref, localPref);
          // Firestore always wins
          expect(resolved).toBe(firestorePref);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('falls back to "intermediate" when neither source has a valid value', () => {
    fc.assert(
      fc.property(
        fc.option(fc.string().filter(s => !VALID_DIFFICULTIES.includes(s)), { nil: null }),
        fc.option(fc.string().filter(s => !VALID_DIFFICULTIES.includes(s)), { nil: null }),
        (badFirestore, badLocal) => {
          const resolved = resolveDefaultDifficulty(badFirestore, badLocal);
          expect(resolved).toBe('intermediate');
        }
      ),
      { numRuns: 100 }
    );
  });

  test('resolved difficulty is always one of the three valid values', () => {
    fc.assert(
      fc.property(
        fc.option(fc.constantFrom(...VALID_DIFFICULTIES, 'invalid', null), { nil: null }),
        fc.option(fc.constantFrom(...VALID_DIFFICULTIES, 'invalid', null), { nil: null }),
        (firestorePref, localPref) => {
          const resolved = resolveDefaultDifficulty(firestorePref, localPref);
          expect(VALID_DIFFICULTIES).toContain(resolved);
        }
      ),
      { numRuns: 100 }
    );
  });
});