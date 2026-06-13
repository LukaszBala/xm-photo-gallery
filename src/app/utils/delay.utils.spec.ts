import { describe, expect, it } from 'vitest';
import { API_DELAY_JITTER_MS, API_DELAY_MIN_MS } from '../consts/api';
import { apiDelay } from './delay.utils';

describe('apiDelay', () => {
  it('returns a number within the expected range', () => {
    const result = apiDelay();
    expect(result).toBeGreaterThanOrEqual(API_DELAY_MIN_MS);
    expect(result).toBeLessThan(API_DELAY_MIN_MS + API_DELAY_JITTER_MS);
  });

  it('returns a different value on each call', () => {
    const results = new Set(Array.from({ length: 20 }, () => apiDelay()));
    expect(results.size).toBeGreaterThan(1);
  });
});
