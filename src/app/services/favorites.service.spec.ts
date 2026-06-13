import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of, throwError, Subject, delay } from 'rxjs';
import { FavoritesService } from './favorites.service';
import { FavoritesApi } from '../api/favorites.api';
import { Photo } from '../models/photo.model';

const API_DELAY = 200;

function makePhoto(id: number): Photo {
  return { id, title: `Photo ${id}`, thumbnailUrl: '', fullUrl: '' };
}

function asyncFavorites(photos: Photo[]) {
  return of(photos).pipe(delay(API_DELAY));
}

describe('FavoritesService', () => {
  let service: FavoritesService;
  let apiSpy: { getFavorites: ReturnType<typeof vi.fn>; saveFavorites: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    vi.useFakeTimers();
    apiSpy = {
      getFavorites: vi.fn().mockReturnValue(asyncFavorites([])),
      saveFavorites: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: FavoritesApi, useValue: apiSpy }],
    });

    service = TestBed.inject(FavoritesService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts with empty favorites and not loading', () => {
    expect(service.favorites()).toEqual([]);
    expect(service.loading()).toBe(false);
  });

  describe('loadFavorites', () => {
    it('sets loading to true while request is in-flight', () => {
      service.loadFavorites();
      expect(service.loading()).toBe(true);
    });

    it('populates favorites from API after delay', () => {
      apiSpy.getFavorites.mockReturnValue(asyncFavorites([makePhoto(1), makePhoto(2)]));
      service.loadFavorites();
      vi.advanceTimersByTime(API_DELAY);
      expect(service.favorites()).toHaveLength(2);
      expect(service.favorites()[0].id).toBe(1);
    });

    it('clears loading flag after successful load', () => {
      apiSpy.getFavorites.mockReturnValue(asyncFavorites([makePhoto(1)]));
      service.loadFavorites();
      vi.advanceTimersByTime(API_DELAY);
      expect(service.loading()).toBe(false);
    });

    it('clears loading flag on API error', () => {
      apiSpy.getFavorites.mockReturnValue(throwError(() => new Error('fail')));
      service.loadFavorites();
      expect(service.loading()).toBe(false);
    });

    it('does not call API while already loading', () => {
      const pending = new Subject<Photo[]>();
      apiSpy.getFavorites.mockReturnValue(pending.asObservable());
      service.loadFavorites();
      service.loadFavorites();
      expect(apiSpy.getFavorites).toHaveBeenCalledTimes(1);
    });
  });

  describe('isFavorite', () => {
    it('returns false when photo is not a favorite', () => {
      expect(service.isFavorite(1)).toBe(false);
    });

    it('returns true after photo is added to favorites', () => {
      service.addToFavorites(makePhoto(1));
      expect(service.isFavorite(1)).toBe(true);
    });
  });

  describe('favoriteIds', () => {
    it('returns a Set of current favorite ids', () => {
      service.addToFavorites(makePhoto(1));
      service.addToFavorites(makePhoto(3));
      expect(service.favoriteIds()).toEqual(new Set([1, 3]));
    });
  });

  describe('addToFavorites', () => {
    it('adds a photo to favorites', () => {
      service.addToFavorites(makePhoto(5));
      expect(service.favorites().map((p) => p.id)).toContain(5);
    });

    it('persists via API', () => {
      service.addToFavorites(makePhoto(5));
      expect(apiSpy.saveFavorites).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ id: 5 })]),
      );
    });

    it('does not add duplicate', () => {
      service.addToFavorites(makePhoto(5));
      service.addToFavorites(makePhoto(5));
      expect(service.favorites()).toHaveLength(1);
    });
  });

  describe('removeFromFavorites', () => {
    it('removes a photo from favorites', () => {
      service.addToFavorites(makePhoto(5));
      service.removeFromFavorites(5);
      expect(service.isFavorite(5)).toBe(false);
    });

    it('persists via API after removal', () => {
      service.addToFavorites(makePhoto(5));
      apiSpy.saveFavorites.mockClear();
      service.removeFromFavorites(5);
      expect(apiSpy.saveFavorites).toHaveBeenCalledWith([]);
    });

    it('is a no-op for id that is not a favorite', () => {
      service.removeFromFavorites(999);
      expect(apiSpy.saveFavorites).not.toHaveBeenCalled();
    });
  });

  describe('toggleFavorite', () => {
    it('adds photo when it is not a favorite', () => {
      service.toggleFavorite(makePhoto(1));
      expect(service.isFavorite(1)).toBe(true);
    });

    it('removes photo when it is already a favorite', () => {
      service.addToFavorites(makePhoto(1));
      service.toggleFavorite(makePhoto(1));
      expect(service.isFavorite(1)).toBe(false);
    });
  });
});
