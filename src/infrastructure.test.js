/**
 * Smoke test — verifies Jest can discover test files and fast-check is importable.
 * Feature: strandsmart-full-redesign, Task 1: testing infrastructure
 */
import * as fc from 'fast-check';

describe('Testing infrastructure', () => {
  test('fast-check is importable and functional', () => {
    // Verify fast-check can generate and assert a trivial property
    fc.assert(
      fc.property(fc.integer(), (n) => {
        return typeof n === 'number';
      }),
      { numRuns: 10 }
    );
  });

  test('Jest is running and assertions work', () => {
    expect(1 + 1).toBe(2);
  });
});
