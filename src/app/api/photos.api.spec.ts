import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { PhotosApi } from './photos.api';
import { API_DELAY_MIN_MS, API_DELAY_JITTER_MS } from '../const/api';
import { PHOTOS_PAGE_SIZE, PHOTOS_TOTAL } from '../const/photos';

const FLUSH_MS = API_DELAY_MIN_MS + API_DELAY_JITTER_MS + 100;

describe('PhotosApi', () => {
  let api: PhotosApi;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    api = TestBed.inject(PhotosApi);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getPage', () => {
    it('returns PHOTOS_PAGE_SIZE photos for page 0', async () => {
      const promise = firstValueFrom(api.getPage(0));
      vi.advanceTimersByTime(FLUSH_MS);
      const { photos } = await promise;
      expect(photos).toHaveLength(PHOTOS_PAGE_SIZE);
    });

    it('first page starts at id 1', async () => {
      const promise = firstValueFrom(api.getPage(0));
      vi.advanceTimersByTime(FLUSH_MS);
      const { photos } = await promise;
      expect(photos[0].id).toBe(1);
      expect(photos[PHOTOS_PAGE_SIZE - 1].id).toBe(PHOTOS_PAGE_SIZE);
    });

    it('second page continues from id 13', async () => {
      const promise = firstValueFrom(api.getPage(1));
      vi.advanceTimersByTime(FLUSH_MS);
      const { photos } = await promise;
      expect(photos[0].id).toBe(13);
    });

    it('sets hasMore to true when more pages exist', async () => {
      const promise = firstValueFrom(api.getPage(0));
      vi.advanceTimersByTime(FLUSH_MS);
      const { hasMore } = await promise;
      expect(hasMore).toBe(true);
    });

    it('sets hasMore to false on the last page', async () => {
      const lastPage = Math.ceil(PHOTOS_TOTAL / PHOTOS_PAGE_SIZE) - 1;
      const promise = firstValueFrom(api.getPage(lastPage));
      vi.advanceTimersByTime(FLUSH_MS);
      const { hasMore } = await promise;
      expect(hasMore).toBe(false);
    });

    it('returns photos with valid thumbnailUrl and fullUrl', async () => {
      const promise = firstValueFrom(api.getPage(0));
      vi.advanceTimersByTime(FLUSH_MS);
      const { photos } = await promise;
      expect(photos[0].thumbnailUrl).toContain('picsum.photos');
      expect(photos[0].fullUrl).toContain('picsum.photos');
    });
  });

  describe('getById', () => {
    it('returns a photo with the requested id', async () => {
      const promise = firstValueFrom(api.getById(7));
      vi.advanceTimersByTime(FLUSH_MS);
      expect((await promise)?.id).toBe(7);
    });

    it('returns a photo with the correct title', async () => {
      const promise = firstValueFrom(api.getById(3));
      vi.advanceTimersByTime(FLUSH_MS);
      expect((await promise)?.title).toBe('Photo 3');
    });
  });
});
