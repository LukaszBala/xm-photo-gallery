import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { FavoritesApi } from './favorites.api';
import { Photo } from '../models/photo.model';
import { API_DELAY_MIN_MS, API_DELAY_JITTER_MS } from '../const/api';
import { FAVORITES_STORAGE_KEY } from '../const/favorites';

const STORAGE_KEY = FAVORITES_STORAGE_KEY;
const FLUSH_MS = API_DELAY_MIN_MS + API_DELAY_JITTER_MS + 100;

describe('FavoritesApi', () => {
  let api: FavoritesApi;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    api = TestBed.inject(FavoritesApi);
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  describe('getFavorites', () => {
    it('returns empty array when storage is empty', async () => {
      const promise = firstValueFrom(api.getFavorites());
      vi.advanceTimersByTime(FLUSH_MS);
      expect(await promise).toEqual([]);
    });

    it('returns photos for stored ids', async () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([1, 2, 3]));
      const promise = firstValueFrom(api.getFavorites());
      vi.advanceTimersByTime(FLUSH_MS);
      const photos = await promise;
      expect(photos.map((p) => p.id)).toEqual([1, 2, 3]);
    });

    it('ignores non-numeric entries in stored ids', async () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([1, 'bad', null, 2]));
      const promise = firstValueFrom(api.getFavorites());
      vi.advanceTimersByTime(FLUSH_MS);
      const photos = await promise;
      expect(photos.map((p) => p.id)).toEqual([1, 2]);
    });

    it('handles malformed (non-array) storage value gracefully', async () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ not: 'an array' }));
      const promise = firstValueFrom(api.getFavorites());
      vi.advanceTimersByTime(FLUSH_MS);
      expect(await promise).toEqual([]);
    });

    it('returns empty array on invalid JSON in storage', async () => {
      localStorage.setItem(STORAGE_KEY, 'not valid json{{');
      const promise = firstValueFrom(api.getFavorites());
      vi.advanceTimersByTime(FLUSH_MS);
      expect(await promise).toEqual([]);
    });
  });

  describe('saveFavorites', () => {
    it('persists photo ids to localStorage', () => {
      const photos: Photo[] = [
        { id: 1, title: 'Photo 1', thumbnailUrl: '', fullUrl: '' },
        { id: 2, title: 'Photo 2', thumbnailUrl: '', fullUrl: '' },
      ];
      api.saveFavorites(photos);
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')).toEqual([1, 2]);
    });

    it('overwrites previously stored ids', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([5, 6]));
      api.saveFavorites([{ id: 10, title: 'Photo 10', thumbnailUrl: '', fullUrl: '' }]);
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')).toEqual([10]);
    });

    it('stores empty array when given no photos', () => {
      api.saveFavorites([]);
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')).toEqual([]);
    });
  });
});
