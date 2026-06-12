import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Photo } from '../models/photo.model';
import { createPhotos } from '../utils/photo.utils';

const FAVORITES_STORAGE_KEY = 'favoriteIds';

@Injectable({ providedIn: 'root' })
export class FavoritesApi {
  getFavorites(): Observable<Photo[]> {
    const parsed = JSON.parse(
      localStorage.getItem(FAVORITES_STORAGE_KEY) ?? '[]',
    );
    const ids = Array.isArray(parsed)
      ? parsed.filter(
          (item): item is number =>
            typeof item === 'number' && Number.isFinite(item),
        )
      : [];

    return of(createPhotos(ids)).pipe(delay(200 + Math.random() * 100));
  }

  saveFavorites(photos: Photo[]): void {
    localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(photos.map((p) => p.id)),
    );
  }
}
