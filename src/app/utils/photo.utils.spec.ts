import { describe, it, expect } from 'vitest';
import { createPhoto, createPhotos } from './photo.utils';
import {
  PHOTO_THUMBNAIL_WIDTH,
  PHOTO_THUMBNAIL_HEIGHT,
  PHOTO_FULL_WIDTH,
  PHOTO_FULL_HEIGHT,
} from '../consts/photos';

describe('createPhoto', () => {
  it('creates a photo with the given id', () => {
    const photo = createPhoto(42);
    expect(photo.id).toBe(42);
  });

  it('sets title to "Photo <id>"', () => {
    expect(createPhoto(1).title).toBe('Photo 1');
    expect(createPhoto(99).title).toBe('Photo 99');
  });

  it('builds thumbnailUrl with correct dimensions', () => {
    expect(createPhoto(5).thumbnailUrl).toBe(
      `https://picsum.photos/seed/5/${PHOTO_THUMBNAIL_WIDTH}/${PHOTO_THUMBNAIL_HEIGHT}`,
    );
  });

  it('builds fullUrl with correct dimensions', () => {
    expect(createPhoto(5).fullUrl).toBe(
      `https://picsum.photos/seed/5/${PHOTO_FULL_WIDTH}/${PHOTO_FULL_HEIGHT}`,
    );
  });

  it('throws TypeError for non-numeric id', () => {
    expect(() => createPhoto('abc' as unknown as number)).toThrow(TypeError);
  });

  it('throws TypeError for NaN', () => {
    expect(() => createPhoto(NaN)).toThrow(TypeError);
  });

  it('throws TypeError for Infinity', () => {
    expect(() => createPhoto(Infinity)).toThrow(TypeError);
  });
});

describe('createPhotos', () => {
  it('returns an empty array for empty input', () => {
    expect(createPhotos([])).toEqual([]);
  });

  it('maps each id to a photo', () => {
    const photos = createPhotos([1, 2, 3]);
    expect(photos).toHaveLength(3);
    expect(photos.map((p) => p.id)).toEqual([1, 2, 3]);
  });

  it('preserves order', () => {
    const photos = createPhotos([10, 5, 1]);
    expect(photos[0].id).toBe(10);
    expect(photos[2].id).toBe(1);
  });
});
