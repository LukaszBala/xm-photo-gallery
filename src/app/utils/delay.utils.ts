import { API_DELAY_MIN_MS, API_DELAY_JITTER_MS } from '../const/api';

export function apiDelay(): number {
  return API_DELAY_MIN_MS + Math.random() * API_DELAY_JITTER_MS;
}
