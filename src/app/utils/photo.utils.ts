import { Photo } from '../models';
import {
  PHOTO_THUMBNAIL_WIDTH,
  PHOTO_THUMBNAIL_HEIGHT,
  PHOTO_FULL_WIDTH,
  PHOTO_FULL_HEIGHT,
} from '../constants';

export function createPhoto(id: number): Photo {
  // Guard against non-numeric ids: even though template literals would produce
  // a valid URL with a string seed for picsum, just a architectural concept :)
  if (typeof id !== 'number' || !Number.isFinite(id)) {
    throw new TypeError(`createPhoto: id must be a finite number, got ${id}`);
  }

  return {
    id,
    title: `Photo ${id}`,
    thumbnailUrl: `https://picsum.photos/seed/${id}/${PHOTO_THUMBNAIL_WIDTH}/${PHOTO_THUMBNAIL_HEIGHT}`,
    fullUrl: `https://picsum.photos/seed/${id}/${PHOTO_FULL_WIDTH}/${PHOTO_FULL_HEIGHT}`,
  };
}

export function createPhotos(ids: number[]): Photo[] {
  return ids.map(createPhoto);
}
