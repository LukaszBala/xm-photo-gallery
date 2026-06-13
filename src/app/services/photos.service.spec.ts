import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of, throwError, delay, Observable } from 'rxjs';
import { PhotosService } from './photos.service';
import { PhotosApi, PhotosPage } from '../api/photos.api';

const API_DELAY = 200;

function makePageResult(
  startId: number,
  count: number,
  hasMore: boolean,
): PhotosPage {
  const photos = Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    title: `Photo ${startId + i}`,
    thumbnailUrl: '',
    fullUrl: '',
  }));
  return { photos, hasMore };
}

function asyncPage(
  startId: number,
  count: number,
  hasMore: boolean,
): Observable<PhotosPage> {
  return of(makePageResult(startId, count, hasMore)).pipe(delay(API_DELAY));
}

describe('PhotosService', () => {
  let service: PhotosService;
  let apiSpy: { getPage: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    vi.useFakeTimers();
    apiSpy = { getPage: vi.fn() };

    TestBed.configureTestingModule({
      providers: [{ provide: PhotosApi, useValue: apiSpy }],
    });

    service = TestBed.inject(PhotosService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts with empty photos, not loading, and hasMore true', () => {
    expect(service.photos()).toEqual([]);
    expect(service.loading()).toBe(false);
    expect(service.hasMore()).toBe(true);
  });

  it('sets loading to true while request is in-flight', () => {
    apiSpy.getPage.mockReturnValue(asyncPage(1, 12, true));
    service.loadPhotos();
    expect(service.loading()).toBe(true);
  });

  it('appends returned photos and increments page after delay', () => {
    apiSpy.getPage.mockReturnValue(asyncPage(1, 12, true));
    service.loadPhotos();
    vi.advanceTimersByTime(API_DELAY);
    expect(service.photos()).toHaveLength(12);
    expect(service.photos()[0].id).toBe(1);
    // First loading of photos loads page 0
    expect(apiSpy.getPage).toHaveBeenCalledWith(0);
  });

  it('loads subsequent page on second call', () => {
    apiSpy.getPage.mockReturnValueOnce(asyncPage(1, 12, true));
    service.loadPhotos();
    vi.advanceTimersByTime(API_DELAY);

    apiSpy.getPage.mockReturnValueOnce(asyncPage(13, 12, true));
    service.loadPhotos();
    vi.advanceTimersByTime(API_DELAY);

    expect(service.photos()).toHaveLength(24);
    expect(apiSpy.getPage).toHaveBeenCalledWith(1);
  });

  it('sets hasMore to false when API signals no more pages', () => {
    apiSpy.getPage.mockReturnValue(asyncPage(1, 5, false));
    service.loadPhotos();
    vi.advanceTimersByTime(API_DELAY);
    expect(service.hasMore()).toBe(false);
  });

  it('does not call API again when hasMore is false', () => {
    apiSpy.getPage.mockReturnValue(asyncPage(1, 5, false));
    service.loadPhotos();
    vi.advanceTimersByTime(API_DELAY);

    service.loadPhotos();
    vi.advanceTimersByTime(API_DELAY);

    expect(apiSpy.getPage).toHaveBeenCalledTimes(1);
  });

  it('clears loading flag after successful load', () => {
    apiSpy.getPage.mockReturnValue(asyncPage(1, 12, true));
    service.loadPhotos();
    vi.advanceTimersByTime(API_DELAY);
    expect(service.loading()).toBe(false);
  });

  it('does not call API while already loading', () => {
    apiSpy.getPage.mockReturnValue(asyncPage(1, 12, true));
    service.loadPhotos();
    service.loadPhotos(); // in-flight, should be ignored
    vi.advanceTimersByTime(API_DELAY);
    expect(apiSpy.getPage).toHaveBeenCalledTimes(1);
  });

  it('clears loading flag on API error', () => {
    apiSpy.getPage.mockReturnValue(
      throwError(() => new Error('network error')),
    );
    service.loadPhotos();
    expect(service.loading()).toBe(false);
  });
});
