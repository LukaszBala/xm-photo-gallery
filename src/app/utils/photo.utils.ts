import { Photo } from '../models/photo.model';

export function createPhoto(id: number): Photo {
  return {
    id,
    title: `Photo ${id}`,
    thumbnailUrl: `https://picsum.photos/seed/${id}/400/300`,
    fullUrl: `https://picsum.photos/seed/${id}/1200/800`,
  };
}

export function createPhotos(ids: number[]): Photo[] {
  return ids.map(createPhoto);
}
